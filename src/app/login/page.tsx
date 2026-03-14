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
      setError(res.error || 'Xác thực không chính xác.')
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center px-8 bg-slate-50 min-h-screen">
      
      <div className="w-full max-w-sm">
        
        {/* ── LOGO ── */}
        <div className="text-center mb-10">
          <div className="inline-flex p-5 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl shadow-slate-300 mb-6">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Kho Pro Mobile</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Hệ thống v2.5 Professional</p>
        </div>

        {/* ── FORM ── */}
        <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email truy cập</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                <input
                  required
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
                <input
                  required
                  autoFocus
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {loading ? 'Đang kiểm tra...' : (
                <>
                   Vào Hệ Thống
                   <ArrowRight size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nếu chưa có tài khoản?</p>
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 mt-2 text-xs font-black text-blue-600 hover:underline"
            >
              <UserPlus size={16} strokeWidth={3} />
              Gửi yêu cầu gia nhập
            </Link>
        </div>

      </div>
    </div>
  )
}
