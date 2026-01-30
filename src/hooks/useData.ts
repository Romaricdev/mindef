'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchCategories,
  fetchMenuItems,
  fetchMenuItem,
  fetchAddons,
  fetchAddonsWithCategoryOptions,
  fetchAddonCategoryOptions,
  fetchTables,
  fetchTableReservations,
  fetchTableReservationsByTable,
  fetchHallReservations,
  fetchHallReservationsByHall,
  fetchHalls,
  fetchOrders,
  fetchMenus,
  fetchMenusByType,
  fetchActiveMenus,
  fetchMenuById,
  fetchDashboardStats,
  fetchRevenueByDay,
  fetchTopSellingItems,
  fetchDailyMenus,
  fetchReservationSlotTypes,
  fetchHallPacks,
  fetchReservationContact,
} from '@/lib/data'
import type {
  Category,
  MenuItem,
  Addon,
  AddonWithCategoryOption,
  AddonCategoryOption,
  RestaurantTable,
  TableReservation,
  HallReservation,
  Hall,
  Order,
  Menu,
  DashboardStats,
  DailyStat,
  ReservationSlotType,
  HallPack,
  ReservationContact,
} from '@/types'

interface UseDataResult<T> {
  data: T
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

function useData<T>(
  fetcher: () => Promise<T>,
  initial: T
): UseDataResult<T> {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}

/** Menu page : categories + tous les menu items. Filtrage par catégorie côté client. */
export async function fetchMenuData(): Promise<{
  categories: Category[]
  menuItems: MenuItem[]
}> {
  const [categories, menuItems] = await Promise.all([
    fetchCategories(),
    fetchMenuItems(),
  ])
  return { categories, menuItems }
}

export function useMenuData(): UseDataResult<{
  categories: Category[]
  menuItems: MenuItem[]
}> {
  return useData(fetchMenuData, { categories: [], menuItems: [] })
}

export function useCategories(): UseDataResult<Category[]> {
  return useData(fetchCategories, [])
}

export function useMenuItems(): UseDataResult<MenuItem[]> {
  return useData(fetchMenuItems, [])
}

export function useMenuItem(
  id: number | string | null
): UseDataResult<MenuItem | null> {
  const fetcher = useCallback(
    () => (id != null ? fetchMenuItem(id) : Promise.resolve(null)),
    [id]
  )
  return useData(fetcher, null)
}

export function useAddonsWithCategoryOptions(
  categoryId: string | null
): UseDataResult<AddonWithCategoryOption[]> {
  const fetcher = useCallback(
    () =>
      categoryId
        ? fetchAddonsWithCategoryOptions(categoryId)
        : Promise.resolve([]),
    [categoryId]
  )
  return useData(fetcher, [])
}

export function useAddonCategoryOptions(): UseDataResult<AddonCategoryOption[]> {
  return useData(fetchAddonCategoryOptions, [])
}

export function useAddons(): UseDataResult<Addon[]> {
  return useData(fetchAddons, [])
}

export function useTables(): UseDataResult<RestaurantTable[]> {
  return useData(fetchTables, [])
}

export function useTableReservations(): UseDataResult<TableReservation[]> {
  return useData(fetchTableReservations, [])
}

export function useTableReservationsByTable(
  tableNumber: number | null
): UseDataResult<TableReservation[]> {
  const fetcher = useCallback(
    () =>
      tableNumber != null
        ? fetchTableReservationsByTable(tableNumber)
        : Promise.resolve([]),
    [tableNumber]
  )
  return useData(fetcher, [])
}

export function useHallReservations(): UseDataResult<HallReservation[]> {
  return useData(fetchHallReservations, [])
}

export function useHallReservationsByHall(
  hallId: number | string | null
): UseDataResult<HallReservation[]> {
  const fetcher = useCallback(
    () =>
      hallId != null
        ? fetchHallReservationsByHall(hallId)
        : Promise.resolve([]),
    [hallId]
  )
  return useData(fetcher, [])
}

export function useHalls(): UseDataResult<Hall[]> {
  return useData(fetchHalls, [])
}

export function useReservationSlotTypes(): UseDataResult<ReservationSlotType[]> {
  return useData(fetchReservationSlotTypes, [])
}

export function useHallPacks(options?: {
  slotTypeSlug?: string | null
  hallId?: number | null
}): UseDataResult<HallPack[]> {
  const fetcher = useCallback(
    () =>
      fetchHallPacks({
        slotTypeSlug: options?.slotTypeSlug ?? undefined,
        hallId: options?.hallId ?? undefined,
      }),
    [options?.slotTypeSlug, options?.hallId]
  )
  return useData(fetcher, [])
}

export function useReservationContact(): UseDataResult<ReservationContact> {
  const defaultContact: ReservationContact = {
    telephoneReservation: [],
    telephonePaiement: [],
    email: '',
  }
  return useData(fetchReservationContact, defaultContact)
}

export function useOrders(): UseDataResult<Order[]> {
  return useData(fetchOrders, [])
}

export function useMenus(): UseDataResult<Menu[]> {
  return useData(fetchMenus, [])
}

export function useMenusByType(
  type: 'predefined' | 'daily' | null
): UseDataResult<Menu[]> {
  const fetcher = useCallback(
    () =>
      type ? fetchMenusByType(type) : Promise.resolve([]),
    [type]
  )
  return useData(fetcher, [])
}

export function useActiveMenus(): UseDataResult<Menu[]> {
  return useData(fetchActiveMenus, [])
}

export function useMenuById(
  id: number | string | null
): UseDataResult<Menu | null> {
  const fetcher = useCallback(
    () => (id != null ? fetchMenuById(id) : Promise.resolve(null)),
    [id]
  )
  return useData(fetcher, null)
}

async function fetchPosData(): Promise<{
  tables: RestaurantTable[]
  products: MenuItem[]
  categories: Category[]
  dailyMenus: Menu[]
  onlineOrders: Order[]
}> {
  const [
    tables,
    products,
    categories,
    dailyMenus,
    orders,
  ] = await Promise.all([
    fetchTables(),
    fetchMenuItems(),
    fetchCategories(),
    fetchDailyMenus(),
    fetchOrders(),
  ])
  const onlineOrders = orders.filter(
    (o) =>
      (o.type === 'takeaway' || o.type === 'delivery') &&
      o.source === 'online'
  )
  return { tables, products, categories, dailyMenus, onlineOrders }
}

export function usePosData(): UseDataResult<{
  tables: RestaurantTable[]
  products: MenuItem[]
  categories: Category[]
  dailyMenus: Menu[]
  onlineOrders: Order[]
}> {
  return useData(fetchPosData, {
    tables: [],
    products: [],
    categories: [],
    dailyMenus: [],
    onlineOrders: [],
  })
}

export function useDashboardStats(): UseDataResult<DashboardStats | null> {
  return useData(fetchDashboardStats, null as DashboardStats | null)
}

export function useRevenueByDay(): UseDataResult<DailyStat[]> {
  return useData(fetchRevenueByDay, [])
}

export function useTopSellingItems(): UseDataResult<
  { name: string; quantity: number; revenue: number }[]
> {
  return useData(fetchTopSellingItems, [])
}
