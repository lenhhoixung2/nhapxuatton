'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Nhập', href: '/inbound', icon: ArrowDownLeft },
  { name: 'Sản Phẩm', href: '/products', icon: Package },
  { name: 'Xuất', href: '/outbound', icon: ArrowUpRight },
  { name: 'CMS', href: '/admin', icon: ShieldCheck },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-6 px-4 pointer-events-none">
      <nav className="flex items-center gap-1 bg-white/80 backdrop-blur-2xl border border-white/20 p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 rounded-[2rem] active:scale-90",
                isActive ? "text-blue-600 bg-blue-50/50 shadow-inner" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-blue-100/50 rounded-[1.5rem] z-0 animate-in fade-in zoom-in duration-300" />
              )}
              <Icon size={isActive ? 24 : 20} className={clsx("relative z-10 transition-transform", isActive && "scale-110")} />
              <span className={clsx(
                "relative z-10 text-[9px] font-bold uppercase tracking-tighter mt-1 transition-all",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
