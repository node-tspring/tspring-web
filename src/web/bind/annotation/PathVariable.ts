import { Annotation, ElementType } from '@tspring/core'

type AnnotationParams = {
  name?: string
} & Annotation.Params<string>

export const PathVariable = Annotation.define<ElementType.PARAMETER, string, AnnotationParams>({
  name: 'PathVariable',
  attributes: {
    value: {
      aliasFor: 'name',
      default: ''
    },
    name: {
      aliasFor: 'value',
      default: ''
    }
  }
})

export module PathVariable {
  export type Params = AnnotationParams
}
