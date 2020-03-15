import { Annotation, ElementType } from '@tspring/core'
import { Import } from '@tspring/context'
import { KoaWebServerConfiguration } from './KoaWebServerConfiguration'

type AnnotationParams = {} & Annotation.Params<undefined>

export const EnableKoaWebServer = Annotation.define<ElementType.TYPE, undefined, AnnotationParams>({
  name: 'EnableKoaWebServer',
  extends: [
    Import(KoaWebServerConfiguration)
  ]
})

export module EnableKoaWebServer {
  export type Params = AnnotationParams
}
