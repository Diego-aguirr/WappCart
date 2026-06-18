import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_PEPPER = process.env.ADMIN_PEPPER

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_PEPPER) {
    console.error('ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_PEPPER must be set in .env')
    process.exit(1)
  }

  await prisma.product.deleteMany({})
  await prisma.user.deleteMany({})

  await prisma.product.createMany({
    data: [
      {
        name: 'Pizza Muzzarella',
        slug: 'pizza-muzzarella',
        description: 'Pizza con muzzarella y salsa de tomate',
        price: 12000,
        image: '/Food/pizza.png',
        category: 'Pizzas',
        available: true,
      },
      {
        name: 'Hamburguesa Clásica',
        slug: 'hamburguesa-clasica',
        description: 'Carne, lechuga, tomate, cebolla y aderezo',
        price: 15000,
        image: '/Food/hamburguesa.png',
        category: 'Hamburguesas',
        available: true,
      },
      {
        name: 'Papas Fritas',
        slug: 'papas-fritas',
        description: 'Papas fritas crocantes con sal',
        price: 6000,
        image: '/Food/papas.png',
        category: 'Acompañamientos',
        available: true,
      },
      {
        name: 'Empanadas',
        slug: 'empanadas',
        description: 'Empanadas de carne o pollo',
        price: 4000,
        image: '/Food/empanadas.png',
        category: 'Empanadas',
        available: true,
      },
      {
        name: 'Cerveza Artesanal',
        slug: 'cerveza-artesanal',
        description: 'Cerveza rubia artesanal 500ml',
        price: 8000,
        image: '/Food/logo.png',
        category: 'Bebidas',
        available: true,
      },
    ],
  })

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

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
