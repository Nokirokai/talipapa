import { Menu, Search } from 'lucide-react'
import { Input } from '../ui/Input'

interface HeaderProps {
  title: string
  subtitle?: string
  search?: string
  onSearch?: (value: string) => void
}

export function Header({ title, subtitle, search, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex flex-col gap-2 border-b border-white/10 bg-slate-950/20 p-3 backdrop-blur-xl md:flex-row md:items-center md:justify-between print:hidden">
      <div className="flex items-center gap-3">
        <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white md:hidden">
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl font-extrabold leading-tight text-talipapa-white md:text-2xl">{title}</h1>
          {subtitle ? <p className="mt-0.5 text-xs font-semibold text-amber-100/65 md:text-sm">{subtitle}</p> : null}
        </div>
      </div>
      {onSearch ? (
        <div className="w-full md:max-w-sm">
          <Input icon={<Search size={18} />} value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Hanapin..." />
        </div>
      ) : null}
    </header>
  )
}
