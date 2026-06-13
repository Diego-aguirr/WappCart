// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Remove potentially dangerous characters from strings
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}

// ============================================================================
// Rate Limiting (In-Memory)
// ============================================================================

// NOTE: In-memory rate limiting works for single-instance deployments (local dev, single server).
// For serverless (Vercel), each function invocation has its own Map, so rate limits reset per request.
// For production serverless, use: Vercel KV, Upstash Redis, or similar external store.
// This implementation is sufficient for local development and single-server deployments.

const rateLimitMap = new Map<string, number[]>()

/**
 * Simple in-memory rate limiter
 * @param key - Unique identifier (e.g., IP address)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(key) || []
  
  // Remove timestamps outside the window
  const validTimestamps = timestamps.filter(t => now - t < windowMs)
  
  if (validTimestamps.length >= maxRequests) {
    return false // Rate limited
  }
  
  validTimestamps.push(now)
  rateLimitMap.set(key, validTimestamps)
  
  return true // Allowed
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return 'unknown'
}

// ============================================================================
// Security Headers
// ============================================================================

export function getSecurityHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}

// ============================================================================
// File Upload Security
// ============================================================================

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'El archivo es demasiado grande (máximo 5MB)' }
  }
  
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido (solo PNG, JPEG, WebP, GIF)' }
  }
  
  // Check file extension
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext || '')) {
    return { valid: false, error: 'Extensión de archivo no permitida' }
  }
  
  return { valid: true }
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '-') // Allow only safe characters
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .replace(/^-/, '') // Remove leading dash
    .substring(0, 100) // Limit length
}
