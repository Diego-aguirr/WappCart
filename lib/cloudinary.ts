import { v2 as cloudinary } from 'cloudinary'

// Whitelist of allowed folders for uploads
const ALLOWED_FOLDERS = ['wappcart/products'] as const

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials not configured')
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  return cloudinary
}

export function getCloudinary() {
  return configureCloudinary()
}

/**
 * Validate folder name to prevent path traversal
 */
function validateFolder(folder: string): void {
  if (!ALLOWED_FOLDERS.includes(folder as typeof ALLOWED_FOLDERS[number])) {
    throw new Error('Invalid upload folder')
  }
}

/**
 * Validate public ID format (alphanumeric, hyphens, slashes only)
 */
function validatePublicId(publicId: string): void {
  // Allow only: letters, numbers, hyphens, underscores, slashes
  // Must start with wappcart/
  if (!/^wappcart\/[\w\-/]+$/.test(publicId)) {
    throw new Error('Invalid image identifier')
  }
}

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
}

export async function uploadImage(
  file: File,
  folder: string = 'wappcart/products'
): Promise<UploadResult> {
  // Validate folder before upload
  validateFolder(folder)

  const cld = getCloudinary()

  // Convert File to base64 data URI
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString('base64')
  const dataURI = `data:${file.type};base64,${base64}`

  const result = await cld.uploader.upload(dataURI, {
    folder,
    resource_type: 'image',
    transformation: [
      { width: 800, height: 800, crop: 'limit' }, // Max 800px
      { quality: 'auto:good' },                    // Auto quality
      { fetch_format: 'auto' },                    // Auto format (webp where supported)
    ],
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  // Validate public ID before deletion
  validatePublicId(publicId)

  const cld = getCloudinary()
  await cld.uploader.destroy(publicId)
}
