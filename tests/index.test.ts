import * as express from 'express'
import * as request from 'supertest'
import * as bodyParser from 'body-parser'
import * as path from 'path'
import IStore from './store'
import { StroeOptions, ProxyResult } from '../types'

let app: express.Application | null
let filePath: string = path.resolve(__dirname, 'testFiles', 'test.txt')
const store: StroeOptions = {
  type: 'local',
  max_size: '2MB',
  root_dir: 'uploadfiles'
}

function ErrorInfo (code: number, opts?: any) {
  return {
    code,
    message: opts && opts.join(',')
  }
}

describe('\nApp Store ->\n', () => {

  beforeAll(() => {
    app = express()
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
    app.post('/upload/mimetype', async (req, res, next) => {
      try {
        let result: ProxyResult = await new IStore({ request: req, options: { ...store, mime_type: ['image/png'] } }).asyncSave(ErrorInfo)
        return res.json(result)
      } catch (error) {
        return res.json(error)
      }
    })
    app.post('/upload/original', async (req, res, next) => {
      try {
        let result: ProxyResult = await new IStore({ request: req, options: { ...store, original_name: true } }).asyncSave(ErrorInfo)
        return res.json(result)
      } catch (error) {
        return res.json(error)
      }
    })
  })

  afterAll(() => {
    app = null
  })

  test('upload file', async () => {
    let res: request.Response = await request(app).post('/upload').attach('file', filePath)
    expect(res.status).toBe(200)
  })

  test('upload file of mime type', async () => {
    let res: request.Response = await request(app).post('/upload/mimetype').attach('file', filePath)
    expect(res.body).toEqual({
      code: 1001,
      message: 'text/plain'
    })
  })

  test('upload file of original name', async () => {
    let res: request.Response = await request(app).post('/upload/original').attach('file', filePath)
    expect(res.status).toBe(200)
  })

})
