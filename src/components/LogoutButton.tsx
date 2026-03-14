'use client'

import { logout } from '@/lib/auth-actions'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return
    setLoading(true)
    await logout()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="p-2 bg-white/20 text-white rounded-xl backdrop-blur-md hover:bg-white/30 active:scale-95 transition-all flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-xs font-bold uppercase">Thoát</span>
    </button>
  )
}
