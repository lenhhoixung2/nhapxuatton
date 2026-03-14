'use client'

export function playNotificationSound(type: 'beep' | 'error') {
  if (typeof window === 'undefined') return

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    if (type === 'beep') {
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime)
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)
      oscillator.start(audioCtx.currentTime)
      oscillator.stop(audioCtx.currentTime + 0.1)
    } else {
      // Âm thanh "Tèn tèn" cảnh báo cực mạnh
      const now = audioCtx.currentTime
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(120, now)
      oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.4)
      
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.6, now + 0.05)
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.2)
      gainNode.gain.linearRampToValueAtTime(0.5, now + 0.25)
      gainNode.gain.linearRampToValueAtTime(0, now + 0.5)
      
      oscillator.start(now)
      oscillator.stop(now + 0.5)
    }
  } catch (e) {
    console.error('Không thể phát âm thanh:', e)
  }
}

export function triggerVibration(pattern: number | number[] = 100) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}
