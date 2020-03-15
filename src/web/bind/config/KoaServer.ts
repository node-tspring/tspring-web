import Koa from 'koa'
import koaStatic from 'koa-static'
import koaBody from 'koa-body'
import Router from 'koa-router'
import { RequestMethod } from '../annotation/RequestMethod'
import { PathVariable } from '../annotation/PathVariable'
import { RequestBody } from '../annotation/RequestBody'

export type KoaRequestMapping = {
  prefix: string
  path: string | string[]
  method: RequestMethod | RequestMethod[]
  paramtypes: any[]
  responseBody: boolean
  handler: (...args: any[]) => any
  context: Object
}

export class KoaServer {
  private server: Koa

  constructor (private port: number, private address: string) {
    const server = new Koa()
    server.use(koaStatic(`./public`))
    server.use(koaBody())
    this.server = server
  }

  start () {
    this.server.listen(this.port, this.address)
    console.log(`listen: ${this.address}:${this.port} ...`)
  }

  registerController (mapping: KoaRequestMapping) {
    console.log('==> register controller ...', mapping)
    const router = new Router()
    const handler = async (ctx: Koa.Context, next: Koa.Next) => {
      console.log(`==> request:${ctx.href}`, ctx.params)
      const params = [] as any[]
      mapping.paramtypes.forEach((item: any, index: number) => {
        console.log('item -> ', index, item)
        switch (item.type) {
          case 'Koa.Context':
            params[index] = ctx
            break
          case 'Koa.Next':
            params[index] = next
            break
          case PathVariable.SYMBOL:
            params[index] = ctx.params[item.name]
            break
          case RequestBody.SYMBOL:
            params[index] = ctx.request.body
            break
        }
      })

      const res = await mapping.handler.apply(mapping.context, params)
      if (mapping.responseBody) {
        ctx.body = res
      }
    }

    const methods = Array.isArray(mapping.method) ? mapping.method : [mapping.method]
    const paths = Array.isArray(mapping.path) ? mapping.path : [mapping.path]
    methods.forEach(method => {
      paths.forEach(path => {
        console.log(`mapping: ${method} ${mapping.prefix + path}`)
        router[method](mapping.prefix + path, handler)
      })
    })

    this.server
      .use(router.routes())
      .use(router.allowedMethods())
  }
}
