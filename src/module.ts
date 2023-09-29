import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import defu from 'defu'

export interface BasicAuthCredentialOptions {
  to?: string | Array<string>
  skip?: string | Array<string>
}

export interface BasicAuthCredential extends BasicAuthCredentialOptions {
  user: string
  pass: string
}

export interface ModuleOptions {
  enabled: boolean
  message: string
  credentials: string
  skip: string | Array<string>
  limit: Record<string, BasicAuthCredentialOptions>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@gsmeira/nuxt3-basic-auth',
    configKey: 'basicAuth',
  },
  defaults: {
    enabled: true,
    message: 'Please enter username and password',
    credentials: '',
    skip: ['/favicon.ico'],
    limit: {},
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.basicAuth = defu(nuxt.options.runtimeConfig.basicAuth, {
      enabled: options.enabled,
      message: options.message,
      credentials: options.credentials,
      skip: options.skip,
      limit: options.limit,
    })

    addServerHandler({
      handler: resolve('./runtime/basic-auth'),
      middleware: true,
    })
  },
})
