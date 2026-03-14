import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Package, ArrowUpRight, ArrowDownLeft, TrendingUp, UserCircle } from 'lucide-react'
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
    take: 15,
    include: { 
      product: true,
      // @ts-ignore
      user: true 
    }
  })

  return (
    <div className="flex-1 w-full px-6 pt-12 pb-12">
      
      {/* ── HEADER & GREETING ── */}
      <header className="mb-10 text-center relative">
        <div className="inline-block mb-3 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Hệ thống quản lý kho PRO</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight leading-tight">
          Xin chào, <br />
          <span className="text-gradient">{user.name}</span>
        </h1>
        <div className="flex justify-center mt-3">
          <LiveClock />
        </div>
      </header>

      {/* ── QUICK STATS ── */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="glass-card rounded-[2.5rem] p-6 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package size={40} className="text-blue-400" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mặt hàng</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{productsCount}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">loại</span>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-6 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={40} className="text-emerald-400" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng tồn</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{totalStock._sum.stock || 0}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">đv</span>
          </div>
        </div>
      </div>

      {/* ── ADMIN ACTIONS ── */}
      <div className="flex gap-3 mb-10">
        <ExportCSV data={recentTransactions} />
        <LogoutButton />
      </div>

      {/* ── RECENT TRANSACTIONS ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Lịch sử giao dịch</h2>
          <div className="h-[1px] flex-1 bg-white/5 mx-4" />
          <span className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">Mới nhất</span>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="glass-card rounded-[2rem] p-12 text-center border-dashed border-white/10 opacity-60">
            <Package size={32} className="mx-auto mb-3 text-slate-500" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chưa có giao dịch</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(recentTransactions as any[]).map((tx) => {
              const isIn = tx.type === 'IN'
              return (
                <div key={tx.id} className="glass-card rounded-3xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                  {/* Icon with light glow */}
                  <div className={`p-3 rounded-2xl ${isIn ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {isIn ? <ArrowDownLeft size={20} strokeWidth={3} /> : <ArrowUpRight size={20} strokeWidth={3} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate leading-tight">{tx.product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-black uppercase px-2 rounded-md ${isIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {isIn ? 'Nhập' : 'Xuất'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-blue-400/60 font-black truncate">{tx.user?.name || 'System'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-black ${isIn ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIn ? '+' : '-'}{tx.quantity}
                    </p>
                    <p className="text-[9px] text-slate-500 font-black uppercase">{tx.product.unit}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}