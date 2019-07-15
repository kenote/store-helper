import * as http from 'http'
import * as busboy from 'busboy'
import {  Maps, IProxy, ProxyErrors } from './'

/**
 * 连接器配置
 */
export interface ConnectorSetting {
  
  /**
   * 存储代理器集合
   */
  proxys             : Maps<IProxy>

  /**
   * 绑定相关警告错误号
   */
  errors             ?: ProxyErrors

}

/**
 * 存储器配置
 */
export interface StroeSetting {

  /**
   * 接入 Request 对象
   */
  request            : Request

  /**
   * 存储器选项
   */
  options            : StroeOptions

}

/**
 * 存储器选项
 */
export interface StroeOptions {

  /**
   * 类型
   */
  type               : string

  /**
   * 最大上传文件大小
   */
  max_size           : string

  /**
   * 支持文件类型
   */
  mime_type         ?: string[]

  /**
   * 主目录
   */
  root_dir          ?: string

  /**
   * 使用源文件名称
   */
  original_name     ?: boolean

  /**
   * 主URL地址
   */
  root_url          ?: string
}

/**
 * 模拟 Request 对象
 */
export interface Request {
  
  /**
   * Headers
   */
  headers            : http.IncomingHttpHeaders

  /**
   * Pipe
   */
  pipe               : pipeHandler

  /**
   * Query
   */
  query              : any
}

type pipeHandler = (destination: busboy.Busboy, options?: {
  end?: boolean | undefined
} | undefined) => busboy.Busboy