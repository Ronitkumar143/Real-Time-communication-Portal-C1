/**
 * Exponential backoff for WebSocket reconnect attempts.
 * Spec: 1000ms on the first failure, 2000ms on the second, 4000ms on the
 * third, doubling each time and capping at 10000ms.
 */

const DEFAULT_BASE_MS = 1000
const DEFAULT_MAX_MS = 10000
const DEFAULT_MAX_ATTEMPTS = 10

/**
 * @param {number} attempt - 1-indexed retry attempt number
 * @param {object} [opts]
 * @param {number} [opts.baseMs] - starting delay
 * @param {number} [opts.maxMs] - upper bound on delay
 * @returns {number} delay in milliseconds
 */
export function computeBackoffDelay(attempt, opts = {}) {
  const baseMs = opts.baseMs ?? DEFAULT_BASE_MS
  const maxMs = opts.maxMs ?? DEFAULT_MAX_MS

  if (attempt < 1) return 0

  const rawDelay = baseMs * 2 ** (attempt - 1)
  return Math.min(rawDelay, maxMs)
}

export function hasAttemptsRemaining(attempt, maxAttempts = DEFAULT_MAX_ATTEMPTS) {
  return attempt <= maxAttempts
}

export const backoffDefaults = {
  baseMs: DEFAULT_BASE_MS,
  maxMs: DEFAULT_MAX_MS,
  maxAttempts: DEFAULT_MAX_ATTEMPTS
}
