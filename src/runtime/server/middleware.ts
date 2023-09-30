import { appendHeader, createError, defineEventHandler, getHeader } from 'h3'
import { isAuthenticated } from '../utils'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  const { basicAuth } = useRuntimeConfig()

  const { _path: path } = event

  if (!path || !basicAuth.enabled)
    return

  const authHeader = getHeader(event, 'authorization')

  if (isAuthenticated(basicAuth.user, basicAuth.pass, authHeader))
    return

  appendHeader(event, 'WWW-authenticate', `Basic realm="${basicAuth.realm}"`)

  throw createError({
    statusCode: 401,
    statusMessage: 'Not authorized',
  })
})
