// Retry with exponential backoff — production-grade fetch wrapper
//
// CONCEPT: Exponential backoff retries failed network requests with
// increasing delays (1s → 2s → 4s). Respects HTTP 429 Retry-After
// headers. Skips retry for non-retryable errors (401, 403, 422).

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504])
const NON_RETRYABLE_STATUS = new Set([400, 401, 403, 404, 422])

const DEFAULT_OPTIONS = {
  maxRetries: 3,
  baseDelay: 1000,      // 1 second
  maxDelay: 15000,       // 15 seconds cap
  backoffFactor: 2,
}

/**
 * Wraps an async function with automatic retry + exponential backoff.
 *
 * @param {Function} fn - Async function to wrap
 * @param {object}   opts - Retry configuration
 * @returns {Function} Wrapped function with same signature
 *
 * @example
 *   const safeFetch = withRetry(callGroqAPI, { maxRetries: 3 })
 *   const result = await safeFetch({ systemPrompt, userMessage })
 */
export function withRetry(fn, opts = {}) {
  const { maxRetries, baseDelay, maxDelay, backoffFactor } = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  return async function retryWrapper(...args) {
    let lastError

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (err) {
        lastError = err

        // Don't retry aborted requests
        if (err.name === 'AbortError') throw err

        // Don't retry non-retryable HTTP errors
        const status = extractStatus(err)
        if (status && NON_RETRYABLE_STATUS.has(status)) throw err

        // Last attempt — don't wait, just throw
        if (attempt === maxRetries) break

        // Calculate delay — respect Retry-After header if present
        const retryAfter = extractRetryAfter(err)
        const expDelay = Math.min(
          baseDelay * backoffFactor ** attempt,
          maxDelay
        )
        // Add jitter (±25%) to avoid thundering herd
        const jitter = expDelay * (0.75 + Math.random() * 0.5)
        const delay = retryAfter ? Math.max(retryAfter, jitter) : jitter

        console.warn(
          `[retry] Attempt ${attempt + 1}/${maxRetries} failed (${err.message}). ` +
          `Retrying in ${Math.round(delay)}ms...`
        )

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }
}

/**
 * Extract HTTP status code from error message.
 * Our API functions throw errors like "API Error: 429"
 */
function extractStatus(err) {
  const match = err.message?.match(/(\d{3})/)
  return match ? Number(match[1]) : null
}

/**
 * Extract Retry-After value from error.
 * Groq returns this header on 429 — we embed it in the error.
 */
function extractRetryAfter(err) {
  if (err.retryAfter) return err.retryAfter * 1000
  // Check for "try again in Xs" patterns in error message
  const match = err.message?.match(/try again in (\d+\.?\d*)\s*s/i)
  return match ? parseFloat(match[1]) * 1000 : null
}
