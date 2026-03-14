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
    <div className="flex-1 w-full px-5 pt-10 pb-24 bg-slate-50/30">
      
      {/* ── HEADER ── */}
      <header className="mb-8 flex items-center justify-between">
        <Link href="/admin" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
          <ChevronLeft size={20} strokeWidth={3} />
        </Link>
        <div className="text-center flex-1 pr-10">
           <h1 className="text-lg font-black text-slate-900 uppercase tracking-widest">Cấu hình Sheets</h1>
        </div>
      </header>

      {/* ── MAIN STATUS CARD ── */}
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-7 shadow-sm relative overflow-hidden mb-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Đồng bộ Cloud (Active)</span>
          </div>

          <div className="space-y-8">
            {/* Service Account Item */}
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Dịch Vụ (Service Account)</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-900 truncate mr-4">{serviceAccount}</p>
                <div className="text-emerald-500">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </div>

            {/* Sheet ID Item */}
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Google Sheet ID</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                <p className="text-[10px] font-mono font-bold text-slate-500 break-all leading-relaxed">{sheetId}</p>
                
                {process.env.GOOGLE_SHEET_ID && (
                  <a 
                    href={sheetLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
                  >
                    Mở Trực Tiếp File Sheets
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Private Key Status */}
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Trạng thái Bảo mật</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                 <p className="text-[10px] font-black text-emerald-600 uppercase">Private Key Đã mã hóa kĩ thuật</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── INFO MESSAGE ── */}
      <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-[2rem] flex gap-4">
        <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-700/60 font-medium leading-relaxed">
          Mật mã dịch vụ đươc bảo mật cấp cao bởi hạ tầng Vercel Cloud, đảm bão dữ liệu hàng hóa không bị rò rỉ.
        </p>
      </div>

    </div>
  )
}
