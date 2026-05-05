import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatPeso } from '../../lib/utils'

export function TopProductsChart({ data }: { data: Array<{ name: string; revenue: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,.12)" />
        <XAxis dataKey="name" stroke="#FFF8F0" tick={{ fontSize: 10 }} interval={0} angle={-20} height={60} />
        <YAxis stroke="#FFF8F0" tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => formatPeso(Number(value))} contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,.2)', borderRadius: 16 }} />
        <Bar dataKey="revenue" fill="#0D9488" radius={[12, 12, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
