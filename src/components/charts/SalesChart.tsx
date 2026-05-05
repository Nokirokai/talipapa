import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatPeso } from '../../lib/utils'

export function SalesChart({ data }: { data: Array<{ date: string; sales: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="sales" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#0D9488" stopOpacity={0.08} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,.12)" />
        <XAxis dataKey="date" stroke="#FFF8F0" tick={{ fontSize: 11 }} />
        <YAxis stroke="#FFF8F0" tickFormatter={(value) => `₱${value}`} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => formatPeso(Number(value))} contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,.2)', borderRadius: 16 }} />
        <Area type="monotone" dataKey="sales" stroke="#FBBF24" fill="url(#sales)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
