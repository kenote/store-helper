import { Maps } from './'

/**
 * 存储代理器接口
 */
export interface IProxy {

  /**
   * 上传文件
   * @param file NodeJS.ReadableStream
   * @param options ProxyOptions
   * @param done (err: any, doc: ProxyResult) => void
   */
  upload (file: NodeJS.ReadableStream, options: ProxyOptions, done: (err: any, doc: ProxyResult) => void): void

}

/**
 * 本地存储代理器
 */
export class localProxy implements IProxy {

  /**
   * 上传文件
   * @param file NodeJS.ReadableStream
   * @param options ProxyOptions
   * @param done (err: any, doc: ProxyResult) => void
   */
  upload (file: NodeJS.ReadableStream, options: ProxyOptions, done: (err: any, doc: ProxyResult) => void): void
}

/**
 * 存储代理器选项
 */
export interface ProxyOptions extends Maps<any> {

  /**
   * 文件名
   */
  filename            : string

  /**
   * 使用源文件名称
   */
  original_name      ?: boolean

  /**
   * 文件存储目录
   */
  root_dir           ?: string
}

/**
 * 接口上传文件返回
 */
export interface ProxyResult extends Maps<any> {

  /**
   * Key
   */
  key                 : string

  /**
   * 文件保存路径
   */
  path               ?: string

  /**
   * URL 地址
   */
  url                 : string

  /**
   * 文件大小
   */
  size               ?: number
}

/**
 * 接口错误号
 */
export interface ProxyErrors {

  /**
   * 文件类型
   */
  mimetype            : number

  /**
   * 文件长度
   */
  limit               : number
}
