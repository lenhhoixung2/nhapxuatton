import { getCurrentUser, ensureDefaultAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, Database, FileText, Settings, 
  ShieldAlert, ChevronRight, LayoutDashboard,
  ExternalLink, CheckCircle2, ShieldCheck
} from 'lucide-react'

export default async function AdminPage() {
  await ensureDefaultAdmin()
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/login')
  }

  const managementItems = [
    {
      title: 'Quản Lý Nhân Sự',
      desc: 'Duyệt thành viên & Phân quyền',
      href: '/users',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Danh Mục Sản Phẩm',
      desc: 'Kho hàng & Mã vạch',
      href: '/products',
      icon: Database,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Cấu Hình Google Sheets',
      desc: 'Thông tin hệ thống & Sheets Cloud',
      href: '/admin/settings',
      icon: FileText,
      color: 'text-emerald-600',
       bgColor: 'bg-emerald-50'
    }
  ]

  return (
    <div className="flex-1 w-full px-5 pt-10 pb-24 bg-slate-50/30">
      
      {/* ── HEADER ── */}
      <header className="mb-10 text-center">
        <div className="inline-flex p-4 bg-slate-900 text-white rounded-[2rem] shadow-xl shadow-slate-200 mb-6">
           <ShieldCheck size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 px-4">
          Hệ Thống <br />
          <span className="text-blue-600">Power CMS</span>
        </h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-3">Phiên bản 2.5 Pro Cloud</p>
      </header>

      {/* ── STATUS CARD ── */}
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
             <CheckCircle2 size={24} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 uppercase">Trạng thái hệ thống</p>
            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Online & Sẵn sàng</p>
          </div>
        </div>
        
        <div className="my-5 h-[1.5px] bg-slate-50" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50/50 rounded-2xl">
             <p className="text-[8px] font-bold text-slate-400 uppercase">Bảo mật</p>
             <p className="text-[10px] font-black text-slate-900 mt-1">Cấp cao</p>
          </div>
          <div className="p-3 bg-slate-50/50 rounded-2xl">
             <p className="text-[8px] font-bold text-slate-400 uppercase">Lưu trữ</p>
             <p className="text-[10px] font-black text-slate-900 mt-1">Cloud Sync</p>
          </div>
        </div>
      </div>

      {/* ── MENU ITEMS ── */}
      <div className="space-y-3">
        {managementItems.map((item) => {
          const Icon = item.icon
          return (
            <Link 
              key={item.href}
              href={item.href}
              className="bg-white border border-slate-100 rounded-[2rem] p-4 flex items-center gap-4 hover:border-blue-200 active:scale-[0.98] transition-all group shadow-sm"
            >
              <div className={`w-12 h-12 ${item.bgColor} ${item.color} rounded-[1.2rem] flex items-center justify-center border border-white transition-transform group-hover:scale-105`}>
                <Icon size={22} strokeWidth={3} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase truncate">{item.desc}</p>
              </div>

              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </Link>
          )
        })}
      </div>

      <div className="mt-10 p-5 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-start gap-3">
        <ShieldAlert size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
        <p className="text-[9px] text-rose-800/60 font-black uppercase leading-relaxed">
          Thận trọng: Mọi thay đổi về phân quyền sẽ có hiệu lực ngay lập tức đối với nhân viên.
        </p>
      </div>

    </div>
  )
}
