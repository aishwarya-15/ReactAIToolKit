// Client-side rate limiter — token-bucket algorithm
//
// CONCEPT: Token bucket rate limiting prevents the client from
// exceeding API rate limits. Tokens refill over time — each request
// consumes one token. If no tokens are available, the request waits
// until one refills. This avoids 429 errors proactively.

const DEFAULT_OPTIONS = {
  maxTokens: 30,          // max burst size (Groq free tier: 30 req/min)
  refillRate: 30,         // tokens per interval
  refillInterval: 60000,  // 1 minute (matches Groq rate window)
}

class TokenBucket {
  constructor(opts = {}) {
    const config = { ...DEFAULT_OPTIONS, ...opts }
    this.maxTokens = config.maxTokens
    this.refillRate = config.refillRate
    this.refillInterval = config.refillInterval
    this.tokens = this.maxTokens
    this.lastRefill = Date.now()
    this._waitQueue = []
  }

  /** Refill tokens based on elapsed time */
  _refill() {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    const newTokens = Math.floor(
      (elapsed / this.refillInterval) * this.refillRate
    )

    if (newTokens > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + newTokens)
      this.lastRefill = now
    }
  }

  /** Try to consume a token immediately */
  tryConsume() {
    this._refill()
    if (this.tokens > 0) {
      this.tokens--
      return true
    }
    return false
  }

  /** Wait until a token is available, then consume it */
  async consume() {
    if (this.tryConsume()) return

    // Calculate wait time until next token refills
    const waitTime = Math.ceil(
      (this.refillInterval / this.refillRate) * (1 - this.tokens)
    )

    return new Promise(resolve => {
      const entry = { resolve, timer: null }
      entry.timer = setTimeout(() => {
        this._refill()
        this.tokens = Math.max(0, this.tokens - 1)
        // Remove from queue
        const idx = this._waitQueue.indexOf(entry)
        if (idx >= 0) this._waitQueue.splice(idx, 1)
        resolve()
      }, Math.max(waitTime, 100))
      this._waitQueue.push(entry)
    })
  }

  /** Current token count (after refill) */
  get available() {
    this._refill()
    return this.tokens
  }

  /** Report back a token (e.g. on cache hit or skipped request) */
  release() {
    this.tokens = Math.min(this.maxTokens, this.tokens + 1)
  }
}

// ── Singleton instances ──
// Separate buckets for text and TTS (different rate limits)

export const apiLimiter = new TokenBucket({
  maxTokens: 30,
  refillRate: 30,
  refillInterval: 60_000,
})

export const ttsLimiter = new TokenBucket({
  maxTokens: 15,
  refillRate: 15,
  refillInterval: 60_000,
})

/**
 * Wraps an async function with rate limiting.
 * Waits for a token before executing — never fires above the limit.
 *
 * @param {Function}    fn      - Async function to wrap
 * @param {TokenBucket} limiter - Which limiter to use
 * @returns {Function} Rate-limited wrapper with same signature
 *
 * @example
 *   const limited = withRateLimit(callGroqAPI, apiLimiter)
 *   const result = await limited({ systemPrompt, userMessage })
 */
export function withRateLimit(fn, limiter) {
  return async function rateLimitedWrapper(...args) {
    await limiter.consume()
    return fn(...args)
  }
}
