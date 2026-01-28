import type { RestaurantTable } from '@/types'

export const tables: RestaurantTable[] = [
  { id: 1, number: 1, capacity: 2, status: 'available' },
  { id: 2, number: 2, capacity: 2, status: 'available' },
  { id: 3, number: 3, capacity: 4, status: 'occupied', currentOrderId: 'ORD-002' },
  { id: 4, number: 4, capacity: 4, status: 'available' },
  { id: 5, number: 5, capacity: 4, status: 'occupied', currentOrderId: 'ORD-001' },
  { id: 6, number: 6, capacity: 6, status: 'reserved' },
  { id: 7, number: 7, capacity: 6, status: 'available' },
  { id: 8, number: 8, capacity: 8, status: 'available' },
  { id: 9, number: 9, capacity: 2, status: 'available' },
  { id: 10, number: 10, capacity: 4, status: 'available' },
  { id: 11, number: 11, capacity: 4, status: 'available' },
  { id: 12, number: 12, capacity: 6, status: 'occupied', currentOrderId: 'ORD-006' },
  { id: 13, number: 13, capacity: 8, status: 'reserved' },
  { id: 14, number: 14, capacity: 4, status: 'available' },
  { id: 15, number: 15, capacity: 2, status: 'available' },
]

export function getTableById(id: number | string): RestaurantTable | undefined {
  return tables.find(table => table.id === id)
}

export function getTablesByStatus(status: 'available' | 'occupied' | 'reserved'): RestaurantTable[] {
  return tables.filter(table => table.status === status)
}

export function getAvailableTables(): RestaurantTable[] {
  return tables.filter(table => table.status === 'available')
}
