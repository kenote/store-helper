import {
  Upload as upload,
  UploadSetting as uploadSetting,
  parseResult as ParseResult,
  paeseStore as PaeseStore,
  StoreSetting as storeSetting,
  StoreItem as storeItem,
  ProxyOptions as proxyOptions,
  ProxyResult as proxyResult
} from './store'
import { default as localProxy } from './proxys/local'

export class Upload extends upload {}

export const UploadSetting: typeof uploadSetting

export const parseResult: typeof ParseResult

export const paeseStore: typeof PaeseStore

export interface StoreSetting extends storeSetting {}

export interface StoreItem extends storeItem {}

export interface ProxyOptions extends proxyOptions {}

export interface ProxyResult extends proxyResult {}

export const LocalProxy: typeof localProxy