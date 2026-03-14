import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Package, ArrowUpRight, ArrowDownLeft, TrendingUp, Info, FileText } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'
import { LiveClock } from '@/components/LiveClock'
import { ExportCSV } from '@/components/ExportCSV'

export default async function Home() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const productsCount = await prisma.product.count()
  const totalStock = await prisma.product.aggregate({ _sum: { stock: true } })

  const recentTransactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { 
      product: true,
      // @ts-ignore
      user: true 
    }
  })

  return (
    <div className="flex-1 w-full px-5 pt-10 pb-12">
      
      {/* ── HEADER & GREETING ── */}
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Hệ thống Kho PRO v2.5</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            Chào, <span className="text-blue-600">{user.name}</span>
          </h1>
          <div className="mt-2 scale-90 origin-left">
            <LiveClock />
          </div>
        </div>
        <LogoutButton />
      </header>

      {/* ── QUICK STATS (SOLID) ── */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-blue-100">
            <Package size={32} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mặt hàng</p>
          <p className="text-2xl font-black text-slate-900">{productsCount}</p>
        </div>

        <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-emerald-100">
            <TrendingUp size={32} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng tồn</p>
          <p className="text-2xl font-black text-slate-900">{totalStock._sum.stock || 0}</p>
        </div>
      </div>

      {/* ── EXPORT ACTION ── */}
      <div className="mb-8">
        <ExportCSV data={recentTransactions} />
      </div>

      {/* ── RECENT TRANSACTIONS (LIGHT PRO) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Lịch sử xuất nhập</h2>
          <div className="h-[2px] flex-1 bg-slate-100 mx-4 rounded-full" />
          <Info size={14} className="text-slate-300" />
        </div>

        {recentTransactions.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
            <Package size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-xs font-bold text-slate-400 uppercase">Chưa có dữ liệu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(recentTransactions as any[]).map((tx) => {
              const isIn = tx.type === 'IN'
              return (
                <div key={tx.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Icon Square */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIn ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {isIn ? <ArrowDownLeft size={22} strokeWidth={3} /> : <ArrowUpRight size={22} strokeWidth={3} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate leading-tight">{tx.product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${isIn ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {isIn ? 'Nhập' : 'Xuất'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-blue-500 font-black truncate">{tx.user?.name || 'Hệ thống'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-lg font-black ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isIn ? '+' : '-'}{tx.quantity}
                      </p>
                      <p className="text-[9px] text-slate-400 font-black uppercase">{tx.product.unit}</p>
                    </div>
                  </div>

                  {/* RESTORED NOTES */}
                  {tx.note && (
                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-start gap-2">
                       <FileText size={12} className="text-slate-300 flex-shrink-0 mt-0.5" />
                       <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">{tx.note}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}