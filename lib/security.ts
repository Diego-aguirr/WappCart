import { z } from 'zod'

// ============================================================================
// Input Validation Schemas
// ============================================================================

export const ProductSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es muy largo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'El nombre contiene caracteres no permitidos'),
  
  slug: z.string()
    .min(1, 'El slug es requerido')
    .max(100, 'El slug es muy largo')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras, números y guiones'),
  
  description: z.string()
    .min(1, 'La descripción es requerida')
    .max(500, 'La descripción es muy larga')
    .trim()
    .refine(val => !/[<>]/.test(val), 'La descripción contiene caracteres no permitidos'),
  
  price: z.coerce.number()
    .positive('El precio debe ser positivo')
    .max(1000000, 'El precio es demasiado alto'),
  
  image: z.string()
    .min(1, 'La imagen es requerida')
    .refine(
      val => val.startsWith('/api/uploads/') || val.startsWith('/Food/'),
      'La imagen debe ser una ruta válida'
    ),
  
  category: z.string()
    .min(1, 'La categoría es requerida')
    .max(50, 'La categoría es muy larga')
    .trim()
    .refine(val => !/[<>]/.test(val), 'La categoría contiene caracteres no permitidos'),
  
  available: z.preprocess(
    (val) => {
      if (typeof val === 'string') return val === 'true'
      if (typeof val === 'boolean') return val
      return val
    },
    z.boolean().default(true)
  ),
})

export const OrderSchema = z.object({
  customerName: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es muy largo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'El nombre contiene caracteres no permitidos'),
  
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\+?\d{10,15}$/, 'El teléfono no es válido'),
  
  address: z.string()
    .min(5, 'La dirección es requerida')
    .max(200, 'La dirección es muy larga')
    .trim()
    .refine(val => !/[<>]/.test(val), 'La dirección contiene caracteres no permitidos'),
  
  notes: z.string()
    .max(500, 'Las notas son muy largas')
    .trim()
    .optional()
    .default(''),
})

export const LoginSchema = z.object({
  email: z.string()
    .email('El email no es válido')
    .max(100, 'El email es muy largo'),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es muy larga'),
})

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

/**
 * Sanitize an object's string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj }
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T]
    }
  }
  return sanitized
}

/**
 * Validate and sanitize FormData
 */
export function validateFormData(
  formData: FormData,
  schema: z.ZodSchema
): { success: true; data: z.infer<typeof schema> } | { success: false; errors: Record<string, string[]> } {
  const raw = Object.fromEntries(formData)
  const result = schema.safeParse(raw)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string[]> = {}
  for (const [field, issues] of Object.entries(result.error.flatten().fieldErrors)) {
    errors[field] = issues as string[]
  }
  
  return { success: false, errors }
}

// ============================================================================
// Rate Limiting (In-Memory)
// ============================================================================

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
// CSRF Protection (Simple Token-based)
// ============================================================================

const csrfTokens = new Map<string, { token: string; expires: number }>()

/**
 * Generate a CSRF token for a session
 */
export function generateCsrfToken(sessionId: string): string {
  const token = crypto.randomUUID()
  const expires = Date.now() + 3600000 // 1 hour
  
  csrfTokens.set(sessionId, { token, expires })
  return token
}

/**
 * Validate a CSRF token
 */
export function validateCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)
  
  if (!stored) return false
  if (stored.expires < Date.now()) {
    csrfTokens.delete(sessionId)
    return false
  }
  
  return stored.token === token
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
