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
    <div className="min-h-screen flex-1 overflow-auto pt-[env(safe-area-inset-top)] px-[env(safe-area-inset-right)]">
      <Header title={title} subtitle={subtitle} search={search} onSearch={onSearch} />
      <main className="p-6 pb-40 md:p-8 lg:p-10">{children}</main>
    </div>
  )
}
