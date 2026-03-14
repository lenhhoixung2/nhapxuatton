'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/lib/auth-actions'
import Link from 'next/link'
import { UserPlus, Mail, Phone, User, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'

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
      setError(res.error || 'Đã xảy ra lỗi.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center px-10 relative">
        <div className="glass-card p-10 rounded-[3rem] border-white/5 text-center shadow-2xl relative z-10">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/20 border border-emerald-500/20">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Thành Công!</h1>
          <p className="text-xs text-slate-400 font-bold leading-relaxed mb-8 uppercase tracking-wide">
            Yêu cầu của bạn đã được gửi. <br />
            Quản trị viên sẽ liên hệ <br /> 
            để cung cấp mật khẩu.
          </p>
          <Link 
            href="/login"
            className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-[0.98]"
          >
            Quay lại Đăng nhập
          </Link>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center px-8 pt-12 pb-12 relative overflow-hidden">
      
      {/* ── BACKGROUND ACCENT ── */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10">
        
        {/* ── HEADER ── */}
        <div className="mb-10 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 glass-button rounded-2xl text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Đăng ký mới</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Yêu cầu gia nhập đội ngũ</p>
          </div>
        </div>

        {/* ── REGISTER FORM ── */}
        <div className="glass-card rounded-[3rem] p-8 border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tên của bạn</label>
              <div className="relative group">
                <User className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  required
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder-slate-700"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Email liên hệ</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  required
                  type="email"
                  placeholder="email@example.com"
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder-slate-700"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Số điện thoại</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  required
                  type="tel"
                  placeholder="09xx xxx xxx"
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder-slate-700"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl text-[10px] font-bold border border-rose-500/10 animate-shake">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.8rem] font-black text-xs shadow-2xl shadow-blue-900/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu hệ thống'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Bảo mật tối đa bởi <span className="text-blue-500">Kho Pro Cloud</span>
        </p>

      </div>
    </div>
  )
}
