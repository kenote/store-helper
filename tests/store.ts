

import { Store, Connect, localProxy } from '../src'

@Connect({
  proxys: {
    local: new localProxy()
  },
  errors: {
    mimetype: 1001,
    limit: 1002
  }
})
export default class IStore extends Store {}
