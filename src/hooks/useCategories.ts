import { useQuery } from '@tanstack/react-query'
import { localDb } from '../lib/localDb'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { Category } from '../types'

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!hasSupabaseConfig || !supabase) return localDb.categories()
      const { data, error } = await supabase.from('categories').select('*').order('sort_order')
      if (error) throw error
      return data as Category[]
    },
  })
