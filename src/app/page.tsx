import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Package, ArrowUpRight, ArrowDownLeft, TrendingUp, Info, FileText, User } from 'lucide-react'
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
    <div className="flex-1 w-full pb-12">
      
      {/* ── HEADER (SOLID BLOCK) ── */}
      <header className="bg-slate-900 text-white px-6 pt-10 pb-10 border-b-4 border-blue-700">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-blue-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Tài khoản: {user.role}</p>
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-none">
              Xin chào,<br />
              <span className="text-white mt-2 block">{user.name}</span>
            </h1>
          </div>
          <LogoutButton />
        </div>
        <div className="mt-6 flex items-center justify-between">
           <LiveClock />
           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Kho Pro Mobile v2.5</p>
        </div>
      </header>

      {/* ── QUICK STATS (SOLID CARDS) ── */}
      <div className="px-6 -mt-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-lg flex flex-col justify-between h-28">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Mặt hàng</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-slate-900 leading-none">{productsCount}</span>
              <Package size={24} className="text-blue-700 mb-1" />
            </div>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-lg flex flex-col justify-between h-28">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Tổng tồn</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-slate-900 leading-none">{totalStock._sum.stock || 0}</span>
              <TrendingUp size={24} className="text-emerald-600 mb-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8 mb-8">
        <ExportCSV data={recentTransactions} />
      </div>

      {/* ── RECENT TRANSACTIONS (HIGH CONTRAST) ── */}
      <div className="px-6 space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[11px] font-black text-slate-950 uppercase tracking-widest whitespace-nowrap">Lịch sử giao dịch</h2>
          <div className="h-[2px] flex-1 bg-slate-200" />
        </div>

        {recentTransactions.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
            <Package size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-xs font-bold text-slate-400 uppercase">Trống</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(recentTransactions as any[]).map((tx) => {
              const isIn = tx.type === 'IN'
              return (
                <div key={tx.id} className="bg-white border-2 border-slate-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    {/* Status Box */}
                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center border-2 ${isIn ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                      {isIn ? <ArrowDownLeft size={18} strokeWidth={4} /> : <ArrowUpRight size={18} strokeWidth={4} />}
                      <span className="text-[7px] font-black uppercase">{isIn ? 'Nhập' : 'Xuất'}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-950 truncate leading-tight uppercase">{tx.product.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] text-slate-500 font-bold">
                          {new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[9px] text-blue-600 font-black truncate">{tx.user?.name || 'Hệ thống'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-xl font-black ${isIn ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isIn ? '+' : '-'}{tx.quantity}
                      </p>
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{tx.product.unit}</p>
                    </div>
                  </div>

                  {/* NOTE SECTION */}
                  {tx.note && (
                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-start gap-2">
                       <FileText size={12} className="text-slate-400 flex-shrink-0 mt-0.5" />
                       <div className="bg-slate-50 p-2 rounded-lg flex-1">
                          <p className="text-[10px] text-slate-600 font-bold leading-relaxed">{tx.note}</p>
                       </div>
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