import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { localDb } from '../lib/localDb'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { CartItem, Discount, PaymentMethod, Receipt, Transaction, TransactionItem } from '../types'
import { computeCart, generateTxnNo } from '../lib/utils'

export const useDiscounts = () =>
  useQuery({
    queryKey: ['discounts'],
    queryFn: async () => {
      if (!hasSupabaseConfig || !supabase) return localDb.discounts()
      const { data, error } = await supabase.from('discounts').select('*').eq('is_active', true).order('name')
      if (error) throw error
      return data as Discount[]
    },
  })

export const useTransactions = () =>
  useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!hasSupabaseConfig || !supabase) return localDb.transactions()
      const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as Transaction[]
    },
  })

export const useTransactionItems = () =>
  useQuery({
    queryKey: ['transaction-items'],
    queryFn: async () => {
      if (!hasSupabaseConfig || !supabase) return localDb.transactionItems()
      const { data, error } = await supabase.from('transaction_items').select('*')
      if (error) throw error
      return data as TransactionItem[]
    },
  })

export const useProcessTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      items,
      discount,
      paymentMethod,
      amountTendered,
      cashierId,
      notes,
    }: {
      items: CartItem[]
      discount?: Discount | null
      paymentMethod: PaymentMethod
      amountTendered: number
      cashierId?: string | null
      notes?: string | null
    }): Promise<Receipt> => {
      const totals = computeCart(items, discount)
      const changeAmount = paymentMethod === 'cash' ? Math.max(0, amountTendered - totals.total) : 0
      if (!hasSupabaseConfig || !supabase) {
        return localDb.processTransaction({
          items,
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          discountType: discount?.name ?? null,
          total: totals.total,
          amountTendered,
          changeAmount,
          paymentMethod,
          cashierId,
          notes,
        })
      }

      const transactionPayload = {
        txn_no: generateTxnNo(),
        cashier_id: cashierId ?? null,
        subtotal: totals.subtotal,
        discount_amount: totals.discountAmount,
        discount_type: discount?.name ?? null,
        total: totals.total,
        amount_tendered: amountTendered,
        change_amount: changeAmount,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cash' ? 'paid' : 'unpaid',
        notes: notes ?? null,
        status: 'completed',
      }
      const { data: transaction, error: txnError } = await supabase
        .from('transactions')
        .insert(transactionPayload)
        .select()
        .single()
      if (txnError) throw txnError

      const itemPayload = items.map(({ product, qty }) => ({
        transaction_id: transaction.id,
        product_id: product.id,
        product_name: product.name,
        unit: product.unit,
        qty,
        unit_price: product.price,
        subtotal: product.price * qty,
      }))
      const { data: insertedItems, error: itemsError } = await supabase
        .from('transaction_items')
        .insert(itemPayload)
        .select()
      if (itemsError) throw itemsError

      for (const item of items) {
        const { error } = await supabase
          .from('products')
          .update({ stock_qty: Math.max(0, item.product.stock_qty - item.qty) })
          .eq('id', item.product.id)
        if (error) throw error
      }

      return { transaction: transaction as Transaction, items: insertedItems as TransactionItem[] }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction-items'] })
      toast.success('Tapos na ang transaksyon')
    },
    onError: () => toast.error('Hindi ma-process ang transaksyon'),
  })
}
