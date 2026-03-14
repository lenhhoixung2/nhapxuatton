'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout, approveUser } from '@/lib/auth-actions'
import { deleteUser, updateUserPermissions, updateUserRole } from './actions'
import { 
  Trash2, LogOut, Mail, Phone, 
  BadgeCheck, AlertCircle, UserCog, Shield, 
  ChevronRight, Lock, ShieldCheck
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
  ADMIN: 'Chủ kho',
  MANAGER: 'Quản lý',
  VIEWER: 'Nhân viên',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'text-white bg-blue-600 border-blue-600',
  MANAGER: 'text-blue-600 bg-blue-50 border-blue-100',
  VIEWER: 'text-slate-500 bg-slate-50 border-slate-100',
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
      alert('Nhập mật khẩu cấp cho user.')
      return
    }
    setError('')
    const res = await approveUser(id, tempPassword)
    if (res.success) {
      setSuccess('Đã duyệt tài khoản!')
      setApprovingId(null)
      setTempPassword('')
      router.refresh()
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(res.error || 'Lỗi duyệt.')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa "${name}"?`)) return
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
    <div className="flex-1 w-full px-5 pt-10 pb-24 bg-slate-50/30">
      
      {/* ── HEADER ── */}
      <header className="mb-8 flex items-center justify-between">
        <div>
           <div className="inline-block mb-1 px-2.5 py-0.5 bg-slate-900 text-white rounded-lg">
             <span className="text-[10px] font-black uppercase tracking-widest">Admin Hub</span>
           </div>
           <h1 className="text-3xl font-black tracking-tight text-slate-900">Nhân Sự</h1>
        </div>
        <button
          onClick={handleLogout}
          className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* ── ALERTS ── */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[11px] font-black flex items-center gap-3 animate-shake">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[11px] font-black flex items-center gap-3">
          <BadgeCheck size={18} /> {success}
        </div>
      )}

      {/* ── PENDING REQUESTS ── */}
      {pendingUsers.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Chờ Duyệt ({pendingUsers.length})</h2>
          </div>
          
          <div className="space-y-3">
            {pendingUsers.map(u => (
              <div key={u.id} className="bg-white border-2 border-amber-100 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-none">{u.name}</h3>
                    <div className="flex flex-col gap-1.5 mt-3">
                      <span className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                        <Mail size={12} /> {u.email}
                      </span>
                      <span className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                        <Phone size={12} /> {u.phone || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(u.id, u.name)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>

                {approvingId === u.id ? (
                  <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-slide-up">
                    <p className="text-[9px] font-black text-blue-600 uppercase mb-3">Cấp mật khẩu mới:</p>
                    <div className="flex flex-col gap-2">
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Mật khẩu (vd: 123456)" 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setApprovingId(null)} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400">Hủy</button>
                        <button onClick={() => handleApprove(u.id)} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-100">Duyệt Ngay</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setApprovingId(u.id)}
                    className="w-full mt-5 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-widest"
                  >
                    Phê Duyệt Thành Viên
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── OFFICIAL STAFF ── */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đội Ngũ ({approvedUsers.length})</h2>
        </div>

        <div className="space-y-4">
          {approvedUsers.map((u) => (
            <div key={u.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm leading-none">{u.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">{u.email}</p>
                  </div>
                </div>

                <select 
                  value={u.role}
                  onChange={(e) => handleChangeRole(u.id, e.target.value)}
                  className={clsx(
                    "text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors",
                    ROLE_COLORS[u.role] || ROLE_COLORS.VIEWER
                  )}
                >
                  {Object.entries(ROLE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 grid grid-cols-2 gap-2 bg-slate-50/50">
                 {[
                   { key: 'canInbound', label: 'Nhập kho' },
                   { key: 'canOutbound', label: 'Xuất kho' },
                   { key: 'canManageProducts', label: 'Sửa hàng' },
                   { key: 'canDeleteProducts', label: 'Xóa hàng' },
                   { key: 'canManageUsers', label: 'Quản trị' },
                 ].map((p) => {
                   const isChecked = (u as any)[p.key]
                   return (
                     <label 
                       key={p.key} 
                       className={clsx(
                         "flex items-center gap-2.5 p-3 rounded-xl text-[9px] font-black uppercase tracking-tighter cursor-pointer transition-all border",
                         isChecked ? "bg-white border-blue-100 text-blue-600 shadow-sm" : "bg-transparent border-transparent opacity-40 text-slate-400"
                       )}
                     >
                       <input 
                         type="checkbox"
                         className="w-3.5 h-3.5 accent-blue-600 rounded"
                         checked={isChecked}
                         onChange={(e) => handleTogglePerm(u.id, p.key, e.target.checked)}
                         disabled={(u.role === 'ADMIN' && p.key === 'canManageUsers') || u.id === currentUserId}
                       />
                       <span>{p.label}</span>
                     </label>
                   )
                 })}
                 
                 {u.id !== currentUserId && (
                    <button 
                      onClick={() => handleDelete(u.id, u.name)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl text-[9px] font-black uppercase text-rose-300 border border-transparent hover:text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={14} /> Gỡ Bỏ
                    </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 text-center pb-6">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Kho Pro Solution v2.5</p>
      </footer>
    </div>
  )
}
