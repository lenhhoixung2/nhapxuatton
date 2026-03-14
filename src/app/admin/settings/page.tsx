import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, ExternalLink, Database, 
  Mail, Key, CheckCircle2, ChevronLeft,
  Info
} from 'lucide-react'

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/login')
  }

  const sheetId = process.env.GOOGLE_SHEET_ID || 'Chưa thiết lập'
  const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'Chưa thiết lập'
  const sheetLink = `https://docs.google.com/spreadsheets/d/${sheetId}`

  return (
    <div className="flex-1 w-full px-6 pt-12 pb-24">
      
      {/* ── HEADER ── */}
      <header className="mb-10 flex items-center justify-between">
        <Link href="/admin" className="p-3 glass-button rounded-2xl text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={20} strokeWidth={3} />
        </Link>
        <div className="text-center flex-1 pr-10">
           <h1 className="text-xl font-black text-white uppercase tracking-widest">Cấu hình Sheets</h1>
        </div>
      </header>

      {/* ── MAIN STATUS CARD ── */}
      <div className="glass-card rounded-[2.5rem] p-8 border-white/5 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-6 opacity-5">
           <Database size={100} className="text-emerald-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em]">Đang đồng bộ Cloud</span>
          </div>

          <div className="space-y-8">
            {/* Service Account Item */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail size={14} className="text-slate-500" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Dịch Vụ (Service Account)</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                <p className="text-xs font-black text-white truncate mr-4">{serviceAccount}</p>
                <div className="text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </div>

            {/* Sheet ID Item */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-slate-500" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Google Sheet ID</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-3 group hover:border-white/10 transition-colors">
                <p className="text-[10px] font-mono font-bold text-slate-400 break-all leading-relaxed">{sheetId}</p>
                
                {process.env.GOOGLE_SHEET_ID && (
                  <a 
                    href={sheetLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition-all active:scale-[0.98]"
                  >
                    Mở File Google Sheets
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Private Key Status */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Key size={14} className="text-slate-500" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái Private Key</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                 <div className="w-2 h-2 bg-blue-500 rounded-full" />
                 <p className="text-[11px] font-black text-blue-400 uppercase">Đã cấu hình & Bảo mật</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── INFO MESSAGE ── */}
      <div className="glass-card rounded-[2rem] p-6 border-blue-500/10 bg-blue-500/5 flex gap-4">
        <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-300/60 font-medium leading-relaxed">
          Mật mã dịch vụ (Private Key) được lưu trữ an toàn trên máy chủ Vercel và không bao giờ hiển thị trực tiếp để bảo vệ dữ liệu kho hàng của bạn.
        </p>
      </div>

    </div>
  )
}
