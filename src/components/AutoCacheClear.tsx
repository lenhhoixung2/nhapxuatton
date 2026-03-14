'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, Trash2 } from 'lucide-react'

export function AutoCacheClear() {
  const [lastCleared, setLastCleared] = useState<string | null>(null)

  const performClear = async (showReload = false) => {
    try {
      // 1. Clear Service Worker Caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }

      // 2. Clear Session Storage (Safe for our cookie-based auth)
      sessionStorage.clear()

      // 3. Optional: Clear localStorage (Except core items if any)
      // localStorage.clear() 

      const now = new Date().toLocaleTimeString('vi-VN')
      setLastCleared(now)
      console.log(`[Cache] Đã xóa cache lúc ${now}`)

      if (showReload) {
        window.location.reload()
      }
    } catch (e) {
      console.error('Lỗi khi xóa cache:', e)
    }
  }

  useEffect(() => {
    // Xóa ngay khi vào app
    performClear()

    // Tự động xóa mỗi 10 phút
    const interval = setInterval(() => {
      performClear(false) // Tự động xóa ngầm, không reload gây khó chịu
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
       {/* Thông báo nhỏ khi vừa xóa xong */}
       {lastCleared && (
         <div className="bg-slate-800/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg border border-white/10 animate-fade-in-out">
           Cache gần nhất: {lastCleared}
         </div>
       )}
       
       <button 
         onClick={() => performClear(true)}
         className="pointer-events-auto w-10 h-10 bg-rose-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-rose-600 active:scale-90 transition-all border-2 border-white/20"
         title="Xóa cache & Tải lại ngay"
       >
         <Trash2 size={20} />
       </button>
    </div>
  )
}
