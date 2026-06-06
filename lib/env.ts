import { z } from 'zod'

const envSchema = z.object({
  WHATSAPP_NUMBER: z.string().regex(/^\d{10,15}$/),
  DATABASE_URL: z.string().min(1),
  ADMIN_PEPPER: z.string().min(32, 'ADMIN_PEPPER must be at least 32 characters'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
})

export const env = envSchema.parse(process.env)
