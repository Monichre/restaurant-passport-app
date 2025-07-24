import { cookies } from 'next/headers'
import { FIRST_VISIT_COOKIE } from './cookies'

/**
 * Server-side cookie utilities (for use in Server Components only)
 */

/**
 * Check if this is a first-time visitor based on cookie (Server Component only)
 * @returns boolean - true if first-time visitor, false if returning visitor
 */
export function isFirstTimeVisitor(): boolean {
  try {
    const cookieStore = cookies()
    return !cookieStore.get(FIRST_VISIT_COOKIE)
  } catch (error) {
    return false
  }
}

/**
 * Get the timestamp of the first visit (Server Component only)
 * @returns string | null - ISO timestamp of first visit or null if not available
 */
export function getFirstVisitTimestamp(): string | null {
  try {
    const cookieStore = cookies()
    const cookie = cookieStore.get(FIRST_VISIT_COOKIE)
    return cookie?.value || null
  } catch (error) {
    return null
  }
}