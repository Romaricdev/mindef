'use client'

import { useState, useEffect, useRef } from 'react'
import { Wifi } from 'lucide-react'

const DURATION_MS = 2500

export function BackOnlineToast() {
  const [visible, setVisible] = useState(false)
  const wasOfflineRef = useRef(typeof navigator !== 'undefined' ? !navigator.onLine : false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleOnline = () => {
      if (wasOfflineRef.current) {
        wasOfflineRef.current = false
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setVisible(true)
        timeoutRef.current = setTimeout(() => setVisible(false), DURATION_MS)
      }
    }

    const handleOffline = () => {
      wasOfflineRef.current = true
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2"
      style={{ animation: 'fadeInUp 0.3s ease-out' }}
    >
      <div className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg ring-1 ring-green-500/30">
        <Wifi className="h-5 w-5 flex-shrink-0" />
        <span className="font-medium">De nouveau en ligne</span>
      </div>
    </div>
  )
}
