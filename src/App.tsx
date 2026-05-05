import { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { BarChart3, LogOut, Package, Settings, ShoppingCart, TrendingUp, Wallet, Warehouse, Menu, X } from 'lucide-react'
import { AuthPage } from './pages/AuthPage'
import { InventoryPage } from './pages/InventoryPage'
import { POSPage } from './pages/POSPage'
import { ProductsPage } from './pages/ProductsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { PriceMonitoringPage } from './pages/PriceMonitoringPage'
import { UtangPage } from './pages/UtangPage'
import { Sidebar } from './components/layout/Sidebar'
import { hasSupabaseConfig, supabase } from './lib/supabase'
import { cn } from './lib/utils'

const queryClient = new QueryClient()

const mainMobileNav = [
  { path: '/', icon: ShoppingCart, label: 'POS' },
  { path: '/products', icon: Package, label: 'Items' },
  { path: '/utang', icon: Wallet, label: 'Utang' },
  { path: '/price-monitoring', icon: TrendingUp, label: 'Price' },
]

const moreMobileNav = [
  { path: '/inventory', icon: Warehouse, label: 'Inventory' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

function AppContent() {
  const [path, setPath] = useState(window.location.pathname)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    setIsMenuOpen(false)
  }

  const logout = async () => {
    localStorage.removeItem('talipapa-demo-user')
    if (hasSupabaseConfig && supabase) await supabase.auth.signOut()
    setUserEmail(null)
    setUserId(null)
  }

  const page = useMemo(() => {
    if (path === '/products') return <ProductsPage />
    if (path === '/price-monitoring') return <PriceMonitoringPage />
    if (path === '/utang') return <UtangPage />
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
        <main className="flex-1 min-w-0">{page}</main>
      </div>

      {/* Mobile Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/40 backdrop-blur-3xl animate-in fade-in duration-300 md:hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-2xl font-black uppercase tracking-widest text-amber-100">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-3 rounded-2xl bg-white/10 text-white shadow-clay"><X size={24} /></button>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {moreMobileNav.map((item) => {
              const Icon = item.icon
              const active = path === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex w-full items-center gap-4 p-5 rounded-[28px] text-lg font-black transition-all",
                    active ? "bg-amber-400 text-slate-950 shadow-clay" : "bg-white/10 text-white backdrop-blur-xl border border-white/10"
                  )}
                >
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
                    <Icon size={24} />
                  </div>
                  {item.label}
                </button>
              )
            })}
            <div className="pt-8 border-t border-white/10">
              <button 
                onClick={logout}
                className="flex w-full items-center gap-4 p-5 rounded-[28px] text-lg font-black bg-rose-500/20 text-rose-100 border border-rose-500/30 backdrop-blur-xl"
              >
                <div className="h-12 w-12 rounded-2xl bg-rose-500/20 flex items-center justify-center shadow-inner">
                  <LogOut size={24} />
                </div>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar - RESTORED GLASSMORPHISM */}
      <nav className="fixed bottom-6 left-6 right-6 z-40 grid grid-cols-5 gap-1 rounded-[32px] border border-white/20 bg-white/10 p-2 shadow-glass backdrop-blur-3xl md:hidden print:hidden">
        {mainMobileNav.map((item) => {
          const Icon = item.icon
          const active = path === item.path
          return (
            <button 
              key={item.path} 
              onClick={() => navigate(item.path)} 
              className={cn(
                'grid place-items-center gap-1 rounded-2xl py-3 text-[10px] font-black uppercase tracking-tight transition-all duration-300', 
                active ? 'bg-amber-400 text-slate-950 shadow-clay scale-105 z-10' : 'text-white/60 hover:text-white'
              )}
            >
              <Icon size={20} />
              <span className="truncate w-full text-center">{item.label}</span>
            </button>
          )
        })}
        <button 
          onClick={() => setIsMenuOpen(true)} 
          className={cn(
            'grid place-items-center gap-1 rounded-2xl py-3 text-[10px] font-black uppercase tracking-tight transition-all duration-300',
            isMenuOpen ? 'bg-amber-400 text-slate-950 shadow-clay scale-105 z-10' : 'text-white/60 hover:text-white'
          )}
        >
          <Menu size={20} />
          <span className="truncate w-full text-center">Higit</span>
        </button>
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
