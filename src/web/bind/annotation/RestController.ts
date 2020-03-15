import { Controller } from '@tspring/context'
import { Annotation, ElementType } from '@tspring/core'
import { ResponseBody } from './ResponseBody'

type AnnotationParams = {} & Annotation.Params<undefined>

export const RestController = Annotation.define<ElementType.TYPE & ElementType.METHOD, undefined, AnnotationParams>({
  name: 'RestController',
  extends: [Controller, ResponseBody],
  attributes: {
    value: {
      aliasFor: {
        annotation: Controller
      },
      default: ''
    }
  }
})

export module RestController {
  export type Params = AnnotationParams
}
