/**
 * Cache localStorage pour les factures (commandes payées du jour) du POS.
 * En mode hors ligne, l'onglet Factures affiche les données chargées avant la coupure.
 */

import type { PaidOrderDto } from '@/lib/data/orders'

const CACHE_KEY = 'mindef-pos-invoices-cache'

function getTodayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export interface InvoicesCacheData {
  date: string
  orders: PaidOrderDto[]
  savedAt: number
}

/**
 * Retourne les factures du jour en cache, ou null si pas de cache ou date différente.
 */
export function getInvoicesCache(): PaidOrderDto[] | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as InvoicesCacheData
    if (!parsed.date || !Array.isArray(parsed.orders)) return null
    const today = getTodayKey()
    if (parsed.date !== today) return null
    return parsed.orders
  } catch {
    return null
  }
}

/**
 * Enregistre les factures du jour en cache (appelé après un fetch réussi).
 */
export function setInvoicesCache(orders: PaidOrderDto[]): void {
  if (!isBrowser()) return
  try {
    const data: InvoicesCacheData = {
      date: getTodayKey(),
      orders,
      savedAt: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // quota or disabled localStorage
  }
}
