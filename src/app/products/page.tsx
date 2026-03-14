export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Package, Search, Filter } from 'lucide-react'
import { getCurrentUser, ensureDefaultAdmin } from '@/lib/auth'
import { canEditProducts } from '@/lib/auth-utils'

export default async function ProductsPage() {
  await ensureDefaultAdmin()
  const [products, user] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    getCurrentUser(),
  ])

  const canEdit = user && canEditProducts(user)

  return (
    <div className="flex-1 w-full px-6 pt-12 pb-24">
      
      {/* ── HEADER ── */}
      <header className="mb-10 flex items-end justify-between">
        <div>
          <div className="inline-block mb-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Hàng hóa</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-tight text-white">
            Danh mục <br />
            <span className="text-gradient">Sản phẩm</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-widest">{products.length} mặt hàng đang quản lý</p>
        </div>

        {canEdit && (
          <Link
            href="/products/new"
            className="group relative p-4 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-900/40 hover:bg-blue-500 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus className="w-6 h-6 text-white" strokeWidth={3} />
          </Link>
        )}
      </header>

      {/* ── SEARCH & FILTER (UI) ── */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 glass-card rounded-2xl flex items-center px-4 py-3 border-white/5 group focus-within:border-blue-500/50 transition-colors">
          <Search size={18} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="bg-transparent border-none outline-none text-sm font-bold text-white placeholder-slate-600 ml-3 w-full"
          />
        </div>
        <button className="glass-card rounded-2xl p-4 border-white/5 text-slate-400 hover:text-white transition-colors active:scale-95">
          <Filter size={18} />
        </button>
      </div>

      {/* ── PRODUCT LIST ── */}
      {!user && (
        <div className="glass-card rounded-2xl p-4 border-amber-500/10 mb-6 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
            🔒
          </div>
          <p className="text-[11px] font-bold text-amber-200/70">Đăng nhập để có quyền chỉnh sửa sản phẩm</p>
        </div>
      )}

      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center border-dashed border-white/10 opacity-60">
            <Package size={40} className="mx-auto mb-4 text-slate-600" strokeWidth={1.5} />
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Kho trống rỗng</p>
          </div>
        ) : (
          products.map((prod: any) => (
            <div key={prod.id} className="glass-card rounded-[2rem] p-5 flex items-center gap-4 hover:border-white/10 active:scale-[0.99] transition-all group">
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-white truncate leading-tight group-hover:text-blue-400 transition-colors">{prod.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">ID: {prod.barcode}</span>
                  <div className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{prod.unit}</span>
                </div>
              </div>

              {/* Stock & Price Info */}
              <div className="text-right flex flex-col items-end gap-2">
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <p className="text-sm font-black text-blue-400">
                    {prod.stock} <span className="text-[10px] opacity-70 ml-0.5">{prod.unit}</span>
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                </p>
              </div>

              {/* Edit Button */}
              {canEdit && (
                <Link
                  href={`/products/${prod.id}`}
                  className="p-3 rounded-2xl glass-button text-slate-400 hover:text-white transition-all shadow-lg active:scale-90"
                  title="Chỉnh sửa"
                >
                  <Pencil size={18} strokeWidth={2.5} />
                </Link>
              )}
            </div>
          ))
        )}
      </div>

      {/* Decorative background for the list */}
      <div className="absolute top-1/2 left-0 w-full h-[300px] bg-blue-900/5 blur-[120px] pointer-events-none -z-10" />
    </div>
  )
}
