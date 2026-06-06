import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { verifyAuth } from '@/lib/admin-auth'
import { validateFileUpload, sanitizeFilename, checkRateLimit, getClientIp, getSecurityHeaders } from '@/lib/security'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

export async function POST(request: Request) {
  try {
    // Check authentication
    const isAuthenticated = await verifyAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Rate limiting
    const clientIp = getClientIp(request)
    if (!checkRateLimit(`upload:${clientIp}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intentá de nuevo en un minuto.' },
        { status: 429, headers: getSecurityHeaders() }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate file
    const validation = validateFileUpload(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Read file bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitize filename
    const safeName = sanitizeFilename(file.name)
    const filename = `${Date.now()}-${safeName}`
    const filepath = join(UPLOAD_DIR, filename)

    // Write file
    await writeFile(filepath, buffer)

    return NextResponse.json(
      {
        url: `/api/uploads/${filename}`,
        message: 'Imagen subida exitosamente',
      },
      { headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
