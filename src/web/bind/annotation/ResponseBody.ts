import { Annotation, ElementType } from '@tspring/core'

type AnnotationParams = {} & Annotation.Params<undefined>

export const ResponseBody = Annotation.define<ElementType.TYPE & ElementType.METHOD, undefined, AnnotationParams>({
  name: 'ResponseBody'
})

export module ResponseBody {
  export type Params = AnnotationParams
}
