import { z } from 'zod'

const envSchema = z.object({
  GOOGLE_SHEET_ID: z.string().min(1),
  WHATSAPP_NUMBER: z.string().regex(/^\d{10,15}$/),
})

export const env = envSchema.parse(process.env)
