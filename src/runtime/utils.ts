import type { RequestHeaders } from 'h3'
import { isEmpty as isEmptyObj } from 'lodash-es'
import type { BasicAuthCredential, BasicAuthCredentialOptions } from '../module'

export function mergeCredentialLimits(credentials: BasicAuthCredential[], limit: Record<string, BasicAuthCredentialOptions>) {
  for (const user in limit) {
    const idx = credentials.findIndex(e => e.user === user)

    if (idx >= 0 && !isEmpty(limit[user]?.to))
      credentials[idx].to = limit[user].to

    if (idx >= 0 && !isEmpty(limit[user]?.skip))
      credentials[idx].skip = limit[user].skip
  }
}

export function parseCredentials(credentials: string): BasicAuthCredential[] {
  const parsedCredentials: BasicAuthCredential[] = []

  credentials.split('|').forEach((credential) => {
    const partials = credential.split(':')

    parsedCredentials.push({
      user: partials[0],
      pass: partials[1],
    })
  })

  return parsedCredentials
}

export function isSuperUser(credentials: BasicAuthCredential[], authHeader: RequestHeaders[string]): boolean {
  const superCredentials = credentials.filter(e => isEmpty(e?.to))

  for (let i = 0; i < superCredentials.length; i++) {
    if (isCredentialValid(superCredentials[i], authHeader))
      return true
  }

  return false
}

export function isLimitedUser(credentials: BasicAuthCredential[], authHeader: RequestHeaders[string], path: string): boolean {
  const limitedCredentials = credentials.filter((e) => {
    if (isEmpty(e?.to) || path)
      return false

    if (Array.isArray(e.to)) {
      for (let i = 0; i < e.to.length; i++) {
        if (regexStr(e.to[i]).test(path))
          return true
      }
    }

    if (typeof e.to === 'string')
      return regexStr(e.to).test(path)

    return false
  })

  for (let i = 0; i < limitedCredentials.length; i++) {
    if (isCredentialValid(limitedCredentials[i], authHeader))
      return true
  }

  return false
}

export function isCredentialValid(credential: BasicAuthCredential, authHeader: RequestHeaders[string]): boolean {
  const validAuthHeaders = `Basic ${btoa(`${credential.user}:${credential.pass}`)}`

  return !!(authHeader && validAuthHeaders.includes(authHeader))
}

export function getCurrentUser(credentials: BasicAuthCredential[], authHeader: RequestHeaders[string]): BasicAuthCredential | null {
  for (let i = 0; i < credentials.length; i++) {
    if (isCredentialValid(credentials[i], authHeader))
      return credentials[i]
  }

  return null
}

export function isSkipable(path: string, skip: Array<string> | string | undefined) {
  if (typeof skip === 'string')
    return regexStr(skip).test(path)

  if (Array.isArray(skip)) {
    for (let i = 0; i < skip.length; i++) {
      if (regexStr(skip[i]).test(path))
        return true
    }
  }

  return false
}

export function regexStr(expression: string): RegExp {
  return new RegExp(expression)
}

export function isEmpty(value: any): boolean {
  if (typeof value === 'object')
    return isEmptyObj(value)

  return !value
}
