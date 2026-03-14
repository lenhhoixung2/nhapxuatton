'use client'

import { useEffect, useState } from 'react'
import { BadgeCheck } from 'lucide-react'

export function AutoCacheClear() {
  const [showToast, setShowToast] = useState(false)
  const [lastCleared, setLastCleared] = useState<string | null>(null)

  const performClear = async () => {
    try {
      // 1. Clear Service Worker Caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }

      // 2. Clear Session Storage
      sessionStorage.clear()

      const now = new Date().toLocaleTimeString('vi-VN')
      setLastCleared(now)
      console.log(`[Cache] Tự động tối ưu hệ thống lúc ${now}`)

      // Show silent notification
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
      
    } catch (e) {
      console.error('Lỗi khi dọn cache:', e)
    }
  }

  useEffect(() => {
    // Tối ưu ngay khi vào app
    performClear()

    // Tự động tối ưu mỗi 10 phút
    const interval = setInterval(() => {
      performClear()
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="bg-slate-900/90 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                 <BadgeCheck size={14} strokeWidth={3} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Hệ thống đã được tối ưu cache</p>
           </div>
        </div>
      )}
    </>
  )
}
