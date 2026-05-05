import type { ReactNode } from 'react'
import { Header } from './Header'

interface PageWrapperProps {
  title: string
  subtitle?: string
  children: ReactNode
  search?: string
  onSearch?: (value: string) => void
}

export function PageWrapper({ title, subtitle, children, search, onSearch }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex-1 overflow-auto">
      <Header title={title} subtitle={subtitle} search={search} onSearch={onSearch} />
      <main className="p-3 pb-20 md:p-4">{children}</main>
    </div>
  )
}
