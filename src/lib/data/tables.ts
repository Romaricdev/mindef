import { supabase } from '@/lib/supabase'
import type { RestaurantTable } from '@/types'

interface DbTable {
  id: number
  number: number
  capacity: number
  status: string
  current_order_id: string | null
  qr_slug: string | null
  created_at: string
  updated_at: string
}

function mapTable(row: DbTable): RestaurantTable {
  return {
    id: row.id,
    number: row.number,
    capacity: row.capacity,
    status: row.status as 'available' | 'occupied' | 'reserved',
    currentOrderId: row.current_order_id ?? undefined,
  }
}

export async function fetchTables(): Promise<RestaurantTable[]> {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .order('number', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapTable)
}

export async function fetchTablesByStatus(
  status: 'available' | 'occupied' | 'reserved'
): Promise<RestaurantTable[]> {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .eq('status', status)
    .order('number', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapTable)
}

export async function fetchTableById(
  id: number | string
): Promise<RestaurantTable | null> {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapTable(data) : null
}

export async function fetchAvailableTables(): Promise<RestaurantTable[]> {
  return fetchTablesByStatus('available')
}

export type CreateTableInput = {
  number: number
  capacity: number
  status?: 'available' | 'occupied' | 'reserved'
}
export type UpdateTableInput = Partial<CreateTableInput>

export async function createTable(input: CreateTableInput): Promise<RestaurantTable> {
  const row = {
    number: input.number,
    capacity: input.capacity,
    status: input.status ?? 'available',
  }
  const { data, error } = await (supabase.from('restaurant_tables') as any)
    .insert(row)
    .select()
    .single()
  if (error) throw error
  return mapTable(data as DbTable)
}

export async function updateTable(
  id: number | string,
  input: UpdateTableInput
): Promise<RestaurantTable> {
  const payload: Record<string, unknown> = {}
  if (input.number != null) payload.number = input.number
  if (input.capacity != null) payload.capacity = input.capacity
  if (input.status != null) payload.status = input.status
  const { data, error } = await (supabase.from('restaurant_tables') as any)
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapTable(data as DbTable)
}

export async function deleteTable(id: number | string): Promise<void> {
  const { error } = await supabase.from('restaurant_tables').delete().eq('id', id)
  if (error) throw error
}

/** Met à jour le statut d'une table. */
export async function updateTableStatus(
  id: number | string,
  status: 'available' | 'occupied' | 'reserved',
  currentOrderId?: string | null
): Promise<RestaurantTable> {
  const payload: Record<string, unknown> = { status }
  if (currentOrderId !== undefined) {
    payload.current_order_id = currentOrderId
  }
  const { data, error } = await (supabase.from('restaurant_tables') as any)
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapTable(data as DbTable)
}

/** Met à jour le statut d'une table par son numéro. */
export async function updateTableStatusByNumber(
  tableNumber: number,
  status: 'available' | 'occupied' | 'reserved',
  currentOrderId?: string | null
): Promise<RestaurantTable | null> {
  const table = await fetchTables()
  const targetTable = table.find((t) => t.number === tableNumber)
  if (!targetTable) return null
  return updateTableStatus(targetTable.id, status, currentOrderId)
}
