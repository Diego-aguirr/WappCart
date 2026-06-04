import { google, type sheets_v4 } from 'googleapis'
import { env } from '@/lib/env'

let sheetsClient: sheets_v4.Sheets | null = null

export function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) {
    return sheetsClient
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  sheetsClient = google.sheets({ version: 'v4', auth })

  return sheetsClient
}

export function getSheetId(): string {
  return env.GOOGLE_SHEET_ID
}
