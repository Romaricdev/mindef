'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrderTimerProps {
  startTime: string // ISO timestamp
  estimatedTime?: number // minutes
  onOverdue?: () => void
  className?: string
}

export function OrderTimer({ startTime, estimatedTime, onOverdue, className }: OrderTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    const start = new Date(startTime).getTime()
    const OVERDUE_THRESHOLD = (estimatedTime || 15) * 60 * 1000 // Convert to ms

    const updateTimer = () => {
      const now = Date.now()
      const elapsedMs = now - start
      const elapsedSeconds = Math.floor(elapsedMs / 1000)
      setElapsed(elapsedSeconds)

      if (elapsedMs >= OVERDUE_THRESHOLD && !isOverdue) {
        setIsOverdue(true)
        onOverdue?.()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [startTime, estimatedTime, onOverdue, isOverdue])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = () => {
    if (isOverdue) return 'text-red-600'
    if (estimatedTime) {
      const elapsedMinutes = elapsed / 60
      if (elapsedMinutes >= estimatedTime * 0.8) return 'text-amber-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Clock className={cn('w-4 h-4', getStatusColor())} />
      <span className={cn('text-sm font-mono font-semibold', getStatusColor())}>
        {formatTime(elapsed)}
      </span>
      {isOverdue && (
        <span className="text-xs text-red-600 font-medium">(En retard)</span>
      )}
    </div>
  )
}
