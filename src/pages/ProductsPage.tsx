import { useMemo, useState } from 'react'
import { Edit3, ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { useCategories } from '../hooks/useCategories'
import { useDeleteProduct, useProducts, useSaveProduct } from '../hooks/useProducts'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { cn, formatPeso } from '../lib/utils'
import type { Product, Unit } from '../types'

const units: Unit[] = ['kg', 'pc', 'bundle', 'tali', 'dozen', 'liter']
const fieldClass = 'h-11 w-full rounded-2xl bg-slate-950/40 px-3 text-sm font-bold text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30'
const labelClass = 'space-y-1.5 text-xs font-extrabold uppercase text-amber-100/60'
const emptyProduct = (): Product => ({
  id: crypto.randomUUID(),
  category_id: '',
  name: '',
  description: '',
  unit: 'pc',
  price: 0,
  stock_qty: 0,
  low_stock_threshold: 5,
  image_url: null,
  barcode: `899${Math.floor(Math.random() * 100000000)}`,
  is_active: true,
  created_at: new Date().toISOString(),
})

export function ProductsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [editing, setEditing] = useState<Product | null>(null)
  const { data: products = [] } = useProducts()
  const { data: categories = [] } = useCategories()
  const saveProduct = useSaveProduct()
  const deleteProduct = useDeleteProduct()

  const filtered = useMemo(() => {
    const needle = query.toLowerCase()
    return products.filter((product) =>
      (category === 'all' || product.category_id === category) &&
      (!needle || `${product.name} ${product.description} ${product.barcode}`.toLowerCase().includes(needle)),
    )
  }, [category, products, query])

  const uploadImage = async (file: File) => {
    if (!hasSupabaseConfig || !supabase || !editing) return URL.createObjectURL(file)
    const path = `products/${editing.id}-${file.name}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (error) throw error
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
  }

  return (
    <PageWrapper title="Products" subtitle="Magdagdag, i-edit, at ayusin ang paninda" search={query} onSearch={setQuery}>
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-2xl border border-white/15 bg-slate-950/40 px-4 text-sm font-bold text-white">
          <option value="all">Lahat ng category</option>
          {categories.map((row) => <option key={row.id} value={row.id}>{row.emoji} {row.name}</option>)}
        </select>
        <Button className="h-11 px-5" icon={<Plus size={18} />} onClick={() => setEditing({ ...emptyProduct(), category_id: categories[0]?.id ?? '' })}>Magdagdag</Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-white/10 text-xs uppercase text-amber-100/70">
              <tr>
                <th className="px-3 py-2.5">Produkto</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Unit</th>
                <th className="px-3 py-2.5">Presyo</th>
                <th className="px-3 py-2.5">Stock</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const cat = categories.find((row) => row.id === product.category_id)
                return (
                  <tr key={product.id} className={cn('border-t border-white/10 text-sm text-white/85', product.stock_qty <= product.low_stock_threshold && 'bg-amber-400/15')}>
                    <td className="px-3 py-2.5 font-extrabold leading-tight">{product.name}<div className="text-xs font-semibold text-white/45">{product.barcode}</div></td>
                    <td className="px-3 py-2.5">{cat?.emoji} {cat?.name}</td>
                    <td className="px-3 py-2.5">{product.unit}</td>
                    <td className="px-3 py-2.5">{formatPeso(product.price)}</td>
                    <td className="px-3 py-2.5">{product.stock_qty}</td>
                    <td className="px-3 py-2.5">{product.is_active ? 'Active' : 'Inactive'}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex justify-end gap-1.5">
                        <Button className="h-8 w-8" variant="glass" icon={<Edit3 size={14} strokeWidth={3} />} onClick={() => setEditing(product)} />
                        <Button className="h-8 w-8" variant="glass" icon={<Save size={14} strokeWidth={3} />} onClick={() => saveProduct.mutate({ ...product, is_active: !product.is_active })} />
                        <Button className="h-8 w-8" variant="danger" icon={<Trash2 size={14} strokeWidth={3} />} onClick={() => deleteProduct.mutate(product.id)} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={Boolean(editing)} title={editing?.name ? 'I-edit Produkto' : 'Magdagdag Produkto'} onClose={() => setEditing(null)} className="max-w-xl">
        {editing ? (
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              saveProduct.mutate(editing, { onSuccess: () => setEditing(null) })
            }}
          >
            <label className={labelClass}>
              Pangalan
              <input className={fieldClass} placeholder="Hal. Bangus, Kangkong, Toyo 350ml" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required />
            </label>
            <label className={labelClass}>
              Category
              <select className={fieldClass} value={editing.category_id} onChange={(event) => setEditing({ ...editing, category_id: event.target.value })} required>
              <option value="" disabled>Pumili ng category</option>
              {categories.map((row) => <option key={row.id} value={row.id}>{row.emoji} {row.name}</option>)}
              </select>
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              Description
              <textarea className="min-h-20 w-full rounded-2xl bg-slate-950/40 p-3 text-sm font-bold text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30" placeholder="Maikling description ng paninda" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} />
            </label>
            <label className={labelClass}>
              Unit
              <select className={fieldClass} value={editing.unit} onChange={(event) => setEditing({ ...editing, unit: event.target.value as Unit })}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select>
            </label>
            <label className={labelClass}>
              Presyo
              <input type="number" className={fieldClass} placeholder="Hal. 180" value={editing.price} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} />
            </label>
            <label className={labelClass}>
              Stock
              <input type="number" className={fieldClass} placeholder="Kasalukuyang stock" value={editing.stock_qty} onChange={(event) => setEditing({ ...editing, stock_qty: Number(event.target.value) })} />
            </label>
            <label className={labelClass}>
              Low Stock Alert
              <input type="number" className={fieldClass} placeholder="Alert kapag mababa na" value={editing.low_stock_threshold} onChange={(event) => setEditing({ ...editing, low_stock_threshold: Number(event.target.value) })} />
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              Barcode
              <input className={fieldClass} placeholder="Scan or type barcode" value={editing.barcode} onChange={(event) => setEditing({ ...editing, barcode: event.target.value })} />
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white/10 p-3 font-bold text-white shadow-clay md:col-span-2">
              <ImagePlus size={18} /> Upload image
              <input type="file" className="hidden" accept="image/*" onChange={async (event) => {
                const file = event.target.files?.[0]
                if (file) setEditing({ ...editing, image_url: await uploadImage(file) })
              }} />
            </label>
            <div className="flex justify-end gap-2 md:col-span-2">
              <Button type="button" variant="glass" icon={<Trash2 size={18} className="rotate-45" />} onClick={() => setEditing(null)}>Kanselahin</Button>
              <Button type="submit" icon={<Save size={18} />}>I-save</Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </PageWrapper>
  )
}
