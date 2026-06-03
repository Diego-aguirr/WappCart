import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody } from '@/components/ui/Card'

type ProductDetailProps = {
  product: Product
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <article>
      <nav className="mb-6">
        <Link
          href="/menu"
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Volver al menú
        </Link>
      </nav>

      <Card>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <CardBody className="flex flex-col justify-center gap-4 py-6">
            <div>
              <Badge variant="neutral" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-neutral-900">
                {product.name}
              </h1>
            </div>

            <p className="text-neutral-600">{product.description}</p>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.available ? (
                <Badge variant="success">Disponible</Badge>
              ) : (
                <Badge variant="danger">No disponible</Badge>
              )}
            </div>
          </CardBody>
        </div>
      </Card>
    </article>
  )
}
