import { useMemo } from 'react'
import { useProducts } from './useProducts'
import { useTransactionItems, useTransactions } from './useTransactions'

export const useReports = () => {
  const transactions = useTransactions()
  const items = useTransactionItems()
  const products = useProducts()

  return useMemo(() => {
    const txnRows = transactions.data ?? []
    const itemRows = items.data ?? []
    const grossSales = txnRows.reduce((sum, row) => sum + Number(row.subtotal), 0)
    const netSales = txnRows.reduce((sum, row) => sum + Number(row.total), 0)
    const avgTransaction = txnRows.length ? netSales / txnRows.length : 0
    const byProduct = itemRows.reduce<Record<string, { name: string; revenue: number; qty: number }>>((acc, item) => {
      acc[item.product_id] ??= { name: item.product_name, revenue: 0, qty: 0 }
      acc[item.product_id].revenue += Number(item.subtotal)
      acc[item.product_id].qty += Number(item.qty)
      return acc
    }, {})
    const topProducts = Object.values(byProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
    const byDay = txnRows.reduce<Record<string, number>>((acc, txn) => {
      const day = txn.created_at.slice(0, 10)
      acc[day] = (acc[day] ?? 0) + Number(txn.total)
      return acc
    }, {})
    const salesOverTime = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, sales]) => ({ date, sales }))
    const paymentBreakdown = txnRows.reduce<Record<string, number>>((acc, txn) => {
      acc[txn.payment_method] = (acc[txn.payment_method] ?? 0) + Number(txn.total)
      return acc
    }, {})
    return {
      isLoading: transactions.isLoading || items.isLoading || products.isLoading,
      grossSales,
      netSales,
      totalTransactions: txnRows.length,
      avgTransaction,
      topProduct: topProducts[0]?.name ?? products.data?.[0]?.name ?? 'Wala pa',
      topProducts,
      salesOverTime,
      paymentBreakdown: Object.entries(paymentBreakdown).map(([name, value]) => ({ name, value })),
      transactions: txnRows,
    }
  }, [items.data, items.isLoading, products.data, products.isLoading, transactions.data, transactions.isLoading])
}
