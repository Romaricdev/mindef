// Tracking pour éviter de répéter le son pour une même commande
const alertedOrders = new Set<string>()

/**
 * Play an alert sound
 */
export function playAlertSound() {
  // Use Web Audio API to generate a simple alert beep
  // This avoids needing an external audio file
  try {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800  // Frequency in Hz
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)

    // Play a second beep
    setTimeout(() => {
      const osc2 = audioContext.createOscillator()
      const gain2 = audioContext.createGain()

      osc2.connect(gain2)
      gain2.connect(audioContext.destination)

      osc2.frequency.value = 1000
      osc2.type = 'sine'

      gain2.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      osc2.start(audioContext.currentTime)
      osc2.stop(audioContext.currentTime + 0.5)
    }, 200)
  } catch {
    // Silently fail if Web Audio API is not available
    console.warn('Web Audio API not available for alert sound')
  }
}

/**
 * Alert if an order is overdue (> 15 minutes)
 * Only alerts once per order
 */
export function alertIfOverdue(orderId: string, elapsedMinutes: number) {
  if (elapsedMinutes >= 15 && !alertedOrders.has(orderId)) {
    playAlertSound()
    alertedOrders.add(orderId)
  }
}

/**
 * Reset alert state for an order (when it's served)
 */
export function resetOrderAlert(orderId: string) {
  alertedOrders.delete(orderId)
}

/**
 * Check if an order has been alerted
 */
export function hasBeenAlerted(orderId: string): boolean {
  return alertedOrders.has(orderId)
}
