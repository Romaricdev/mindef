/**
 * Cache localStorage pour les addons et options par catégorie.
 * Permet d'afficher les addons en mode offline (POS, modal addons).
 */

import type { Addon, AddonCategoryOption, AddonWithCategoryOption } from '@/types'

const CACHE_KEY = 'mindef-addons-cache'

export interface AddonsCacheData {
  addons: Addon[]
  options: AddonCategoryOption[]
  savedAt: number
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function getAddonsCache(): AddonsCacheData | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AddonsCacheData
    if (!Array.isArray(parsed.addons) || !Array.isArray(parsed.options)) return null
    return parsed
  } catch {
    return null
  }
}

export function setAddonsCache(addons: Addon[], options: AddonCategoryOption[]): void {
  if (!isBrowser()) return
  try {
    const data: AddonsCacheData = {
      addons,
      options,
      savedAt: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // quota or disabled localStorage
  }
}

/**
 * Reconstruit AddonWithCategoryOption[] pour une catégorie à partir du cache.
 * Retourne null si le cache est vide ou incomplet.
 */
export function buildAddonsWithCategoryOptionsFromCache(
  categoryId: string
): AddonWithCategoryOption[] | null {
  const cache = getAddonsCache()
  if (!cache?.addons?.length || !cache?.options?.length) return null

  const optsForCategory = cache.options.filter((o) => o.categoryId === categoryId)
  if (optsForCategory.length === 0) return null

  const addonIds = new Set(optsForCategory.map((o) => o.addonId))
  const addonsForCategory = cache.addons.filter((a) => addonIds.has(a.id) && a.available)
  if (addonsForCategory.length === 0) return null

  const result: AddonWithCategoryOption[] = addonsForCategory.map((addon) => {
    const opt = optsForCategory.find((o) => o.addonId === addon.id)
    return {
      addon: { ...addon, categoryIds: addon.categoryIds.includes(categoryId) ? addon.categoryIds : [...addon.categoryIds, categoryId] },
      includedFree: opt?.includedFree ?? false,
      extraPrice: opt?.extraPrice ?? null,
    }
  })

  return result
}

/**
 * Fusionne des addons partiels avec le cache existant (sans écraser les options).
 */
export function mergeAddonsIntoCache(addons: Addon[]): void {
  const cache = getAddonsCache()
  const existing = cache?.addons ?? []
  const byId = new Map(existing.map((a) => [a.id, a]))
  addons.forEach((a) => byId.set(a.id, a))
  setAddonsCache(Array.from(byId.values()), cache?.options ?? [])
}

/**
 * Fusionne des options partiels avec le cache existant.
 */
export function mergeOptionsIntoCache(options: AddonCategoryOption[]): void {
  const cache = getAddonsCache()
  const existing = cache?.options ?? []
  const key = (o: AddonCategoryOption) => `${o.addonId}:${o.categoryId}`
  const byKey = new Map(existing.map((o) => [key(o), o]))
  options.forEach((o) => byKey.set(key(o), o))
  setAddonsCache(cache?.addons ?? [], Array.from(byKey.values()))
}
