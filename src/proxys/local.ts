
import * as path from 'path'
import * as crypto from 'crypto'
import * as fs from 'fs-extra'
import { zipObject } from 'lodash'
import { IProxy, ProxyOptions, ProxyResult } from '../../types'

/**
 * 存储代理器
 */
export default class Proxy implements IProxy {

  /**
   * 上传文件
   * @param file NodeJS.ReadableStream
   * @param options ProxyOptions
   * @param done (err: any, doc: ProxyResult) => void
   */
  public upload (file: NodeJS.ReadableStream, options: ProxyOptions, done: (err: any, doc: ProxyResult) => void): void {
    let { filename, original_name, root_dir } = options
    let fileMatch: RegExpMatchArray = filename.match(/(.*\/)*([^.]+.*)/) || []
    let { sub_dir, file_name } = zipObject(['file_path', 'sub_dir', 'file_name'], fileMatch)
    let rootDir: string = path.resolve(process.cwd(), root_dir || 'uploadfile', sub_dir || '')
    let extname: string = path.extname(filename)
    let newFileName: string = original_name
      ? file_name
      : crypto.createHash('md5').update(Date.now().toString()).digest('hex') + extname
    !fs.existsSync(rootDir) && fs.mkdirpSync(rootDir)
    let filePath: string = path.resolve(rootDir, newFileName)
    file.on('end', () => {
      return done(null, {
        key: (sub_dir || '') + newFileName,
        path: filePath,
        url: newFileName + (sub_dir ? `?sub_dir=${(<string> sub_dir).replace(/(\/)$/, '')}` : '')
      })
    })
    file.pipe(fs.createWriteStream(filePath))
  }
}
