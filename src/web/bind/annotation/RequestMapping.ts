import { Annotation, ElementType } from '@tspring/core'
import { RequestMethod } from './RequestMethod'

type AnnotationParams = {
  name?: string
  path?: string | string[]
  method?: RequestMethod | RequestMethod[]
  params?: string[]
  headers?: string | string[]
  consumes?: string | string[]
  produces?: string | string[]
} & Annotation.Params<string | string[]>

export const RequestMapping = Annotation.define<ElementType.TYPE & ElementType.METHOD, string | string[], AnnotationParams>({
  name: 'RequestMapping',
  attributes: {
    value: {
      aliasFor: 'path',
      default: ''
    },
    path: {
      aliasFor: 'value',
      default: ''
    },
    name: {
      default: ''
    },
    method: {
      default: []
    },
    params: {
      default: []
    },
    headers: {
      default: []
    },
    consumes: {
      default: []
    },
    produces: {
      default: []
    }
  }
})

export module RequestMapping {
  export type Params = AnnotationParams
}
