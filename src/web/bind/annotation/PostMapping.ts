import { Annotation, ElementType } from '@tspring/core'
import { RequestMethod } from './RequestMethod'
import { RequestMapping } from './RequestMapping'

type AnnotationParams = {
  name?: string
  path?: string | string[]
  params?: string[]
  headers?: string | string[]
  consumes?: string | string[]
  produces?: string | string[]
} & Annotation.Params<string | string[]>

export const PostMapping = Annotation.define<ElementType.METHOD, string | string[], AnnotationParams>({
  name: 'PostMapping',
  attributes: {
    value: {
      aliasFor: { annotation: RequestMapping },
      default: ''
    },
    path: {
      aliasFor: { annotation: RequestMapping },
      default: ''
    },
    name: {
      aliasFor: { annotation: RequestMapping },
      default: ''
    },
    params: {
      aliasFor: { annotation: RequestMapping },
      default: []
    },
    headers: {
      aliasFor: { annotation: RequestMapping },
      default: []
    },
    consumes: {
      aliasFor: { annotation: RequestMapping },
      default: []
    },
    produces: {
      aliasFor: { annotation: RequestMapping },
      default: []
    }
  },
  extends: [RequestMapping({ method: RequestMethod.POST })]
})

export module PostMapping {
  export type Params = AnnotationParams
}
