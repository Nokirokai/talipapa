import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { localDb } from '../lib/localDb'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { Product } from '../types'

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!hasSupabaseConfig || !supabase) return localDb.products()
      const { data, error } = await supabase.from('products').select('*').order('name')
      if (error) throw error
      return data as Product[]
    },
  })

export const useSaveProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!hasSupabaseConfig || !supabase) return localDb.upsertProduct(product)
      const { data, error } = await supabase.from('products').upsert(product).select().single()
      if (error) throw error
      return data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Na-save ang produkto')
    },
  })
}

export const useAdjustStock = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ product, delta }: { product: Product; delta: number; reason: string }) => {
      if (!hasSupabaseConfig || !supabase) return localDb.adjustStock(product.id, delta)
      const { data, error } = await supabase
        .from('products')
        .update({ stock_qty: Math.max(0, Number(product.stock_qty) + delta) })
        .eq('id', product.id)
        .select()
        .single()
      if (error) throw error
      return data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Na-update ang stock')
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!hasSupabaseConfig || !supabase) return localDb.deleteProduct(productId)
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) throw error
      return productId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Nabura ang produkto')
    },
  })
}
