import { Bean, Configuration } from '@tspring/context'
import { KoaWebServerAnnotationBeanPostProcessor } from './KoaWebServerAnnotationBeanPostProcessor'

@Configuration
export class KoaWebServerConfiguration {

	@Bean({ name: 'tspring.web.bind.annotation.internalKoaWebServerAnnotationProcessor' })
	// @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
	static koaWebServerAnnotationProcessor(): KoaWebServerAnnotationBeanPostProcessor {
		return new KoaWebServerAnnotationBeanPostProcessor()
	}

}
