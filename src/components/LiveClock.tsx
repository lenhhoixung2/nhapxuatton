'use client'

import { useState, useEffect } from 'react'

export function LiveClock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    function update() {
      const now = new Date()
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      const dateOpts: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
      setTime(now.toLocaleTimeString('vi-VN', opts))
      setDate(now.toLocaleDateString('vi-VN', dateOpts))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mt-1">
      <p className="text-white font-black text-lg tabular-nums tracking-wider leading-none">{time}</p>
      <p className="text-blue-200 text-[10px] font-medium capitalize">{date}</p>
    </div>
  )
}
