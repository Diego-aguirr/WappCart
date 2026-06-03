import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { siteConfig } from '@/config/site'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'

type ProductCardProps = {
  product: Product
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: 'currency',
    currency: siteConfig.currency,
  }).format(price)
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/menu/${product.slug}`} className="group block">
      <Card className="transition-shadow hover:shadow-md">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge variant="danger">No disponible</Badge>
            </div>
          )}
        </div>

        <CardBody>
          <h3 className="font-semibold text-neutral-900">{product.name}</h3>
        </CardBody>

        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <span className="text-lg font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.available ? (
              <Badge variant="success">Disponible</Badge>
            ) : (
              <Badge variant="danger">Agotado</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
