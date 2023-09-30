import process from 'node:process'

export default defineNuxtConfig({
  modules: ['../src/module'],
  basicAuth: {
    enabled: process.env.BASIC_AUTH_ENABLED === 'true',
    user: process.env.BASIC_AUTH_USER,
    pass: process.env.BASIC_AUTH_PASS,
  },
  devtools: { enabled: true },
})
