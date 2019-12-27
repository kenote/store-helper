import * as busboy from 'busboy'
import * as bytes from 'bytes'
import { StroeSetting, Maps, IProxy, ConnectorSetting, Request, StroeOptions, ProxyResult, ProxyErrors } from '../types'

/**
 * 存储器类
 */
export class Store {

  /**
   * 存储代理器
   */
  private __Proxys?: Maps<IProxy>

  /**
   * 错误号
   */
  private __Errors?: ProxyErrors

  /**
   * HTTP Request 对象
   */
  private __Request: Request

  /**
   * 存储器选项
   */
  private __Options: StroeOptions

  constructor (setting: StroeSetting) {
    this.__Request = setting.request
    this.__Options = setting.options || {
      type: 'local',
      max_size: '4MB',
      root_dir: 'uploadfiles'
    }
  }

  /**
   * 异步保存文件
   * @param errInfo 
   */
  public asyncSave (errInfo: (code: number, opts?: any) => any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.__save((err, doc) => {
        if (err) {
          reject(errInfo(err, doc))
        }
        else {
          let { root_url, type } = this.__Options
          if (root_url && type === 'local') {
            let data: ProxyResult[] = <ProxyResult[]> doc
            data = data.map( item => ({ ...item, url: `${root_url}/${item.url}` }))
            resolve(data)
          }
          else {
            resolve(doc)
          }
          
        }
      })
    })
  }

  private __save (done: (err: number | null, doc: Array<string | ProxyResult>) => void): void {
    let { headers, query } = this.__Request
    let Busboy: busboy.Busboy = new busboy({
      headers,
      limits: {
        fileSize: bytes(this.__Options.max_size)
      }
    })
    let dir: string | undefined = query.dir
    let _filename: string | undefined = query.filename
    let sub_dir: string = ''
    if (dir && this.__Options.type === 'local') {
      sub_dir = dir.replace(/^(\/)|(\/)$/g, '') + '/'
    }
    let files: ProxyResult[] = []
    let _errors: ProxyErrors = this.__Errors || { mimetype: 1, limit: 2 }
    let _proxys: Maps<IProxy> = this.__Proxys || {}
    Busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
      let { mime_type, max_size, type, root_dir, original_name } = this.__Options
      if (mime_type && mime_type.indexOf(mimetype) === -1) {
        return done(_errors.mimetype, [mimetype])
      }
      let fileSize: number = 0
      file.on('data', (data: Buffer): void => {
        fileSize += data.length
      })
      file.on('limit', () => {
        return done(_errors.limit, [max_size])
      })
      let proxy: IProxy = _proxys[type || 'local']
      proxy.upload(file, { 
        filename: sub_dir + (_filename || filename),
        root_dir,
        original_name
      }, (err, result) => {
        _filename = undefined
        if (result) {
          files.push({ ...result, size: fileSize })
        }
      })
    })
    Busboy.on('finish', () => done(null, files))
    this.__Request.pipe(Busboy)
  }
}

/**
 * 连接存储器
 * @param setting ConnectorSetting
 */
export function Connect (setting: ConnectorSetting): any {
  return function (target: any): void {
    target.prototype.__Proxys = setting.proxys
    target.prototype.__Errors = setting.errors
  }
}
