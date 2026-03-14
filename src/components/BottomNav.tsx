'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Nhập', href: '/inbound', icon: ArrowDownLeft },
  { name: 'Hàng', href: '/products', icon: Package },
  { name: 'Xuất', href: '/outbound', icon: ArrowUpRight },
  { name: 'Quản trị', href: '/admin', icon: ShieldCheck },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-8 px-5 pointer-events-none">
      <nav className="flex items-center justify-between w-full max-w-[420px] bg-white border border-slate-200 p-1.5 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex flex-col items-center justify-center flex-1 h-14 transition-all duration-300 rounded-[2rem] active:scale-95 group",
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-blue-50 rounded-[1.8rem] z-0 animate-in fade-in zoom-in-95 duration-300 border border-blue-100/50" />
              )}
              
              <div className={clsx("relative z-10 transition-transform duration-300", isActive && "-translate-y-0.5")}>
                 <Icon 
                   size={isActive ? 22 : 20} 
                   strokeWidth={isActive ? 3 : 2.5}
                   className="transition-all" 
                 />
              </div>

              <span className={clsx(
                "relative z-10 text-[8px] font-black uppercase tracking-widest mt-1 transition-all duration-300",
                isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 translate-y-1"
              )}>
                {item.name}
              </span>
              
              {/* Solid indicator dot */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
