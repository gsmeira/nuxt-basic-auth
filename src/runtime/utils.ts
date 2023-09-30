import type { RequestHeaders } from 'h3'

export function isAuthenticated(user: string, pass: string, authHeader: RequestHeaders): boolean {
  const validAuthHeaders = `Basic ${btoa(`${user}:${pass}`)}`

  return !!(authHeader && validAuthHeaders.includes(authHeader))
}
