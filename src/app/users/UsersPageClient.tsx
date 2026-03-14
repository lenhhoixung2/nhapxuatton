'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout, approveUser } from '@/lib/auth-actions'
import { deleteUser, updateUserPermissions, updateUserRole } from './actions'
import { 
  Trash2, LogOut, Mail, Phone, 
  BadgeCheck, AlertCircle, UserCog, Shield, 
  ChevronRight, User
} from 'lucide-react'
import { clsx } from 'clsx'

interface UserData {
  id: string
  name: string
  email: string
  phone?: string | null
  role: string
  status: string
  canInbound: boolean
  canOutbound: boolean
  canManageProducts: boolean
  canDeleteProducts: boolean
  canManageUsers: boolean
  createdAt: Date
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Chủ kho (Admin)',
  MANAGER: 'Quản lý',
  VIEWER: 'Nhân viên',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  MANAGER: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  VIEWER: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
}

export default function UsersPageClient({ users, currentUserId }: { users: UserData[]; currentUserId: string }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [tempPassword, setTempPassword] = useState('')

  const approvedUsers = users.filter(u => u.status === 'APPROVED')
  const pendingUsers = users.filter(u => u.status === 'PENDING')

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const handleApprove = async (id: string) => {
    if (!tempPassword) {
      alert('Vui lòng nhập mật khẩu để cấp cho người dùng.')
      return
    }
    setError('')
    const res = await approveUser(id, tempPassword)
    if (res.success) {
      setSuccess('Đã duyệt tài khoản thành công!')
      setApprovingId(null)
      setTempPassword('')
      router.refresh()
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(res.error || 'Lỗi khi duyệt.')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa tài khoản "${name}"?`)) return
    try {
      await deleteUser(id)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleTogglePerm = async (id: string, key: string, val: boolean) => {
    try {
      await updateUserPermissions(id, { [key]: val })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleChangeRole = async (id: string, role: string) => {
    try {
      await updateUserRole(id, role)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex-1 w-full px-6 pt-12 pb-24">
      {/* ── HEADER ── */}
      <header className="mb-10 flex items-end justify-between">
        <div>
          <div className="inline-block mb-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">CMS Quản lý</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-tight text-white">
            Nhân sự <br />
            <span className="text-gradient">& Phân quyền</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="p-4 glass-card text-rose-400 rounded-2xl hover:text-rose-300 active:scale-95 transition-all shadow-lg shadow-rose-900/10 border-rose-500/10"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* ── ALERTS ── */}
      {error && (
        <div className="mb-6 p-4 glass-card bg-rose-500/10 text-rose-400 rounded-2xl text-[11px] font-bold border-rose-500/20 flex items-center gap-3 animate-shake">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 glass-card bg-emerald-500/10 text-emerald-400 rounded-2xl text-[11px] font-bold border-emerald-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <BadgeCheck size={18} /> {success}
        </div>
      )}

      {/* ── PENDING REQUESTS ── */}
      {pendingUsers.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Yêu cầu chờ duyệt ({pendingUsers.length})</h2>
          </div>
          
          <div className="space-y-4">
            {pendingUsers.map(u => (
              <div key={u.id} className="glass-card rounded-[2.5rem] p-6 border-amber-500/20 relative overflow-hidden group">
                {/* Decorative icon background */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <UserCog size={80} className="text-amber-500" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight">{u.name}</h3>
                      <div className="flex flex-col gap-2 mt-3">
                        <span className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <Mail size={12} className="text-blue-500/50" /> {u.email}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <Phone size={12} className="text-emerald-500/50" /> {u.phone || 'Chưa có SĐT'}
                        </span>
                      </div>
                    </div>
                    {approvingId !== u.id && (
                      <button 
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-3 glass-button text-slate-500 hover:text-rose-400 rounded-2xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {approvingId === u.id ? (
                    <div className="mt-6 p-5 glass-card bg-white/[0.03] rounded-3xl border-dashed border-white/10 animate-in zoom-in-95 duration-200">
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-4">Mật khẩu cấp mới:</p>
                      <div className="flex flex-col gap-3">
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="Nhập MK (ví dụ: 123456)" 
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white outline-none focus:border-blue-500/50 transition-all placeholder-slate-700"
                          value={tempPassword}
                          onChange={(e) => setTempPassword(e.target.value)}
                        />
                        <div className="flex gap-3 mt-1">
                          <button 
                            onClick={() => setApprovingId(null)}
                            className="flex-1 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                          >
                            Hủy
                          </button>
                          <button 
                            onClick={() => handleApprove(u.id)}
                            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-blue-900/30 active:scale-95 transition-all uppercase tracking-widest"
                          >
                            Duyệt Ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setApprovingId(u.id)}
                      className="w-full mt-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black text-[11px] shadow-2xl shadow-blue-900/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                      <BadgeCheck size={18} strokeWidth={3} className="text-blue-200" />
                      Phê Duyệt Tài Khoản
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── OFFICIAL STAFF ── */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h2 className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Đội ngũ vận hành ({approvedUsers.length})</h2>
        </div>

        <div className="space-y-4">
          {approvedUsers.map((u) => (
            <div key={u.id} className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden group">
              {/* Card Title Area */}
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl flex items-center justify-center text-gradient font-black text-2xl border border-white/5 shadow-inner">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-white text-base leading-none">{u.name}</p>
                      {u.id === currentUserId && (
                        <span className="text-[8px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-black border border-blue-500/20 uppercase tracking-widest">Tôi</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={u.role}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                    className={clsx(
                      "text-[9px] font-black uppercase px-3 py-2 rounded-xl border appearance-none cursor-pointer transition-all focus:ring-0 outline-none",
                      ROLE_COLORS[u.role] || ROLE_COLORS.VIEWER
                    )}
                  >
                    {Object.entries(ROLE_LABELS).map(([val, label]) => (
                      <option key={val} value={val} className="bg-slate-900">{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="p-6 grid grid-cols-2 gap-3 bg-white/[0.01]">
                 {[
                   { key: 'canInbound', label: 'Nhập kho', color: 'text-emerald-400' },
                   { key: 'canOutbound', label: 'Xuất kho', color: 'text-rose-400' },
                   { key: 'canManageProducts', label: 'Sửa hàng', color: 'text-blue-400' },
                   { key: 'canDeleteProducts', label: 'Xóa hàng', color: 'text-amber-400' },
                   { key: 'canManageUsers', label: 'Duyệt User', color: 'text-violet-400' },
                 ].map((p) => {
                   const isChecked = (u as any)[p.key]
                   return (
                     <label 
                       key={p.key} 
                       className={clsx(
                         "flex items-center gap-3 p-3 pt-4 pb-4 rounded-2xl text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all border group/label",
                         isChecked ? "glass-card border-white/10 bg-white/5" : "bg-transparent border-white/5 opacity-30 grayscale"
                       )}
                     >
                       <div className={clsx(
                         "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                         isChecked ? "bg-white text-slate-900 border-white" : "bg-transparent border-slate-700 text-transparent"
                       )}>
                         <BadgeCheck size={12} strokeWidth={3} />
                       </div>
                       <input 
                         type="checkbox"
                         className="hidden"
                         checked={isChecked}
                         onChange={(e) => handleTogglePerm(u.id, p.key, e.target.checked)}
                         disabled={(u.role === 'ADMIN' && p.key === 'canManageUsers') || u.id === currentUserId}
                       />
                       <span className={clsx(isChecked ? "text-white" : "text-slate-500")}>{p.label}</span>
                     </label>
                   )
                 })}
                 
                 {/* Delete User for Admin */}
                 {u.id !== currentUserId && (
                    <button 
                      onClick={() => handleDelete(u.id, u.name)}
                      className="flex items-center gap-3 p-3 pt-4 pb-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-rose-500/10 bg-rose-500/5 text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95"
                    >
                      <Trash2 size={16} /> Gỡ Bỏ
                    </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CAPTION ── */}
      <footer className="mt-16 text-center">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] leading-relaxed">
          Phân quyền hệ thống Kho PRO <br />
          v2.5 Professional Cloud
        </p>
      </footer>
    </div>
  )
}
