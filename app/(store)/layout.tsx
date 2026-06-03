import { Header } from '@/components/layout/Header'
import { Container } from '@/components/layout/Container'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <Container>{children}</Container>
      </main>
    </>
  )
}
