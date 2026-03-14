import { getCurrentUser, ensureDefaultAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, Database, FileText, Settings, 
  ShieldAlert, ChevronRight, LayoutDashboard,
  ExternalLink, CheckCircle2
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
      desc: 'Duyệt thành viên & Phân quyền chi tiết',
      href: '/users',
      icon: Users,
      color: 'text-violet-400',
      bgColor: 'bg-violet-400/10'
    },
    {
      title: 'Danh Mục Sản Phẩm',
      desc: 'Quản lý kho hàng & Mã vạch',
      href: '/products',
      icon: Database,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Cấu Hình Google Sheets',
      desc: 'Xem thông tin đồng bộ dữ liệu Cloud',
      href: '/admin/settings',
      icon: FileText,
      color: 'text-emerald-400',
       bgColor: 'bg-emerald-400/10'
    },
    // {
    //   title: 'Cài Đặt Hệ Thống',
    //   desc: 'Bảo trì & Thiết lập chung',
    //   href: '#',
    //   icon: Settings,
    //   color: 'text-slate-400',
    //   bgColor: 'bg-slate-400/10'
    // }
  ]

  return (
    <div className="flex-1 w-full px-6 pt-12 pb-24">
      
      {/* ── HEADER ── */}
      <header className="mb-10 text-center">
        <div className="inline-block mb-3 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Trung tâm quản trị</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight leading-tight text-white px-4">
          Hệ Thống <br />
          <span className="text-gradient">Power CMS</span>
        </h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-4">Phiên bản 2.5 Professional</p>
      </header>

      {/* ── STATUS CARDS ── */}
      <div className="glass-card rounded-[2rem] p-6 border-white/5 mb-10 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
             <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-white">Trạng thái hệ thống</p>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Hoạt động bình thường</p>
          </div>
        </div>
        
        {/* Decorative divider */}
        <div className="my-6 h-[1px] bg-white/5" />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Thời gian mkt</p>
             <p className="text-xs font-black text-white mt-1">Bản Pro Cloud</p>
          </div>
          <div>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Bảo mật</p>
             <p className="text-xs font-black text-white mt-1">Mã hóa 2 lớp</p>
          </div>
        </div>
      </div>

      {/* ── MENU ITEMS ── */}
      <div className="space-y-4">
        {managementItems.map((item) => {
          const Icon = item.icon
          return (
            <Link 
              key={item.href}
              href={item.href}
              className="glass-card rounded-3xl p-5 flex items-center gap-5 hover:border-white/10 active:scale-[0.98] transition-all group"
            >
              <div className={`w-14 h-14 ${item.bgColor} ${item.color} rounded-2xl flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform`}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-white leading-tight group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight">{item.desc}</p>
              </div>

              <ChevronRight size={20} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
            </Link>
          )
        })}
      </div>

      {/* ── INFO BOX ── */}
      <div className="mt-12 p-6 glass-card bg-rose-500/5 border-rose-500/10 rounded-[2rem] flex items-start gap-4">
        <ShieldAlert size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-black text-rose-300 uppercase tracking-widest">Cảnh báo bảo mật</h4>
          <p className="text-[10px] text-rose-300/60 font-medium leading-relaxed mt-1">
            Mọi hành động trong Power CMS đều được ghi nhật ký hệ thống. Hãy cẩn trọng khi thay đổi quyền hạn nhân viên.
          </p>
        </div>
      </div>

    </div>
  )
}
