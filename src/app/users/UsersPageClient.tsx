'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout, approveUser } from '@/lib/auth-actions'
import { deleteUser, updateUserPermissions, updateUserRole } from './actions'
import { 
  UserCheck, Trash2, LogOut, Shield, Mail, Phone, Lock, 
  ChevronRight, BadgeCheck, AlertCircle, UserCog 
} from 'lucide-react'
import { clsx } from 'clsx'

interface User {
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
  ADMIN: 'Chủ kho',
  MANAGER: 'Quản lý',
  VIEWER: 'Nhân viên',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'text-purple-600 bg-purple-50 border-purple-100',
  MANAGER: 'text-blue-600 bg-blue-50 border-blue-100',
  VIEWER: 'text-slate-600 bg-slate-50 border-slate-100',
}

export default function UsersPageClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
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
    <div className="min-h-screen bg-[#F8FAFC] p-4 pb-32">
      {/* ── HEADER ── */}
      <header className="flex items-center justify-between mb-8 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Thành viên</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Quản lý quyền truy cập</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-50 active:scale-95 transition"
        >
          <LogOut size={20} />
        </button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl text-xs font-bold border border-rose-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <BadgeCheck size={18} />
          {success}
        </div>
      )}

      {/* ── PENDING REQUESTS ── */}
      {pendingUsers.length > 0 && (
        <section className="mb-10 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Yêu cầu chờ duyệt ({pendingUsers.length})</h2>
          </div>
          
          <div className="space-y-4">
            {pendingUsers.map(u => (
              <div key={u.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-amber-900/5 border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <UserCog size={80} className="text-amber-500" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{u.name}</h3>
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Mail size={12} className="text-slate-300" /> {u.email}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Phone size={12} className="text-slate-300" /> {u.phone || 'Chưa cung cấp'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {approvingId === u.id ? (
                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 animate-in zoom-in-95 duration-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cấp mật khẩu đăng nhập:</p>
                      <div className="flex flex-col gap-3">
                        <input 
                          autoFocus
                          type="text" 
                          placeholder=" ví dụ: 123456" 
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition"
                          value={tempPassword}
                          onChange={(e) => setTempPassword(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setApprovingId(null)}
                            className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition"
                          >
                            Hủy bỏ
                          </button>
                          <button 
                            onClick={() => handleApprove(u.id)}
                            className="flex-[2] py-3 bg-amber-500 text-white rounded-xl text-sm font-black shadow-lg shadow-amber-200 active:scale-95 transition"
                          >
                            XÁC NHẬN DUYỆT
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setApprovingId(u.id)}
                      className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition flex items-center justify-center gap-2"
                    >
                      <BadgeCheck size={18} className="text-amber-400" />
                      PHÊ DUYỆT NGAY
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── OFFICIAL STAFF ── */}
      <section className="animate-in fade-in duration-700 delay-200">
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Kinh doanh & Vận hành ({approvedUsers.length})</h2>
        </div>

        <div className="space-y-4">
          {approvedUsers.map((u) => (
            <div key={u.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group">
              {/* Header */}
              <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900 leading-tight">{u.name}</p>
                      {u.id === currentUserId && (
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-black border border-blue-100">YOU</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <select 
                    value={u.role}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                    className={clsx(
                      "text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-transparent focus:ring-0 appearance-none cursor-pointer transition-all",
                      ROLE_COLORS[u.role] || ROLE_COLORS.VIEWER
                    )}
                  >
                    {Object.entries(ROLE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                  {u.id !== currentUserId && (
                    <button 
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-2 text-slate-200 hover:text-rose-500 transition ml-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="p-5 grid grid-cols-2 gap-2 bg-slate-50/30">
                 {[
                   { key: 'canInbound', label: 'Nhập kho' },
                   { key: 'canOutbound', label: 'Xuất kho' },
                   { key: 'canManageProducts', label: 'Sửa hàng' },
                   { key: 'canDeleteProducts', label: 'Xóa hàng' },
                   { key: 'canManageUsers', label: 'Duyệt User' },
                 ].map((p) => {
                   const isChecked = (u as any)[p.key]
                   return (
                     <label 
                       key={p.key} 
                       className={clsx(
                         "flex items-center gap-3 p-3 rounded-2xl text-[11px] font-bold cursor-pointer transition-all border shadow-sm active:scale-95",
                         isChecked ? "bg-white border-blue-100 text-blue-700" : "bg-white/50 border-slate-100 text-slate-400 opacity-60"
                       )}
                     >
                       <div className={clsx(
                         "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                         isChecked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-transparent"
                       )}>
                         <BadgeCheck size={12} strokeWidth={3} />
                       </div>
                       <input 
                         type="checkbox"
                         className="hidden"
                         checked={isChecked}
                         onChange={(e) => handleTogglePerm(u.id, p.key, e.target.checked)}
                         disabled={u.role === 'ADMIN' && p.key === 'canManageUsers'}
                       />
                       {p.label}
                     </label>
                   )
                 })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER LEGEND ── */}
      <div className="mt-10 px-6 py-4 bg-slate-950 text-slate-500 rounded-3xl text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed text-center opacity-80">
        Admin có quyền tối thượng. Manager/Viewer bị giới hạn theo tích chọn ở trên.
      </div>
    </div>
  )
}
