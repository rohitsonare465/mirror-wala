import { NextRequest } from 'next/server';

interface RateLimitBucket {
  tokens: number;
  lastRefilled: number;
}

export class RateLimiter {
  private static cache = new Map<string, RateLimitBucket>();
  
  // Rate limiting configurations
  private static CAPACITY = 20; // Maximum requests allowed in burst
  private static REFILL_RATE = 0.5; // Tokens refilled per second (1 token every 2 seconds)

  /**
   * Evaluates if a request from a specific IP should be throttled.
   * Uses Token Bucket algorithm.
   */
  static limit(request: Request): { success: boolean; limit: number; remaining: number; reset: number } {
    try {
      // 1. Resolve client IP address
      let ip = '127.0.0.1';
      const forwardedFor = request.headers.get('x-forwarded-for');
      if (forwardedFor) {
        ip = forwardedFor.split(',')[0].trim();
      } else {
        // Fallbacks
        const realIp = request.headers.get('x-real-ip');
        if (realIp) {
          ip = realIp;
        }
      }

      const now = Date.now();
      let bucket = this.cache.get(ip);

      if (!bucket) {
        // Initialize bucket
        bucket = {
          tokens: this.CAPACITY,
          lastRefilled: now,
        };
        this.cache.set(ip, bucket);
      }

      // 2. Refill tokens based on time elapsed
      const elapsedTimeSeconds = (now - bucket.lastRefilled) / 1000;
      const refilledTokens = elapsedTimeSeconds * this.REFILL_RATE;
      
      bucket.tokens = Math.min(this.CAPACITY, bucket.tokens + refilledTokens);
      bucket.lastRefilled = now;

      // 3. Consume token
      if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        this.cache.set(ip, bucket);
        
        return {
          success: true,
          limit: this.CAPACITY,
          remaining: Math.floor(bucket.tokens),
          reset: Math.max(0, Math.ceil((this.CAPACITY - bucket.tokens) / this.REFILL_RATE)),
        };
      }

      // Throttled: no tokens left in bucket
      return {
        success: false,
        limit: this.CAPACITY,
        remaining: 0,
        reset: Math.max(0, Math.ceil((this.CAPACITY - bucket.tokens) / this.REFILL_RATE)),
      };
    } catch {
      // Fallback: allow request in case of error
      return {
        success: true,
        limit: this.CAPACITY,
        remaining: 1,
        reset: 0,
      };
    }
  }

  /**
   * Helper to format standard rate limit response headers.
   */
  static getHeaders(limit: number, remaining: number, reset: number) {
    return {
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(reset),
    };
  }
}
