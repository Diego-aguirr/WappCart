import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const filename = `${Date.now()}-${safeName}`
    const filepath = join(UPLOAD_DIR, filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({
      url: `/api/uploads/${filename}`,
      message: 'Image uploaded successfully',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
