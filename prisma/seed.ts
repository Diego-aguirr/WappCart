import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_PEPPER = process.env.ADMIN_PEPPER

// Configure Cloudinary
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
}

// Upload image to Cloudinary
async function uploadToCloudinary(localPath: string, folder: string): Promise<string> {
  const filePath = join(process.cwd(), 'public', localPath)
  const fileBuffer = readFileSync(filePath)
  const base64 = fileBuffer.toString('base64')
  const dataURI = `data:image/png;base64,${base64}`

  const result = await cloudinary.uploader.upload(dataURI, {
    folder,
    resource_type: 'image',
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  })

  return result.secure_url
}

// Products with local image paths
const products = [
  {
    name: 'Pizza Muzzarella',
    slug: 'pizza-muzzarella',
    description: 'Pizza con muzzarella y salsa de tomate',
    price: 12000,
    localImage: '/Food/pizza.png',
    category: 'Pizzas',
    available: true,
  },
  {
    name: 'Hamburguesa Clásica',
    slug: 'hamburguesa-clasica',
    description: 'Carne, lechuga, tomate, cebolla y aderezo',
    price: 15000,
    localImage: '/Food/hamburguesa.png',
    category: 'Hamburguesas',
    available: true,
  },
  {
    name: 'Papas Fritas',
    slug: 'papas-fritas',
    description: 'Papas fritas crocantes con sal',
    price: 6000,
    localImage: '/Food/papas.png',
    category: 'Acompañamientos',
    available: true,
  },
  {
    name: 'Empanadas',
    slug: 'empanadas',
    description: 'Empanadas de carne o pollo',
    price: 4000,
    localImage: '/Food/empanadas.png',
    category: 'Empanadas',
    available: true,
  },
  {
    name: 'Cerveza Artesanal',
    slug: 'cerveza-artesanal',
    description: 'Cerveza rubia artesanal 500ml',
    price: 8000,
    localImage: '/Food/logo.png',
    category: 'Bebidas',
    available: true,
  },
]

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_PEPPER) {
    console.error('ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_PEPPER must be set in .env')
    process.exit(1)
  }

  // Configure Cloudinary
  configureCloudinary()

  console.log('Cleaning database...')
  await prisma.product.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Uploading images to Cloudinary...')
  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      console.log(`  Uploading ${product.name}...`)
      const imageUrl = await uploadToCloudinary(product.localImage, 'wappcart/products')
      return {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image: imageUrl,
        category: product.category,
        available: product.available,
      }
    })
  )

  console.log('Creating products...')
  await prisma.product.createMany({ data: productsWithImages })

  console.log('Creating admin user...')
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD + ADMIN_PEPPER + ADMIN_EMAIL, salt)

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      salt,
      role: 'admin',
    },
  })

  console.log('Seed completed successfully!')
  console.log(`  - ${productsWithImages.length} products created`)
  console.log(`  - Admin user: ${ADMIN_EMAIL}`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
