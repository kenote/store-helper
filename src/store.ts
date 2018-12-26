import * as path from 'path'
import * as http from 'http'
import * as busboy from 'busboy'
import * as bytes from 'bytes'
import { pick } from 'lodash'

export interface StoreSetting {
  [propsName: string]: StoreItem;
}

export interface StoreItem {
  type: string;
  root_dir?: string;
  root_url?: string;
  max_size: string;
  mime_type?: string[];
  original_name?: boolean;
}

interface UploadSetting {
  request: Request;
  store?: StoreItem;
}

interface UploadError {
  mimetype: number;
  limit: number;
}

interface UploadProxy {
  [propsName: string]: Proxy
}

interface Proxy {
  upload: (file: NodeJS.ReadableStream, options: ProxyOptions, done: (err: any, doc: any) => void) => void
}

export interface ProxyOptions {
  filename: string;
  original_name?: boolean;
  root_dir?: string;
}

export interface ProxyResult {
  key: string;
  path?: string;
  url: string;
  size?: number;
}

interface Request {
  headers: http.IncomingHttpHeaders;
  pipe: (destination: busboy.Busboy, options?: {
      end?: boolean | undefined;
  } | undefined) => busboy.Busboy;
  query: any;
}

export class Upload {
  private __Request: Request;

  protected __Store: StoreItem;
  private __Error: UploadError;
  private __Proxy: UploadProxy;

  constructor (setting: UploadSetting) {
    this.__Request = setting.request
    this.__Store = setting.store || {
      type: 'local',
      max_size: '4MB',
    }
  }

  public save (done: (err: number | null, doc: Array<string | ProxyResult>) => void): void {
    let Busboy: busboy.Busboy = new busboy({
      headers: this.__Request.headers,
      limits: {
        fileSize: bytes(this.__Store.max_size)
      }
    })
    let { dir } = this.__Request.query
    let sub_dir: string = ''
    if (dir && this.__Store.type === 'local') {
      sub_dir = (<string> dir).replace(/^(\/)|(\/)$/g, '') + '/'
    }
    let files: ProxyResult[] = []
    Busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string): void => {
      if(this.__Store.mime_type && this.__Store.mime_type.indexOf(mimetype) === -1) {
        return done(this.__Error.mimetype, [mimetype])
      }
      let fileSize: number = 0
      file.on('data', (data: Buffer): void => {
        fileSize += data.length
      })
      file.on('limit', (): void => {
        return done(this.__Error.limit, [this.__Store.max_size])
      })
      let proxy: Proxy = this.__Proxy[this.__Store.type]
      proxy.upload(file, { 
        filename: sub_dir + filename, 
        root_dir: this.__Store.root_dir 
      }, (err: number, result: ProxyResult): void => {
        if (result) {
          files.push({ ...result, size: fileSize })
        }
      })
    })
    Busboy.on('finish', () => done(null, files) )
    this.__Request.pipe(Busboy)
  }
}

export function UploadSetting (error: UploadError, proxy: UploadProxy): any {
  return function (target: any): void {
    target.prototype.__Error = error
    target.prototype.__Proxy = proxy
  }
}

export function parseResult (doc: ProxyResult[], store: StoreItem, root_url: string): ProxyResult[] {
  let data: ProxyResult[] = [];
  doc.forEach((item: ProxyResult, i) => {
    let info: ProxyResult = pick(item, ['key', 'url', 'size'])
    if (store.type === 'local' && store.root_url) {
      info.url = store.root_url.replace(/^(\@)/, `${root_url}/`) + '/' + item.url
    }
    data.push(info)
  })
  return data
}

export function paeseStore (setting: StoreSetting | undefined, root: string): void {
  if (!setting) return;
  for (let store in setting) {
    let item: StoreItem = setting[store]
    if (item.root_dir) {
      setting[store].root_dir = path.resolve(process.cwd(), item.root_dir.replace(/^(\@)/, `${root}/`))
    }
  }
}