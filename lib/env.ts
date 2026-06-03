import { z } from 'zod'

const envSchema = z.object({
  GOOGLE_SHEET_ID: z.string().min(1, 'GOOGLE_SHEET_ID is required'),
  WHATSAPP_NUMBER: z
    .string()
    .regex(/^\d{10,15}$/, 'WHATSAPP_NUMBER must be 10-15 digits'),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z
    .string()
    .email('GOOGLE_SERVICE_ACCOUNT_EMAIL must be a valid email'),
  GOOGLE_PRIVATE_KEY: z.string().min(1, 'GOOGLE_PRIVATE_KEY is required'),
})

export const env = envSchema.parse(process.env)
