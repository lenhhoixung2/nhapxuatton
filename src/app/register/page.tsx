'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/lib/auth-actions'
import Link from 'next/link'
import { UserPlus, Mail, Phone, User, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await register(formData)
    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.error || 'Xảy ra lỗi khi gửi.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center px-8 bg-slate-50 min-h-screen">
        <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
            <CheckCircle2 size={32} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Gửi Thành Công!</h1>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed mb-8 uppercase tracking-widest px-4">
            Quản trị viên sẽ sớm liên hệ <br /> 
            để phê duyệt tài khoản của bạn.
          </p>
          <Link 
            href="/login"
            className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center px-8 pt-12 pb-12 bg-slate-50 min-h-screen">
      
      <div className="w-full max-w-sm">
        
        {/* ── HEADER ── */}
        <div className="mb-10 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Đăng ký</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Yêu cầu gia nhập kho PRO</p>
          </div>
        </div>

        {/* ── FORM ── */}
        <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tên của bạn</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-300" size={18} />
                <input
                  required
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email liên hệ</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                <input
                  required
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-slate-300" size={18} />
                <input
                  required
                  type="tel"
                  placeholder="09xx xxx xxx"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black animate-shake">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu hệ thống'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[9px] text-slate-300 font-black uppercase tracking-[0.5em]">Bảo mật bởi Kho Pro Cloud</p>

      </div>
    </div>
  )
}
