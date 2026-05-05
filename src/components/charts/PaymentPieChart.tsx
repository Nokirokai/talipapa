import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatPeso } from '../../lib/utils'

const colors = ['#F59E0B', '#38BDF8', '#10B981', '#FB7185']

export function PaymentPieChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={4}>
          {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip formatter={(value) => formatPeso(Number(value))} contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,.2)', borderRadius: 16 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
