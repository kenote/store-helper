# store-helper

Upload Store's Helper.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Gratipay][licensed-image]][licensed-url]

## Installation

```bash
$ yarn add kenote-store-helper
$ npm install kenote-store-helper
# Or
$ yarn add kenote-store-helper
```

## Usages

`app.ts`

```ts
import * as http from 'http'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { StroeOptions } from 'kenote-store-helper'

const store: StroeOptions = {
  type: 'local',
  max_size: '2MB',
  root_dir: 'uploadfiles',
  root_url: 'http://localhost',
  mime_type: ['image/png', 'image/jpeg']
}

const app: express.Application = express()
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))

app.post('/upload', async (req, res, next) => {
  try {
    let result: ProxyResult = await new IStore({ request: req, options: store }).asyncSave(ErrorInfo)
    return res.json(result)
  } catch (error) {
    return res.json(error)
  }
})

http.createServer(app).listen(3000)

function ErrorInfo (code: number, opts?: any) {
  return {
    code,
    message: opts && opts.join(',')
  }
}
```

`store`

```ts
import { Store, Connect, localProxy } from 'kenote-store-helper'

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
```

Custom Proxy

`store_proxys/qn.ts`

```ts
import { IProxy, ProxyOptions, ProxyResult } from 'kenote-store-helper'

export default class Proxy implements IProxy {

  public upload (file: NodeJS.ReadableStream, options: ProxyOptions, done: (err: any, doc: ProxyResult) => void): void {
    // ---
    
  }
}
```

## License

this repo is released under the [MIT License](https://github.com/kenote/store-helper/blob/master/LICENSE).

[npm-image]: https://img.shields.io/npm/v/kenote-store-helper.svg
[npm-url]: https://www.npmjs.com/package/kenote-store-helper
[downloads-image]: https://img.shields.io/npm/dm/kenote-store-helper.svg
[downloads-url]: https://www.npmjs.com/package/kenote-store-helper
[travis-image]: https://travis-ci.com/kenote/store-helper.svg?branch=master
[travis-url]: https://travis-ci.com/kenote/store-helper
[licensed-image]: https://img.shields.io/badge/license-MIT-blue.svg
[licensed-url]: https://github.com/kenote/store-helper/blob/master/LICENSE