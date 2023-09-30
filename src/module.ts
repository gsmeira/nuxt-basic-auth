import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import defu from 'defu'

export interface ModuleOptions {
  enabled: boolean
  realm: string
  user: string
  pass: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@gsmeira/nuxt-basic-auth',
    configKey: 'basicAuth',
  },
  defaults: {
    enabled: true,
    realm: 'default-realm',
    user: '',
    pass: '',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.basicAuth = defu(nuxt.options.runtimeConfig.basicAuth, {
      enabled: options.enabled,
      realm: options.realm,
      user: options.user,
      pass: options.pass,
    })

    addServerHandler({
      handler: resolve('./runtime/server/middleware'),
      middleware: true,
    })
  },
})
