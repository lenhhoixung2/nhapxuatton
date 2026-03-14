export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Package, Search, ChevronRight } from 'lucide-react'
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
    <div className="flex-1 w-full pb-24">
      
      {/* ── HEADER ── */}
      <header className="bg-slate-900 text-white px-6 pt-10 pb-8 flex items-end justify-between border-b-4 border-indigo-600">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Danh Mục</h1>
          <p className="text-[9px] text-indigo-300 font-bold mt-1 uppercase tracking-[0.2em]">{products.length} mã hàng đang lưu kho</p>
        </div>

        {canEdit && (
          <Link
            href="/products/new"
            className="flex items-center gap-2 px-4 py-3 bg-white text-slate-900 rounded-lg font-black text-[11px] uppercase shadow-lg active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={4} />
            Thêm mới
          </Link>
        )}
      </header>

      {/* ── SEARCH (SOLID) ── */}
      <div className="px-6 py-6 bg-slate-100/50 border-b border-slate-200">
        <div className="relative group">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo Tên hoặc Mã vạch..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all placeholder-slate-300"
          />
        </div>
      </div>

      {/* ── LIST ── */}
      <div className="px-6 pt-6 space-y-3">
        {products.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-16 text-center">
            <Package size={40} className="mx-auto mb-4 text-slate-200" />
            <p className="text-xs font-black text-slate-300 uppercase">Chưa có sản phẩm</p>
          </div>
        ) : (
          products.map((prod: any) => (
            <div key={prod.id} className="bg-white border-2 border-slate-100 rounded-xl p-4 flex items-center gap-4 shadow-sm border-l-4 border-l-blue-700">
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-black text-slate-950 truncate uppercase tracking-tight">{prod.name}</h3>
                <p className="text-[9px] text-slate-400 font-mono font-bold mt-1 tracking-widest">{prod.barcode}</p>
              </div>

              <div className="text-right">
                <p className="text-lg font-black text-slate-900 leading-tight">
                  {prod.stock} <span className="text-[10px] text-slate-400 font-black">{prod.unit}</span>
                </p>
                <p className="text-[9px] text-blue-600 font-black mt-0.5">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                </p>
              </div>

              {canEdit && (
                <Link
                  href={`/products/${prod.id}`}
                  className="p-3 bg-slate-900 text-white rounded-lg active:scale-90 transition-all"
                >
                  <Pencil size={16} strokeWidth={3} />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
