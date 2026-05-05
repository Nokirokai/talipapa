import { Save } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useCategories } from '../hooks/useCategories'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { StoreSettings } from '../types'

const SETTINGS_KEY = 'talipapa-settings'
const fieldClass =
  'h-11 w-full rounded-2xl bg-slate-950/40 px-3 text-sm font-bold text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30'
const labelClass = 'space-y-1.5 text-xs font-extrabold uppercase text-amber-100/60'

export function SettingsPage() {
  const { data: categories = [] } = useCategories()
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const fallback = {
      storeName: 'Talipapa Sunrise Stall',
      address: 'Barangay Talipapa',
      receiptFooter: 'Salamat po sa pamimili!',
    }
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : fallback
  })
  const [password, setPassword] = useState('')

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    toast.success('Na-save ang settings')
  }

  const changePassword = async () => {
    if (!password) return
    if (hasSupabaseConfig && supabase) {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
    }
    setPassword('')
    toast.success('Na-update ang password')
  }

  return (
    <PageWrapper title="Settings" subtitle="Store, categories, at profile">
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-xl font-bold text-talipapa-white">Store Details</h2>
          <div className="mt-4 space-y-3">
            <label className={labelClass}>
              Store Name
              <input
                className={fieldClass}
                placeholder="Hal. Talipapa Sunrise Stall"
                value={settings.storeName}
                onChange={(event) => setSettings({ ...settings, storeName: event.target.value })}
              />
            </label>
            <label className={labelClass}>
              Address
              <input
                className={fieldClass}
                placeholder="Hal. Barangay Talipapa, Quezon City"
                value={settings.address}
                onChange={(event) => setSettings({ ...settings, address: event.target.value })}
              />
            </label>
            <label className={labelClass}>
              Receipt Footer
              <textarea
                className="min-h-20 w-full rounded-2xl bg-slate-950/40 p-3 text-sm font-bold text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                placeholder="Hal. Salamat po sa pamimili!"
                value={settings.receiptFooter}
                onChange={(event) => setSettings({ ...settings, receiptFooter: event.target.value })}
              />
            </label>
            <Button icon={<Save size={18} />} onClick={saveSettings}>
              I-save
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-xl font-bold text-talipapa-white">User Profile</h2>
          <div className="mt-4 flex gap-2">
            <input
              type="password"
              className={`${fieldClass} min-w-0 flex-1`}
              placeholder="Bagong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button onClick={changePassword}>I-save</Button>
          </div>
        </Card>

        <Card className="p-5 xl:col-span-2">
          <h2 className="font-display text-xl font-bold text-talipapa-white">Categories</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-2xl bg-white/10 p-3 text-white">
                <span className="font-bold">
                  {category.emoji} {category.name}
                </span>
                <span className="h-6 w-6 rounded-full shadow-clay" style={{ backgroundColor: category.color_hex }} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
