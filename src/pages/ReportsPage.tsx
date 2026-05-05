import { useState } from 'react'
import { PaymentPieChart } from '../components/charts/PaymentPieChart'
import { SalesChart } from '../components/charts/SalesChart'
import { TopProductsChart } from '../components/charts/TopProductsChart'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card } from '../components/ui/Card'
import { useReports } from '../hooks/useReports'
import { formatDate, formatPeso } from '../lib/utils'

export function ReportsPage() {
  const [page, setPage] = useState(0)
  const reports = useReports()
  const rows = reports.transactions.slice(page * 8, page * 8 + 8)
  const metricCards = [
    ['Total Sales', formatPeso(reports.netSales)],
    ['Total Transactions', reports.totalTransactions],
    ['Avg Transaction Value', formatPeso(reports.avgTransaction)],
    ['Top Product', reports.topProduct],
  ]

  return (
    <PageWrapper title="Reports" subtitle="Benta, produkto, at payment method">
      <div className="mb-4 flex flex-wrap gap-3">
        <input type="date" className="rounded-2xl bg-slate-950/40 px-4 py-3 font-bold text-white" />
        <input type="date" className="rounded-2xl bg-slate-950/40 px-4 py-3 font-bold text-white" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(([label, value]) => (
          <Card key={String(label)} className="p-5">
            <div className="text-xs font-extrabold uppercase text-amber-100/55">{label}</div>
            <div className="mt-2 font-display text-2xl font-extrabold text-talipapa-white">{value}</div>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 font-display text-lg font-bold text-talipapa-white">Sales over time</h3>
          <SalesChart data={reports.salesOverTime.length ? reports.salesOverTime : [{ date: new Date().toISOString().slice(0, 10), sales: 0 }]} />
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 font-display text-lg font-bold text-talipapa-white">Top 10 products by revenue</h3>
          <TopProductsChart data={reports.topProducts.length ? reports.topProducts : [{ name: 'Wala pa', revenue: 0, qty: 0 }]} />
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 font-display text-lg font-bold text-talipapa-white">Payment method breakdown</h3>
          <PaymentPieChart data={reports.paymentBreakdown.length ? reports.paymentBreakdown : [{ name: 'cash', value: 1 }]} />
        </Card>
        <Card className="overflow-hidden">
          <div className="border-b border-white/10 p-4 font-display text-lg font-bold text-talipapa-white">Transactions</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <tbody>
                {rows.map((txn) => (
                  <tr key={txn.id} className="border-b border-white/10 text-white/80">
                    <td className="px-4 py-3 font-bold">{txn.txn_no}</td>
                    <td className="px-4 py-3">{formatDate(txn.created_at)}</td>
                    <td className="px-4 py-3 uppercase">{txn.payment_method}</td>
                    <td className="px-4 py-3 text-right font-bold text-amber-100">{formatPeso(txn.total)}</td>
                  </tr>
                ))}
                {!rows.length ? <tr><td className="px-4 py-10 text-center text-white/55" colSpan={4}>Wala pang transactions</td></tr> : null}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 p-3">
            <button className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white disabled:opacity-40" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Bumalik</button>
            <button className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white disabled:opacity-40" disabled={(page + 1) * 8 >= reports.transactions.length} onClick={() => setPage((value) => value + 1)}>Susunod</button>
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
