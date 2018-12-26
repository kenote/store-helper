import * as path from 'path'
import * as fs from 'fs-extra'
import * as crypto from 'crypto'
import { zipObject } from 'lodash'
import { ProxyOptions, ProxyResult } from '../store'

class LocalProxy {

  public upload (file: NodeJS.ReadableStream, options: ProxyOptions, done: (err: any, doc: ProxyResult) => void): void {
    let { filename, original_name, root_dir } = options
    let fileMatch: RegExpMatchArray = filename.match(/(.*\/)*([^.]+.*)/) || []
    let { sub_dir, file_name } = zipObject(['file_path','sub_dir', 'file_name'], fileMatch)
    let rootDir: string = root_dir || path.resolve(process.cwd(), 'uploadfile')
    rootDir = path.resolve(rootDir, sub_dir || '')
    let extname: string = path.extname(file_name)
    let newFilename: string = original_name 
      ? file_name 
      : crypto.createHash('md5').update(new Date().getTime().toString()).digest('hex') + extname
    let filePath: string = path.resolve(rootDir, newFilename)
    !fs.existsSync(rootDir) && fs.mkdirpSync(rootDir)

    file.on('end', (): void => done(null, {
      key: sub_dir + newFilename,
      path: filePath,
      url: newFilename + `?sub_dir=${(<string> sub_dir).replace(/(\/)$/, '')}`
    }))
    file.pipe(fs.createWriteStream(filePath))
  }
}

export default new LocalProxy()