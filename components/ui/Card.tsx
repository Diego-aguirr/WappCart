import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

type CardSectionProps = {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardSectionProps) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }: CardSectionProps) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: CardSectionProps) {
  return (
    <div className={`border-t border-neutral-100 px-4 py-3 ${className}`}>
      {children}
    </div>
  )
}
