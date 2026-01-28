import type { MenuItem, Category } from '@/types'

export const categories: Category[] = [
  { id: 'entrees', name: 'Entrées', description: 'Commencez votre repas', icon: 'Salad', order: 1 },
  { id: 'plats', name: 'Plats principaux', description: 'Nos spécialités', icon: 'UtensilsCrossed', order: 2 },
  { id: 'grillades', name: 'Grillades', description: 'Viandes grillées', icon: 'Flame', order: 3 },
  { id: 'poissons', name: 'Poissons', description: 'Fraîcheur de la mer', icon: 'Fish', order: 4 },
  { id: 'desserts', name: 'Desserts', description: 'Douceurs sucrées', icon: 'Cake', order: 5 },
  { id: 'boissons', name: 'Boissons', description: 'Rafraîchissements', icon: 'Wine', order: 6 },
]

export const menuItems: MenuItem[] = [
  // Entrées
  {
    id: 1,
    name: 'Salade du Chef',
    description: 'Laitue fraîche, tomates cerises, avocat, poulet grillé et sauce maison',
    price: 4500,
    categoryId: 'entrees',
    available: true,
    popular: true,
    preparationTime: 10,
  },
  {
    id: 2,
    name: 'Soupe de poisson',
    description: 'Soupe traditionnelle aux fruits de mer et épices locales',
    price: 3500,
    categoryId: 'entrees',
    available: true,
    preparationTime: 15,
  },
  {
    id: 3,
    name: 'Accras de morue',
    description: 'Beignets de morue croustillants servis avec sauce piquante',
    price: 3000,
    categoryId: 'entrees',
    available: true,
    preparationTime: 12,
  },

  // Plats principaux
  {
    id: 4,
    name: 'Poulet DG',
    description: 'Poulet sauté aux plantains, légumes et sauce tomate épicée',
    price: 7500,
    categoryId: 'plats',
    available: true,
    popular: true,
    preparationTime: 25,
  },
  {
    id: 5,
    name: 'Ndolé',
    description: 'Feuilles amères aux crevettes et viande, accompagné de plantains',
    price: 8000,
    categoryId: 'plats',
    available: true,
    preparationTime: 30,
  },
  {
    id: 6,
    name: 'Riz sauté aux crevettes',
    description: 'Riz parfumé sauté avec crevettes géantes et légumes frais',
    price: 7000,
    categoryId: 'plats',
    available: true,
    preparationTime: 20,
  },

  // Grillades
  {
    id: 7,
    name: 'Brochettes mixtes',
    description: 'Assortiment de brochettes bœuf, poulet et porc, sauce arachide',
    price: 9000,
    categoryId: 'grillades',
    available: true,
    popular: true,
    preparationTime: 20,
  },
  {
    id: 8,
    name: 'Côtelettes d\'agneau',
    description: 'Côtelettes grillées aux herbes, purée de pommes de terre',
    price: 12000,
    categoryId: 'grillades',
    available: true,
    preparationTime: 25,
  },
  {
    id: 9,
    name: 'Entrecôte grillée',
    description: 'Entrecôte de bœuf 300g, frites maison et salade',
    price: 15000,
    categoryId: 'grillades',
    available: true,
    preparationTime: 20,
  },

  // Poissons
  {
    id: 10,
    name: 'Tilapia braisé',
    description: 'Tilapia entier braisé, bananes plantains et sauce tomate',
    price: 8500,
    categoryId: 'poissons',
    available: true,
    popular: true,
    preparationTime: 30,
  },
  {
    id: 11,
    name: 'Gambas à l\'ail',
    description: 'Gambas géantes sautées à l\'ail et persil, riz basmati',
    price: 14000,
    categoryId: 'poissons',
    available: true,
    preparationTime: 18,
  },
  {
    id: 12,
    name: 'Filet de capitaine',
    description: 'Filet de capitaine grillé, légumes vapeur et sauce citron',
    price: 11000,
    categoryId: 'poissons',
    available: false,
    preparationTime: 22,
  },

  // Desserts
  {
    id: 13,
    name: 'Fondant au chocolat',
    description: 'Gâteau au chocolat coulant, glace vanille',
    price: 3500,
    categoryId: 'desserts',
    available: true,
    popular: true,
    preparationTime: 12,
  },
  {
    id: 14,
    name: 'Salade de fruits frais',
    description: 'Assortiment de fruits tropicaux de saison',
    price: 2500,
    categoryId: 'desserts',
    available: true,
    preparationTime: 5,
  },
  {
    id: 15,
    name: 'Crème brûlée',
    description: 'Crème onctueuse à la vanille, caramélisée',
    price: 3000,
    categoryId: 'desserts',
    available: true,
    preparationTime: 8,
  },

  // Boissons
  {
    id: 16,
    name: 'Jus de fruits frais',
    description: 'Orange, ananas, mangue ou passion',
    price: 1500,
    categoryId: 'boissons',
    available: true,
    preparationTime: 5,
  },
  {
    id: 17,
    name: 'Bissap',
    description: 'Boisson traditionnelle à l\'hibiscus, servie fraîche',
    price: 1000,
    categoryId: 'boissons',
    available: true,
    popular: true,
    preparationTime: 2,
  },
  {
    id: 18,
    name: 'Bière locale',
    description: 'Castel, 33 Export ou Beaufort (33cl)',
    price: 1500,
    categoryId: 'boissons',
    available: true,
    preparationTime: 1,
  },
  {
    id: 19,
    name: 'Vin rouge (verre)',
    description: 'Sélection du sommelier',
    price: 3500,
    categoryId: 'boissons',
    available: true,
    preparationTime: 1,
  },
  {
    id: 20,
    name: 'Eau minérale',
    description: 'Tangui ou Source (50cl)',
    price: 800,
    categoryId: 'boissons',
    available: true,
    preparationTime: 1,
  },
]

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter(item => item.categoryId === categoryId)
}

export function getPopularItems(): MenuItem[] {
  return menuItems.filter(item => item.popular && item.available)
}

export function getMenuItem(id: number | string): MenuItem | undefined {
  return menuItems.find(item => item.id === id)
}
