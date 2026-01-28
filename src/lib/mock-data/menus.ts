import type { Menu, MenuProduct } from '@/types'

export const menus: Menu[] = [
  {
    id: 1,
    name: 'Menu du Jour - Lundi',
    description: 'Menu spécial du lundi avec plats traditionnels',
    type: 'daily',
    active: true,
    products: [
      { productId: 1 },
      { productId: 4 },
      { productId: 8 },
    ],
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 2,
    name: 'Menu Déjeuner Standard',
    description: 'Menu prédéfini pour le déjeuner',
    type: 'predefined',
    active: true,
    products: [
      { productId: 1 },
      { productId: 2 },
      { productId: 3 },
      { productId: 4 },
    ],
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 3,
    name: 'Menu Dîner Prestige',
    description: 'Menu prédéfini pour le dîner avec plats sélectionnés',
    type: 'predefined',
    active: false,
    products: [
      { productId: 5 },
      { productId: 6 },
      { productId: 7 },
      { productId: 8 },
    ],
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-15T14:00:00Z',
  },
  {
    id: 4,
    name: 'Menu du Jour - Mardi',
    description: 'Menu spécial du mardi',
    type: 'daily',
    active: true,
    products: [
      { productId: 2 },
      { productId: 5 },
      { productId: 9 },
    ],
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T08:00:00Z',
  },
]

export function getMenuById(id: number | string): Menu | undefined {
  return menus.find(menu => menu.id === id)
}

export function getMenusByType(type: 'predefined' | 'daily'): Menu[] {
  return menus.filter(menu => menu.type === type)
}

export function getActiveMenus(): Menu[] {
  return menus.filter(menu => menu.active)
}

export function getDailyMenus(): Menu[] {
  return menus.filter(menu => menu.type === 'daily' && menu.active)
}
