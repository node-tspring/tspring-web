import { Implements, Class, StandardAnnotationMetadata, Method, IllegalStateException, CollectionUtils, Environment, PrimitiveType } from '@tspring/core'
import { MergedBeanDefinitionPostProcessor, SmartInitializingSingleton, BeanNameAware, BeanFactoryAware, RootBeanDefinition, BeanFactory } from '@tspring/beans'
import { ApplicationContextAware, ApplicationContext, EnvironmentAware } from '@tspring/context'
import { KoaServer, KoaRequestMapping } from '../config/KoaServer'
import { RequestMapping } from './RequestMapping'
import { RequestMethod } from './RequestMethod'
import { ResponseBody } from './ResponseBody'

@Implements(
  MergedBeanDefinitionPostProcessor,
  SmartInitializingSingleton,
  BeanFactoryAware,
  BeanNameAware,
  ApplicationContextAware,
  EnvironmentAware
)
export class KoaWebServerAnnotationBeanPostProcessor implements
  MergedBeanDefinitionPostProcessor,
  SmartInitializingSingleton,
  BeanFactoryAware,
  BeanNameAware,
  ApplicationContextAware,
  EnvironmentAware
{
  private beanFactory?: BeanFactory
  private beanName?: string
  private applicationContext?: ApplicationContext
  private server?: KoaServer
  private nonAnnotatedClasses = new Set<Class<Object>>()
  private environment?: Environment

  setEnvironment(environment: Environment): void {
    this.environment = environment
  }

  postProcessMergedBeanDefinition(beanDefinition: RootBeanDefinition, beanType: Class<Object>, beanName: string): void {

  }

  resetBeanDefinition(beanName: string): void {

  }

  postProcessBeforeInitialization(bean: Object, beanName: string): Object | undefined {
    return bean
  }

  postProcessAfterInitialization(bean: Object, beanName: string): Object | undefined {
    const beanClass = bean.constructor as Class<Object>
    if (!this.nonAnnotatedClasses.has(beanClass)) {
      const md = new StandardAnnotationMetadata(bean.constructor as Class<Object>)
      const annotatedMethods = md.getAnnotatedMethods(RequestMapping)
      if (annotatedMethods.size == 0) {
        this.nonAnnotatedClasses.add(beanClass)
        console.debug(`No @RequestMapping annotations found on bean class: ${beanClass.name}`)
      }
      else {
        const requestMapping = md.getAnnotationParams<RequestMapping.Params>(RequestMapping) || {}
        const defaultRequestMapping: KoaRequestMapping = {
          prefix: CollectionUtils.toArray(requestMapping.path, [''])[0],
          path: [''],
          method: CollectionUtils.toArray(requestMapping.method, [RequestMethod.GET]),
          context: bean,
          responseBody: md.isAnnotated(ResponseBody),
          paramtypes: undefined as any,
          handler: undefined as any
        }
        for (const annotatedMethod of annotatedMethods) {
          this.processRequestMapping(annotatedMethod, bean, defaultRequestMapping)
        }
      }
    }
    return bean
  }

  processRequestMapping(annotatedMethod: Method, bean: Object, defaultRequestMapping: KoaRequestMapping) {
    try {
      const mapping = annotatedMethod.getAnnotationParams<RequestMapping.Params>(RequestMapping)!
      const methodName = annotatedMethod.getName()
      this.server!.registerController({
        prefix: defaultRequestMapping.prefix,
        path: CollectionUtils.toArray(mapping.path, defaultRequestMapping.path),
        method: CollectionUtils.toArray(mapping.method, defaultRequestMapping.method),
        handler: (bean as any)[methodName],
        context: defaultRequestMapping.context,
        responseBody: annotatedMethod.isAnnotated(ResponseBody) || defaultRequestMapping.responseBody,
        paramtypes: Reflect.getOwnMetadata('design:paramtypes', bean.constructor.prototype, methodName)
      })
		} catch (ex) {
			throw new IllegalStateException(
					`Encountered invalid @Scheduled method '${annotatedMethod.getName().toString()}`, ex)
		}
  }

  afterSingletonsInstantiated(): void {
    console.log('KoaWebServerAnnotationBeanPostProcessor#afterSingletonsInstantiated')
    this.nonAnnotatedClasses.clear()
    this.server!.start()
  }

  setBeanFactory(beanFactory: BeanFactory): void {
    this.beanFactory = beanFactory
  }

  setBeanName(beanName: string): void {
    this.beanName = beanName
  }

  setApplicationContext(applicationContext: ApplicationContext): void {
    this.applicationContext = applicationContext
    if (this.server == undefined) {
      const serverPort = this.environment!.getProperty<number>('server.port', PrimitiveType.number)
      const serverAddress = this.environment!.getProperty('server.address')
      this.server = new KoaServer(serverPort, serverAddress)
    }
  }
}
