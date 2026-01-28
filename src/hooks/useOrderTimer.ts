'use client'

import { useState, useEffect } from 'react'

interface OrderTimerResult {
  seconds: number
  minutes: number
  formatted: string
  isWarning: boolean // 10-15 minutes
  isOverdue: boolean // > 15 minutes
  /** true si la commande est "Remise" et le timer arrêté (servedAt enregistré en BD). */
  isStopped: boolean
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Timer cuisine. S'arrête lorsque la commande a le statut "Remise" (servedAt fourni).
 * @param validatedAt - Heure de validation (début du timer)
 * @param servedAt - Heure de remise au client (fin du timer, en BD). Si fourni, le timer est figé.
 */
export function useOrderTimer(validatedAt: string, servedAt?: string | null): OrderTimerResult {
  const [elapsed, setElapsed] = useState(0)
  const stopped = Boolean(servedAt)

  useEffect(() => {
    const start = new Date(validatedAt).getTime()
    const calc = () => {
      const end = servedAt ? new Date(servedAt).getTime() : Date.now()
      return Math.floor(Math.max(0, (end - start) / 1000))
    }

    setElapsed(calc())

    if (stopped) return
    const interval = setInterval(() => setElapsed(calc()), 1000)
    return () => clearInterval(interval)
  }, [validatedAt, servedAt, stopped])

  const minutes = Math.floor(elapsed / 60)

  return {
    seconds: elapsed,
    minutes,
    formatted: formatTime(elapsed),
    isWarning: !stopped && minutes >= 10 && minutes < 15,
    isOverdue: !stopped && minutes >= 15,
    isStopped: stopped,
  }
}
