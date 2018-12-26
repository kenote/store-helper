# store-helper
Upload Store's Helper.

## Installation

```bash
$ yarn add kenote-store-helper
```

## Usages

`utils/store.ts`

```ts
import { Upload, UploadSetting, ProxyResult, parseResult, LocalProxy } from 'kenote-store-helper'

@UploadSetting(
  {
    mimetype: 1101,
    limit: 1102
  },
  {
    local: LocalProxy
  }
)
export default class  extends Upload {

  public async asyncSave (): Promise<any> {
    return new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
      this.save( (err: number, doc: Array<string | ProxyResult>): any => {
        if (err) {
          reject(err)
        }
        else {
          let data: ProxyResult[] = parseResult(<ProxyResult[]>doc, this.__Store, `http://localhost:4000/uploadfile`)
          resolve(data)
        }
      })
    })
  }
}
```

`controller/store.ts`

```ts
import { Request, Response, NextFunction } from 'express'
import { StoreItem, ProxyResult } from 'kenote-store-helper'
import Upload from '../utils/store'

const store: StoreItem = {
  type: 'local',
  root_dir: '/paths/to',
  root_url: '@files',
  max_size: '4MB',
  mime_type: [
    'image/png',
    'image/gif',
    'image/jpeg'
  ]
}
/**
 * Router post => '/upload'
 **/
export async function upload (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    let result: ProxyResult[] = await new Upload({ request: req, store }).asyncSave()
    if (result.length === 0) {
      return res.json({
        error: 'not file.'
      })
    }
    return res.json({
      data: result
    })
  } catch (error) {
    return res.json({
      error: error
    })
  }
}
```

## License

this repo is released under the [MIT License](https://github.com/kenote/store-helper/blob/master/LICENSE).