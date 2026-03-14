export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Package, Search, Filter, ChevronRight } from 'lucide-react'
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
    <div className="flex-1 w-full px-5 pt-10 pb-24 bg-slate-50/30">
      
      {/* ── HEADER ── */}
      <header className="mb-8 flex items-end justify-between">
        <div>
          <div className="inline-block mb-2 px-2.5 py-0.5 bg-blue-600 text-white rounded-lg">
            <span className="text-[10px] font-black uppercase tracking-widest">Kho Hàng</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Danh Mục</h1>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{products.length} mã sản phẩm</p>
        </div>

        {canEdit && (
          <Link
            href="/products/new"
            className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
          </Link>
        )}
      </header>

      {/* ── SEARCH BAR (CLEAN) ── */}
      <div className="relative mb-8 group">
        <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Tìm tên hoặc mã vạch..." 
          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500/30 transition-all placeholder-slate-300 shadow-sm"
        />
      </div>

      {/* ── PRODUCT LIST (SOLID) ── */}
      {!user && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6 flex items-center gap-3">
          <span className="text-lg">🔒</span>
          <p className="text-[10px] font-bold text-amber-700 uppercase leading-relaxed">Đăng nhập để chỉnh sửa thông tin hàng hóa</p>
        </div>
      )}

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-16 text-center">
            <Package size={40} className="mx-auto mb-4 text-slate-200" strokeWidth={1.5} />
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Kho trống rỗng</p>
          </div>
        ) : (
          products.map((prod: any) => (
            <div key={prod.id} className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-100 transition-all shadow-sm">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 transition-colors">
                <Package size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-900 truncate">{prod.name}</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold tracking-tight">{prod.barcode}</p>
              </div>

              <div className="text-right">
                <p className="text-base font-black text-blue-600">
                  {prod.stock} <span className="text-[10px] text-slate-400 uppercase ml-0.5">{prod.unit}</span>
                </p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                </p>
              </div>

              {canEdit && (
                <Link
                  href={`/products/${prod.id}`}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                >
                  <Pencil size={16} strokeWidth={2.5} />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
