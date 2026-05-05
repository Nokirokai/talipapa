import { BarChart3, LogOut, Package, Settings, ShoppingCart, TrendingUp, Warehouse } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Logo } from './Logo'

const nav = [
  { path: '/', label: 'POS', icon: ShoppingCart },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/price-monitoring', label: 'Price Monitoring', icon: TrendingUp },
  { path: '/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  path: string
  onNavigate: (path: string) => void
  onLogout: () => void
  email?: string
}

export function Sidebar({ path, onNavigate, onLogout, email }: SidebarProps) {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-white/15 bg-white/10 p-3 shadow-glass backdrop-blur-xl md:flex md:flex-col print:hidden xl:w-72 xl:p-4">
      <Logo />
      <nav className="mt-6 space-y-1.5">
        {nav.map((item) => {
          const Icon = item.icon
          const active = path === item.path
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-white/75 transition xl:px-4 xl:py-3',
                active ? 'bg-amber-300/20 text-amber-100 shadow-glass ring-1 ring-amber-300/35' : 'hover:bg-white/10',
              )}
            >
              <Icon size={20} />
              {item.label}
            </button>
          )
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/15 bg-slate-950/25 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-400 font-display font-bold text-slate-950 shadow-clay">
            {email?.[0]?.toUpperCase() ?? 'T'}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-talipapa-white">{email ?? 'Demo cashier'}</div>
            <div className="text-xs font-semibold text-white/50">J&R Talipapa</div>
          </div>
        </div>
        <button onClick={onLogout} className="mt-4 flex w-full items-center gap-2 text-sm font-bold text-white/65 hover:text-white">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
