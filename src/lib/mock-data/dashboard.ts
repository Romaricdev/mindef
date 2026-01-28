import type { DashboardStats, DailyStat } from '@/types'

export const dashboardStats: DashboardStats = {
  totalRevenue: {
    value: 2450000,
    previousValue: 2100000,
    change: 16.7,
    changeType: 'increase',
  },
  totalOrders: {
    value: 342,
    previousValue: 298,
    change: 14.8,
    changeType: 'increase',
  },
  averageOrderValue: {
    value: 7164,
    previousValue: 7047,
    change: 1.7,
    changeType: 'increase',
  },
  activeCustomers: {
    value: 156,
    previousValue: 142,
    change: 9.9,
    changeType: 'increase',
  },
}

export const revenueByDay: DailyStat[] = [
  { date: '2026-01-11', revenue: 285000, orders: 42 },
  { date: '2026-01-12', revenue: 420000, orders: 58 },
  { date: '2026-01-13', revenue: 380000, orders: 52 },
  { date: '2026-01-14', revenue: 295000, orders: 44 },
  { date: '2026-01-15', revenue: 450000, orders: 62 },
  { date: '2026-01-16', revenue: 520000, orders: 71 },
  { date: '2026-01-17', revenue: 100000, orders: 13 },
]

export const topSellingItems = [
  { name: 'Poulet DG', quantity: 89, revenue: 667500 },
  { name: 'Brochettes mixtes', quantity: 72, revenue: 648000 },
  { name: 'Tilapia braisé', quantity: 65, revenue: 552500 },
  { name: 'Ndolé', quantity: 58, revenue: 464000 },
  { name: 'Entrecôte grillée', quantity: 45, revenue: 675000 },
]

export const ordersByHour = [
  { hour: '11:00', orders: 8 },
  { hour: '12:00', orders: 25 },
  { hour: '13:00', orders: 32 },
  { hour: '14:00', orders: 18 },
  { hour: '15:00', orders: 5 },
  { hour: '16:00', orders: 3 },
  { hour: '17:00', orders: 4 },
  { hour: '18:00', orders: 12 },
  { hour: '19:00', orders: 28 },
  { hour: '20:00', orders: 35 },
  { hour: '21:00', orders: 22 },
  { hour: '22:00', orders: 10 },
]

export const paymentMethodStats = [
  { method: 'Espèces', count: 145, amount: 980000 },
  { method: 'Carte bancaire', count: 128, amount: 1120000 },
  { method: 'Mobile Money', count: 69, amount: 350000 },
]

export const categoryRevenue = [
  { category: 'Plats principaux', revenue: 890000, percentage: 36.3 },
  { category: 'Grillades', revenue: 680000, percentage: 27.8 },
  { category: 'Poissons', revenue: 420000, percentage: 17.1 },
  { category: 'Entrées', revenue: 210000, percentage: 8.6 },
  { category: 'Desserts', revenue: 150000, percentage: 6.1 },
  { category: 'Boissons', revenue: 100000, percentage: 4.1 },
]
