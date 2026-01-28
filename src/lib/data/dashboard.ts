import { supabase } from '@/lib/supabase'
import type { DashboardStats, DailyStat, KPIData } from '@/types'

interface DbOrder {
  id: string
  total: number
  customer_phone: string
  created_at: string
}

interface DbOrderItem {
  order_id: string
  name: string
  price: number
  quantity: number
}

function defaultKpi(value: number): KPIData {
  return {
    value,
    previousValue: 0,
    change: 0,
    changeType: 'increase',
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, total, customer_phone, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  const list = (orders ?? []) as DbOrder[]

  const totalRevenue = list.reduce((s, o) => s + Number(o.total), 0)
  const totalOrders = list.length
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const phones = new Set(list.map((o) => o.customer_phone).filter(Boolean))
  const activeCustomers = phones.size

  return {
    totalRevenue: defaultKpi(Math.round(totalRevenue)),
    totalOrders: defaultKpi(totalOrders),
    averageOrderValue: defaultKpi(Math.round(avgOrder)),
    activeCustomers: defaultKpi(activeCustomers),
  }
}

export async function fetchRevenueByDay(): Promise<DailyStat[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('total, created_at')
    .order('created_at', { ascending: true })

  if (error) throw error
  const list = (data ?? []) as { total: number; created_at: string }[]

  const byDate = new Map<string, { revenue: number; orders: number }>()
  for (const o of list) {
    const d = String(o.created_at).slice(0, 10)
    const cur = byDate.get(d) ?? { revenue: 0, orders: 0 }
    cur.revenue += Number(o.total)
    cur.orders += 1
    byDate.set(d, cur)
  }

  return Array.from(byDate.entries())
    .map(([date, { revenue, orders }]) => ({ date, revenue, orders }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)
}

export async function fetchTopSellingItems(): Promise<
  { name: string; quantity: number; revenue: number }[]
> {
  const { data, error } = await supabase
    .from('order_items')
    .select('name, price, quantity')

  if (error) throw error
  const list = (data ?? []) as DbOrderItem[]

  const byName = new Map<string, { quantity: number; revenue: number }>()
  for (const i of list) {
    const cur = byName.get(i.name) ?? { quantity: 0, revenue: 0 }
    cur.quantity += i.quantity
    cur.revenue += Number(i.price) * i.quantity
    byName.set(i.name, cur)
  }

  return Array.from(byName.entries())
    .map(([name, { quantity, revenue }]) => ({ name, quantity, revenue: Math.round(revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}
