export { IProxy, ProxyOptions, ProxyResult, ProxyErrors, localProxy } from './proxy'
export { ConnectorSetting, StroeSetting, Request, StroeOptions, Connect, Store } from './store'

export interface Maps<T> extends Record<string, T> {}