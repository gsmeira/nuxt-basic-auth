import { appendHeader, createError, defineEventHandler, getHeader } from 'h3'
import {
  getCurrentUser,
  isLimitedUser,
  isSkipable,
  isSuperUser,
  mergeCredentialLimits,
  parseCredentials,
} from './utils'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  const { basicAuth } = useRuntimeConfig()

  const { _path: path } = event

  if (!path || !basicAuth.enabled || isSkipable(path, basicAuth.skip))
    return

  const credentials = parseCredentials(basicAuth.credentials)

  if (credentials.length === 0)
    return

  mergeCredentialLimits(credentials, basicAuth.limit)

  const authHeader = getHeader(event, 'authorization')

  const currentUser = getCurrentUser(credentials, authHeader)

  if (currentUser && isSkipable(path, currentUser.skip))
    return

  if (isSuperUser(credentials, authHeader))
    return

  if (isLimitedUser(credentials, authHeader, path))
    return

  appendHeader(event, 'WWW-authenticate', `Basic realm="${basicAuth.message}"`)

  throw createError({
    statusCode: 401,
    statusMessage: 'Not authorized',
  })
})
