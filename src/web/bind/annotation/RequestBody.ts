import { Annotation, ElementType, Param } from '@tspring/core'

type AnnotationParams = {
  name?: string
} & Annotation.Params<string>

export const RequestBody = Annotation.define<ElementType.PARAMETER, string, AnnotationParams>({
  name: 'RequestBody',
  attributes: {
    value: {
      aliasFor: { annotation: Param, attribute: 'name' },
      default: ''
    },
    name: {
      aliasFor: { annotation: Param, attribute: 'name' },
      default: ''
    }
  }
})

export module RequestBody {
  export type Params = AnnotationParams
}
