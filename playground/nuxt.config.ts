import process from 'node:process'

export default defineNuxtConfig({
  modules: ['../src/module'],
  basicAuth: {
    enabled: process.env.BASIC_AUTH_ENABLED === 'true',
    credentials: process.env.BASIC_AUTH_CREDENTIALS,
    limit: {
      admin: {
        to: '^(\/)?admin(\/(.*))?',
        skip: '^(\/)?test(\/)?',
      },
    },
  },
  devtools: { enabled: true },
})
