import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const VALID_ENV = {
  GOOGLE_SHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms',
  WHATSAPP_NUMBER: '5491112345678',
  GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
  GOOGLE_PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Z3VS5JJcds...\n-----END RSA PRIVATE KEY-----',
}

describe('env validation', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...VALID_ENV }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should pass with all valid environment variables', async () => {
    const { env } = await import('../env')
    expect(env.GOOGLE_SHEET_ID).toBe(VALID_ENV.GOOGLE_SHEET_ID)
    expect(env.WHATSAPP_NUMBER).toBe(VALID_ENV.WHATSAPP_NUMBER)
    expect(env.GOOGLE_SERVICE_ACCOUNT_EMAIL).toBe(
      VALID_ENV.GOOGLE_SERVICE_ACCOUNT_EMAIL
    )
    expect(env.GOOGLE_PRIVATE_KEY).toBe(VALID_ENV.GOOGLE_PRIVATE_KEY)
  })

  it('should throw when GOOGLE_SHEET_ID is missing', async () => {
    const { GOOGLE_SHEET_ID: _, ...envWithoutSheetId } = VALID_ENV
    process.env = envWithoutSheetId

    await expect(import('../env')).rejects.toThrow()
  })

  it('should throw when WHATSAPP_NUMBER is missing', async () => {
    const { WHATSAPP_NUMBER: _, ...envWithoutWhatsapp } = VALID_ENV
    process.env = envWithoutWhatsapp

    await expect(import('../env')).rejects.toThrow()
  })

  it('should throw when WHATSAPP_NUMBER has invalid format', async () => {
    process.env = { ...VALID_ENV, WHATSAPP_NUMBER: 'not-a-number' }

    await expect(import('../env')).rejects.toThrow()
  })

  it('should throw when GOOGLE_SERVICE_ACCOUNT_EMAIL is invalid', async () => {
    process.env = { ...VALID_ENV, GOOGLE_SERVICE_ACCOUNT_EMAIL: 'invalid' }

    await expect(import('../env')).rejects.toThrow()
  })

  it('should throw when GOOGLE_PRIVATE_KEY is empty', async () => {
    process.env = { ...VALID_ENV, GOOGLE_PRIVATE_KEY: '' }

    await expect(import('../env')).rejects.toThrow()
  })
})
