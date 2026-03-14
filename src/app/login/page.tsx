'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth-actions'
import Link from 'next/link'
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@wms.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await login(email, password)
    if (res.success) {
      router.push('/')
      router.refresh()
    } else {
      setError(res.error || 'Đăng nhập thất bại.')
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center px-8 relative overflow-hidden">
      
      {/* ── BACKGROUND ACCENTS ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10">
        
        {/* ── LOGO & HEADER ── */}
        <div className="text-center mb-10 animate-float">
          <div className="inline-flex p-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] shadow-2xl shadow-blue-900/40 mb-6">
            <ShieldCheck size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Kho Pro Mobile</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Hệ thống Cloud Professional</p>
        </div>

        {/* ── LOGIN FORM ── */}
        <div className="glass-card rounded-[3rem] p-8 border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Email truy cập</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  required
                  type="email"
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Mật khẩu bảo mật</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  required
                  autoFocus
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full py-4 bg-blue-600 text-white rounded-[1.8rem] font-black text-xs shadow-2xl shadow-blue-900/40 hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              {loading ? 'Đang xác thực...' : (
                <>
                   Vào Hệ Thống
                   <ArrowRight size={16} strokeWidth={3} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              Bạn chưa có tài khoản?
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 mt-2 text-xs font-black text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <UserPlus size={14} strokeWidth={3} />
              Gửi yêu cầu gia nhập
            </Link>
        </div>

      </div>

      {/* ── VERSION CAPTION ── */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">Professional Edition v2.5</p>
      </div>

    </div>
  )
}
