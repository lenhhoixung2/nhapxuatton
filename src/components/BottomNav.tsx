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
  { name: 'Quản trị', href: '/admin', icon: ShieldCheck },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t-2 border-slate-200 flex justify-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between w-full max-w-lg h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 active:bg-slate-50",
                isActive ? "text-blue-700 bg-blue-50/30" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {/* Active top border indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-700" />
              )}
              
              <Icon 
                size={isActive ? 22 : 20} 
                strokeWidth={isActive ? 3 : 2}
                className="transition-transform" 
              />

              <span className={clsx(
                "text-[9px] font-black uppercase tracking-tighter mt-1",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
