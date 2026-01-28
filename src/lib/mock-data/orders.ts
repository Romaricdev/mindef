import type { Order, OrderStatus } from '@/types'

export const orders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      { menuItemId: 4, name: 'Poulet DG', price: 7500, quantity: 2 },
      { menuItemId: 17, name: 'Bissap', price: 1000, quantity: 2 },
    ],
    status: 'preparing',
    type: 'dine-in',
    tableNumber: 5,
    customerName: 'Pierre Kamga',
    customerPhone: '+237 690 123 456',
    customerEmail: 'pierre.kamga@email.cm',
    paymentMethod: 'cash',
    subtotal: 17000,
    total: 18700,
    createdAt: '2026-01-17T12:30:00Z',
    updatedAt: '2026-01-17T12:35:00Z',
  },
  {
    id: 'ORD-002',
    items: [
      { menuItemId: 7, name: 'Brochettes mixtes', price: 9000, quantity: 1 },
      { menuItemId: 1, name: 'Salade du Chef', price: 4500, quantity: 1 },
      { menuItemId: 18, name: 'Biere locale', price: 1500, quantity: 2 },
    ],
    status: 'ready',
    type: 'dine-in',
    tableNumber: 3,
    customerName: 'Sophie Mballa',
    customerPhone: '+237 677 456 789',
    paymentMethod: 'card',
    subtotal: 16500,
    total: 18150,
    createdAt: '2026-01-17T12:15:00Z',
    updatedAt: '2026-01-17T12:45:00Z',
  },
  {
    id: 'ORD-003',
    items: [
      { menuItemId: 10, name: 'Tilapia braise', price: 8500, quantity: 1 },
      { menuItemId: 5, name: 'Ndole', price: 8000, quantity: 1 },
    ],
    status: 'pending',
    type: 'takeaway',
    customerName: 'Jean Dupont',
    customerPhone: '+237 691 234 567',
    customerEmail: 'jean.dupont@gmail.com',
    subtotal: 16500,
    deliveryFee: 1500,
    total: 19650,
    createdAt: '2026-01-17T12:50:00Z',
    updatedAt: '2026-01-17T12:50:00Z',
  },
  {
    id: 'ORD-004',
    items: [
      { menuItemId: 9, name: 'Entrecote grillee', price: 15000, quantity: 2 },
      { menuItemId: 13, name: 'Fondant au chocolat', price: 3500, quantity: 2 },
      { menuItemId: 19, name: 'Vin rouge (verre)', price: 3500, quantity: 4 },
    ],
    status: 'delivered',
    type: 'dine-in',
    tableNumber: 8,
    customerName: 'Colonel Essomba',
    customerPhone: '+237 699 888 777',
    customerEmail: 'col.essomba@mindef.cm',
    paymentMethod: 'card',
    subtotal: 51000,
    total: 56100,
    createdAt: '2026-01-17T11:00:00Z',
    updatedAt: '2026-01-17T12:00:00Z',
  },
  {
    id: 'ORD-005',
    items: [
      { menuItemId: 6, name: 'Riz saute aux crevettes', price: 7000, quantity: 1 },
    ],
    status: 'cancelled',
    type: 'takeaway',
    customerName: 'Marie Atangana',
    customerPhone: '+237 677 888 999',
    subtotal: 7000,
    total: 7700,
    createdAt: '2026-01-17T10:30:00Z',
    updatedAt: '2026-01-17T10:45:00Z',
  },
  {
    id: 'ORD-006',
    items: [
      { menuItemId: 11, name: 'Gambas a l\'ail', price: 14000, quantity: 1 },
      { menuItemId: 2, name: 'Soupe de poisson', price: 3500, quantity: 1 },
      { menuItemId: 16, name: 'Jus de fruits frais', price: 1500, quantity: 2 },
    ],
    status: 'confirmed',
    type: 'dine-in',
    tableNumber: 12,
    customerName: 'Capitaine Ndi',
    customerPhone: '+237 655 444 333',
    subtotal: 20500,
    total: 22550,
    createdAt: '2026-01-17T13:00:00Z',
    updatedAt: '2026-01-17T13:05:00Z',
  },
  {
    id: 'ORD-007',
    items: [
      { menuItemId: 4, name: 'Poulet DG', price: 7500, quantity: 3 },
      { menuItemId: 17, name: 'Bissap', price: 1000, quantity: 3 },
    ],
    status: 'pending',
    type: 'takeaway',
    customerName: 'Famille Nguemo',
    customerPhone: '+237 698 765 432',
    customerEmail: 'nguemo.famille@yahoo.fr',
    subtotal: 25500,
    deliveryFee: 1500,
    total: 29550,
    createdAt: '2026-01-17T13:30:00Z',
    updatedAt: '2026-01-17T13:30:00Z',
  },
  {
    id: 'ORD-008',
    items: [
      { menuItemId: 8, name: 'Cotes de porc', price: 8500, quantity: 2 },
      { menuItemId: 15, name: 'Glace artisanale', price: 2500, quantity: 2 },
    ],
    status: 'preparing',
    type: 'takeaway',
    customerName: 'Serge Fotso',
    customerPhone: '+237 670 111 222',
    subtotal: 22000,
    total: 24200,
    createdAt: '2026-01-17T13:45:00Z',
    updatedAt: '2026-01-17T13:50:00Z',
  },
]

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return orders.filter(order => order.status === status)
}

export function getActiveOrders(): Order[] {
  return orders.filter(order =>
    ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
  )
}

export function getTodayOrders(): Order[] {
  const today = new Date().toISOString().split('T')[0]
  return orders.filter(order => order.createdAt.startsWith(today))
}

export function getOrderById(id: string): Order | undefined {
  return orders.find(order => order.id === id)
}
