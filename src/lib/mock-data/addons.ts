import type { Addon, AddonCategoryOption } from '@/types'

export const addons: Addon[] = [
  // Addons pour Grillades et Plats principaux
  {
    id: 'addon-mayo',
    name: 'Mayonnaise',
    price: 200,
    categoryIds: ['grillades', 'plats'],
    available: true,
  },
  {
    id: 'addon-ketchup',
    name: 'Ketchup',
    price: 150,
    categoryIds: ['grillades', 'plats'],
    available: true,
  },
  {
    id: 'addon-moutarde',
    name: 'Moutarde',
    price: 150,
    categoryIds: ['grillades', 'plats'],
    available: true,
  },
  {
    id: 'addon-piment',
    name: 'Piment',
    price: 100,
    categoryIds: ['grillades', 'plats', 'poissons'],
    available: true,
  },
  {
    id: 'addon-frites',
    name: 'Supplément frites',
    price: 500,
    categoryIds: ['grillades', 'plats'],
    available: true,
  },
  {
    id: 'addon-riz',
    name: 'Supplément riz',
    price: 500,
    categoryIds: ['grillades', 'plats', 'poissons'],
    available: true,
  },

  // Addons pour Poissons
  {
    id: 'addon-citron',
    name: 'Citron',
    price: 100,
    categoryIds: ['poissons', 'boissons'],
    available: true,
  },
  {
    id: 'addon-tartare',
    name: 'Sauce tartare',
    price: 300,
    categoryIds: ['poissons'],
    available: true,
  },

  // Addons pour Boissons
  {
    id: 'addon-glacons',
    name: 'Glaçons',
    price: 0,
    categoryIds: ['boissons'],
    available: true,
  },
  {
    id: 'addon-sucre',
    name: 'Sucre',
    price: 0,
    categoryIds: ['boissons'],
    available: true,
  },

  // Addons pour Desserts
  {
    id: 'addon-chantilly',
    name: 'Chantilly',
    price: 300,
    categoryIds: ['desserts'],
    available: true,
  },
  {
    id: 'addon-chocolat',
    name: 'Sauce chocolat',
    price: 250,
    categoryIds: ['desserts'],
    available: true,
  },
  {
    id: 'addon-fruits',
    name: 'Fruits frais',
    price: 400,
    categoryIds: ['desserts'],
    available: true,
  },
  {
    id: 'addon-glace',
    name: 'Boule de glace',
    price: 500,
    categoryIds: ['desserts'],
    available: true,
  },
]

/** Options par (addon, catégorie) : inclus gratuit, prix supplément. Aligné seed. */
export const addonCategoryOptions: AddonCategoryOption[] = [
  { addonId: 'addon-mayo', categoryId: 'grillades', includedFree: true, extraPrice: null },
  { addonId: 'addon-mayo', categoryId: 'plats', includedFree: true, extraPrice: null },
  { addonId: 'addon-ketchup', categoryId: 'grillades', includedFree: true, extraPrice: null },
  { addonId: 'addon-ketchup', categoryId: 'plats', includedFree: true, extraPrice: null },
  { addonId: 'addon-moutarde', categoryId: 'grillades', includedFree: true, extraPrice: null },
  { addonId: 'addon-moutarde', categoryId: 'plats', includedFree: true, extraPrice: null },
  { addonId: 'addon-piment', categoryId: 'grillades', includedFree: true, extraPrice: null },
  { addonId: 'addon-piment', categoryId: 'plats', includedFree: true, extraPrice: null },
  { addonId: 'addon-piment', categoryId: 'poissons', includedFree: true, extraPrice: null },
  { addonId: 'addon-frites', categoryId: 'grillades', includedFree: false, extraPrice: null },
  { addonId: 'addon-frites', categoryId: 'plats', includedFree: false, extraPrice: null },
  { addonId: 'addon-riz', categoryId: 'grillades', includedFree: false, extraPrice: null },
  { addonId: 'addon-riz', categoryId: 'plats', includedFree: false, extraPrice: null },
  { addonId: 'addon-riz', categoryId: 'poissons', includedFree: false, extraPrice: null },
  { addonId: 'addon-citron', categoryId: 'poissons', includedFree: true, extraPrice: null },
  { addonId: 'addon-citron', categoryId: 'boissons', includedFree: true, extraPrice: null },
  { addonId: 'addon-tartare', categoryId: 'poissons', includedFree: false, extraPrice: null },
  { addonId: 'addon-glacons', categoryId: 'boissons', includedFree: true, extraPrice: null },
  { addonId: 'addon-sucre', categoryId: 'boissons', includedFree: true, extraPrice: null },
  { addonId: 'addon-chantilly', categoryId: 'desserts', includedFree: false, extraPrice: null },
  { addonId: 'addon-chocolat', categoryId: 'desserts', includedFree: false, extraPrice: null },
  { addonId: 'addon-fruits', categoryId: 'desserts', includedFree: false, extraPrice: null },
  { addonId: 'addon-glace', categoryId: 'desserts', includedFree: false, extraPrice: null },
]

export interface AddonWithCategoryOption {
  addon: Addon
  includedFree: boolean
  extraPrice: number | null
}

/**
 * Get addons available for a specific category (legacy).
 */
export function getAddonsByCategory(categoryId: string): Addon[] {
  return addons.filter(
    (addon) => addon.available && addon.categoryIds.includes(categoryId)
  )
}

/**
 * Get addons for a category with included_free and extra_price.
 * extraPrice === null → use addon.price for supplément.
 */
export function getAddonsWithCategoryOptions(categoryId: string): AddonWithCategoryOption[] {
  return addons
    .filter((a) => a.available && a.categoryIds.includes(categoryId))
    .map((addon) => {
      const opt = addonCategoryOptions.find(
        (o) => o.addonId === addon.id && o.categoryId === categoryId
      )
      return {
        addon,
        includedFree: opt?.includedFree ?? false,
        extraPrice: opt?.extraPrice ?? null,
      }
    })
}

/**
 * Resolve extra price for an addon in a category (extra_price ?? addon.price).
 */
export function getExtraPrice(addon: Addon, categoryId: string): number {
  const opt = addonCategoryOptions.find(
    (o) => o.addonId === addon.id && o.categoryId === categoryId
  )
  if (opt?.extraPrice != null) return opt.extraPrice
  return addon.price
}

/**
 * Check if a category has available addons
 */
export function categoryHasAddons(categoryId: string): boolean {
  return addons.some(
    (addon) => addon.available && addon.categoryIds.includes(categoryId)
  )
}

/**
 * Get addon by ID
 */
export function getAddonById(addonId: string): Addon | undefined {
  return addons.find((addon) => addon.id === addonId)
}
