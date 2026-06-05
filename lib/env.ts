import { z } from 'zod'

const envSchema = z.object({
  WHATSAPP_NUMBER: z.string().regex(/^\d{10,15}$/),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
})

export const env = envSchema.parse(process.env)
