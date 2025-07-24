export const FIRST_VISIT_COOKIE = 'first-visit'

/**
 * Client-side cookie utilities (for use in components)
 */
export const clientCookies = {
  /**
   * Check if first-time visitor on client-side
   */
  isFirstTimeVisitor(): boolean {
    if (typeof document === 'undefined') return false
    return !document.cookie.includes(`${FIRST_VISIT_COOKIE}=`)
  },

  /**
   * Get first visit timestamp on client-side
   */
  getFirstVisitTimestamp(): string | null {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp(`${FIRST_VISIT_COOKIE}=([^;]+)`))
    return match ? decodeURIComponent(match[1]) : null
  }
}