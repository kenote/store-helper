export { IProxy, ProxyOptions, ProxyResult, ProxyErrors } from './proxy'
export { ConnectorSetting, StroeSetting, Request, StroeOptions } from './store'
export { Store, Connect, localProxy } from '../src'

export interface Maps<T> extends Record<string, T> {}