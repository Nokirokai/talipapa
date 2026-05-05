import { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { BarChart3, Package, Settings, ShoppingCart, Warehouse } from 'lucide-react'
import { AuthPage } from './pages/AuthPage'
import { InventoryPage } from './pages/InventoryPage'
import { POSPage } from './pages/POSPage'
import { ProductsPage } from './pages/ProductsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { Sidebar } from './components/layout/Sidebar'
import { hasSupabaseConfig, supabase } from './lib/supabase'
import { cn } from './lib/utils'

const queryClient = new QueryClient()

const mobileNav = [
  { path: '/', icon: ShoppingCart, label: 'POS' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/inventory', icon: Warehouse, label: 'Inventory' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

function AppContent() {
  const [path, setPath] = useState(window.location.pathname)
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem('talipapa-demo-user'))
  const [userId, setUserId] = useState<string | null>(null)
  const query = useQueryClient()

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
      setUserId(data.user?.id ?? null)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
      setUserId(session?.user?.id ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return
    const client = supabase
    const channel = client
      .channel('products-stock')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => query.invalidateQueries({ queryKey: ['products'] }))
      .subscribe()
    return () => {
      client.removeChannel(channel)
    }
  }, [query])

  useEffect(() => {
    const pop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', pop)
    return () => window.removeEventListener('popstate', pop)
  }, [])

  const navigate = (next: string) => {
    window.history.pushState({}, '', next)
    setPath(next)
  }

  const logout = async () => {
    localStorage.removeItem('talipapa-demo-user')
    if (hasSupabaseConfig && supabase) await supabase.auth.signOut()
    setUserEmail(null)
    setUserId(null)
  }

  const page = useMemo(() => {
    if (path === '/products') return <ProductsPage />
    if (path === '/inventory') return <InventoryPage />
    if (path === '/reports') return <ReportsPage />
    if (path === '/settings') return <SettingsPage />
    return <POSPage cashierId={userId} cashierName={userEmail ?? 'Demo cashier'} />
  }, [path, userId, userEmail])

  if (!userEmail) {
    return (
      <AuthPage
        onDemoLogin={(email) => {
          localStorage.setItem('talipapa-demo-user', email)
          setUserEmail(email)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,.24),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(13,148,136,.18),transparent_25%),linear-gradient(135deg,#451a03,#7c2d12,#4c0519)] text-talipapa-white">
      <div className="flex min-h-screen">
        <Sidebar path={path} onNavigate={navigate} onLogout={logout} email={userEmail} />
        {page}
      </div>
      <nav className="fixed bottom-3 left-3 right-3 z-40 grid grid-cols-5 rounded-3xl border border-white/15 bg-slate-950/50 p-1.5 shadow-glass backdrop-blur-xl md:hidden print:hidden">
        {mobileNav.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.path} onClick={() => navigate(item.path)} className={cn('grid place-items-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-bold text-white/60', path === item.path && 'bg-amber-300/20 text-amber-100')}>
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster position="top-right" toastOptions={{ style: { background: '#0F172A', color: '#FFF8F0', border: '1px solid rgba(255,255,255,.18)' } }} />
    </QueryClientProvider>
  )
}