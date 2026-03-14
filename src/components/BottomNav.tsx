'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ArrowUpRight, ArrowDownLeft, ShieldCheck, Settings } from 'lucide-react'
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
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-8 px-6 pointer-events-none">
      <nav className="flex items-center gap-1 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl shadow-black/50 pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex flex-col items-center justify-center w-16 h-14 transition-all duration-500 rounded-[2rem] active:scale-90 group",
                isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-[1.8rem] z-0 animate-in fade-in zoom-in duration-500 border border-blue-500/10" />
              )}
              <Icon 
                size={isActive ? 22 : 20} 
                strokeWidth={isActive ? 3 : 2}
                className={clsx("relative z-10 transition-all duration-500", isActive && "scale-110 -translate-y-1")} 
              />
              <span className={clsx(
                "relative z-10 text-[8px] font-black uppercase tracking-[0.1em] mt-1 transition-all duration-500",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}>
                {item.name}
              </span>
              
              {/* Dot indicator */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
