import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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

  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@wappcart.com' },
    update: {},
    create: {
      email: 'admin@wappcart.com',
      password: hashedPassword,
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
