import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Logo } from '../components/layout/Logo'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export function AuthPage({ onDemoLogin }: { onDemoLogin: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (hasSupabaseConfig && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        onDemoLogin(email)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hindi makapag-login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,.22),transparent_30%),linear-gradient(135deg,#451a03,#7c2d12,#4c0519)] p-4">
      <div className="absolute left-10 top-10 h-28 w-28 animate-float rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute bottom-12 right-12 h-36 w-36 animate-float rounded-full bg-teal-300/20 blur-3xl" />
      <Card className="relative w-full max-w-md p-8">
        <div className="mb-8">
          <Logo />
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input className="h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-bold text-white outline-none placeholder:text-white/40" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <input className="h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-bold text-white outline-none placeholder:text-white/40" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          <Button className="h-12 w-full" disabled={loading}>{loading ? 'Papasok...' : 'Login'}</Button>
          {!hasSupabaseConfig ? <p className="text-center text-xs font-semibold text-amber-100/60">Demo mode: add Supabase env vars for real auth.</p> : null}
        </form>
      </Card>
    </div>
  )
}
