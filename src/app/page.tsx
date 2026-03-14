import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Package, ArrowUpRight, ArrowDownLeft, TrendingUp, FileText, UserCircle } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'
import { LiveClock } from '@/components/LiveClock'
import { ExportCSV } from '@/components/ExportCSV'
import Link from 'next/link'

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
    <div className="min-h-screen bg-[#F0F4FF] pb-24">
      
      {/* ── HEADER ── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#1A56DB] to-[#1E3A8A] text-white pt-10 pb-10 px-6 rounded-b-[2.5rem] shadow-2xl shadow-blue-900/30 mb-6">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/5 rounded-full" />
        <div className="absolute top-10 -right-4 w-24 h-24 bg-white/10 rounded-full" />

        <div className="relative flex justify-between items-start">
          {/* Left: greeting + clock */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserCircle size={16} className="text-blue-300" />
              <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">{user.role}</span>
            </div>
            <h1 className="text-2xl font-black leading-tight tracking-tight">
              Xin chào,<br />
              <span className="text-yellow-300">{user.name}</span>!
            </h1>
            <p className="text-blue-300 text-[11px] font-semibold uppercase tracking-widest mt-1">
              Hệ thống quản lý kho PRO
            </p>
            <LiveClock />
          </div>

          {/* Right: logout & export */}
          <div className="flex flex-col items-end gap-3 mt-1 min-w-[100px]">
            <LogoutButton />
            
            {/* NÚT XUẤT CSV (Local) */}
            <ExportCSV data={recentTransactions} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mt-6 relative">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-400/30 rounded-lg">
                <Package size={14} className="text-blue-100" />
              </div>
              <span className="text-[11px] text-blue-200 font-bold uppercase tracking-widest">Mặt hàng</span>
            </div>
            <p className="text-3xl font-black leading-none">{productsCount}</p>
            <p className="text-[10px] text-blue-300 mt-1 font-medium">sản phẩm</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-400/30 rounded-lg">
                <TrendingUp size={14} className="text-emerald-200" />
              </div>
              <span className="text-[11px] text-blue-200 font-bold uppercase tracking-widest">Tổng tồn</span>
            </div>
            <p className="text-3xl font-black leading-none">{totalStock._sum.stock || 0}</p>
            <p className="text-[10px] text-blue-300 mt-1 font-medium">đơn vị</p>
          </div>
        </div>
      </header>

      {/* ── TRANSACTION HISTORY ── */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-base font-black text-gray-800 uppercase tracking-tighter">Lịch sử giao dịch</h2>
          <span className="text-[10px] font-bold text-[#1A56DB] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">Mới nhất</span>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border-2 border-dashed border-gray-200 text-center shadow-sm">
            <Package size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chưa có giao dịch phát sinh</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {(recentTransactions as any[]).map((tx) => {
              const isIn = tx.type === 'IN'
              return (
                <div key={tx.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
                  {/* Icon */}
                  <div className={`mt-0.5 flex-shrink-0 p-2.5 rounded-xl ${isIn ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {isIn ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 leading-tight truncate">{tx.product.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          {new Date(tx.createdAt).toLocaleString('vi-VN', {
                            timeZone: 'Asia/Ho_Chi_Minh',
                            hour: '2-digit', minute: '2-digit',
                            day: '2-digit', month: '2-digit', year: 'numeric'
                          })}
                          {' · '}<span className="text-blue-500">{tx.user?.name || 'Hệ thống'}</span>
                        </p>
                        {tx.note && (
                          <div className="flex items-center gap-1 mt-1">
                            <FileText size={10} className="text-gray-400 flex-shrink-0" />
                            <p className="text-[10px] text-gray-500 italic truncate">{tx.note}</p>
                          </div>
                        )}
                      </div>
                      {/* Amount */}
                      <div className="text-right flex-shrink-0">
                        <p className={`text-base font-black leading-none ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isIn ? '+' : '-'}{tx.quantity}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">{tx.product.unit}</p>
                      </div>
                    </div>
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
