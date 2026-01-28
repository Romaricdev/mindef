/**
 * Synchronisation POS <-> Supabase
 *
 * - Enqueue create/status/payment/cancel/items sans bloquer l'UI.
 * - En offline : persistance IndexedDB, rejeu au retour de la connexion.
 * - Au retour online : sync avec l'état en base (fetch) puis application des ops en attente.
 */

import {
  createOrderFromPos,
  updateOrderKitchenStatus,
  updateOrderPayment,
  cancelOrderInDb,
  updateOrderItemsInDb,
  fetchOrdersByIds,
  type CreateOrderFromPosInput,
  type CreateOrderFromPosItem,
  type UpdateOrderPaymentInput,
} from '@/lib/data/orders'
import type { KitchenOrderStatus } from '@/types'

const DB_NAME = 'pos-sync'
const DB_VERSION = 1
const STORE_OPS = 'pending-ops'

export type PosSyncOp =
  | { type: 'create'; id: string; payload: CreateOrderFromPosInput }
  | { type: 'status'; id: string; orderId: string; kitchenStatus: KitchenOrderStatus }
  | { type: 'payment'; id: string; orderId: string; payment: UpdateOrderPaymentInput }
  | { type: 'cancel'; id: string; orderId: string }
  | { type: 'items'; id: string; orderId: string; items: CreateOrderFromPosItem[] }

type StoredOp = PosSyncOp & { createdAt: string }

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined'
}

function getDb(): Promise<IDBDatabase> {
  if (!isBrowser()) {
    return Promise.reject(new Error('IndexedDB unavailable'))
  }
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_OPS)) {
        db.createObjectStore(STORE_OPS, { keyPath: 'id' })
      }
    }
  })
}

async function addOpToIdb(op: StoredOp): Promise<void> {
  const db = await getDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OPS, 'readwrite')
    const store = tx.objectStore(STORE_OPS)
    const req = store.add(op)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve()
  })
}

async function getAllOpsFromIdb(): Promise<StoredOp[]> {
  const db = await getDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OPS, 'readonly')
    const store = tx.objectStore(STORE_OPS)
    const req = store.getAll()
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const list = (req.result as StoredOp[]).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      resolve(list)
    }
  })
}

async function removeOpFromIdb(id: string): Promise<void> {
  const db = await getDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OPS, 'readwrite')
    const store = tx.objectStore(STORE_OPS)
    const req = store.delete(id)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve()
  })
}

async function clearOpsFromIdb(): Promise<void> {
  const db = await getDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OPS, 'readwrite')
    const store = tx.objectStore(STORE_OPS)
    const req = store.clear()
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve()
  })
}

function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine
}

function uid(): string {
  return crypto.randomUUID()
}

// ----------------------------------------
// Queue + processing
// ----------------------------------------

let queue: StoredOp[] = []
let processing = false
let listeners: Array<(pending: number, online: boolean) => void> = []

function notify(): void {
  const pending = queue.length
  const online = isOnline()
  listeners.forEach((fn) => {
    try {
      fn(pending, online)
    } catch {
      /* ignore */
    }
  })
}

export function subscribePosSync(fn: (pending: number, online: boolean) => void): () => void {
  listeners.push(fn)
  fn(queue.length, isOnline())
  return () => {
    listeners = listeners.filter((l) => l !== fn)
  }
}

export function getPosSyncState(): { pending: number; online: boolean } {
  return { pending: queue.length, online: isOnline() }
}

async function persistQueue(): Promise<void> {
  if (!isBrowser()) return
  try {
    await clearOpsFromIdb()
    for (const op of queue) {
      await addOpToIdb(op)
    }
  } catch {
    /* best-effort */
  }
}

async function loadQueueFromIdb(): Promise<void> {
  if (!isBrowser()) return
  try {
    const stored = await getAllOpsFromIdb()
    queue = stored
    notify()
  } catch {
    /* best-effort */
  }
}

async function runOp(op: StoredOp): Promise<void> {
  console.log('[POS-SYNC] runOp - START', {
    type: op.type,
    id: op.id,
    orderId: 'orderId' in op ? op.orderId : op.type === 'create' ? op.payload.id : 'N/A',
    createdAt: op.createdAt,
  })

  try {
    switch (op.type) {
      case 'create':
        console.log('[POS-SYNC] runOp - Executing CREATE:', op.payload.id)
        await createOrderFromPos(op.payload)
        console.log('[POS-SYNC] runOp - CREATE SUCCESS:', op.payload.id)
        break
      case 'status':
        console.log('[POS-SYNC] runOp - Executing STATUS UPDATE:', op.orderId, op.kitchenStatus)
        await updateOrderKitchenStatus(op.orderId, op.kitchenStatus)
        console.log('[POS-SYNC] runOp - STATUS UPDATE SUCCESS:', op.orderId)
        break
      case 'payment':
        console.log('[POS-SYNC] runOp - Executing PAYMENT:', op.orderId, op.payment)
        await updateOrderPayment(op.orderId, op.payment)
        console.log('[POS-SYNC] runOp - PAYMENT SUCCESS:', op.orderId)
        break
      case 'cancel':
        console.log('[POS-SYNC] runOp - Executing CANCEL:', op.orderId)
        await cancelOrderInDb(op.orderId)
        console.log('[POS-SYNC] runOp - CANCEL SUCCESS:', op.orderId)
        break
      case 'items':
        console.log('[POS-SYNC] runOp - Executing ITEMS UPDATE:', op.orderId, op.items.length, 'items')
        await updateOrderItemsInDb(op.orderId, op.items)
        console.log('[POS-SYNC] runOp - ITEMS UPDATE SUCCESS:', op.orderId)
        break
      default:
        const err = new Error(`Unknown op type: ${(op as StoredOp).type}`)
        console.error('[POS-SYNC] runOp - ERROR:', err)
        throw err
    }
  } catch (error) {
    console.error('[POS-SYNC] runOp - ERROR executing op:', {
      type: op.type,
      id: op.id,
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    })
    throw error
  }
}

async function processNext(): Promise<void> {
  if (processing || !isOnline() || queue.length === 0) {
    notify()
    return
  }
  processing = true
  const op = queue[0]
  try {
    await runOp(op)
    queue.shift()
    await persistQueue()
    notify()
    processing = false
    await processNext()
  } catch (e) {
    processing = false
    await persistQueue()
    notify()
    console.warn('[pos-sync] Op failed, will retry later:', op.type, op.id, e)
  }
}

/** 1) Fetch orders we're about to touch. 2) Process pending ops. */
async function syncOnReconnect(): Promise<void> {
  if (!isOnline()) return
  await loadQueueFromIdb()
  const orderIds = [
    ...new Set(
      queue.map((o) => {
        if (o.type === 'create') return (o.payload as CreateOrderFromPosInput).id
        if ('orderId' in o) return o.orderId
        return null
      }).filter((x): x is string => !!x)
    ),
  ]
  try {
    if (orderIds.length > 0) {
      await fetchOrdersByIds(orderIds)
    }
  } catch {
    /* non-blocking; we still push our ops */
  }
  await processNext()
}

// ----------------------------------------
// Public API
// ----------------------------------------

function toStoredOp(op: PosSyncOp): StoredOp {
  return { ...op, createdAt: new Date().toISOString() }
}

/**
 * Enqueue une opération. Non bloquant.
 * Si offline -> sauvegarde IndexedDB, rejeu au retour de la connexion.
 */
export function enqueuePosSyncOp(op: PosSyncOp): void {
  const id = op.id
  const stored: StoredOp = toStoredOp({ ...op, id })
  console.log('[POS-SYNC] enqueuePosSyncOp - Adding to queue:', {
    type: stored.type,
    id: stored.id,
    orderId: 'orderId' in stored ? stored.orderId : stored.type === 'create' ? stored.payload.id : 'N/A',
    queueLengthBefore: queue.length,
    isOnline: isOnline(),
  })
  queue.push(stored)
  console.log('[POS-SYNC] enqueuePosSyncOp - Queue length after push:', queue.length)
  notify()
  if (isBrowser()) {
    addOpToIdb(stored).catch((err) => {
      console.error('[POS-SYNC] enqueuePosSyncOp - Failed to persist to IndexedDB:', err)
    })
  }
  if (isOnline()) {
    console.log('[POS-SYNC] enqueuePosSyncOp - Online, triggering processNext')
    processNext()
  } else {
    console.log('[POS-SYNC] enqueuePosSyncOp - Offline, op will be processed on reconnect')
  }
}

export function enqueueCreateOrder(input: CreateOrderFromPosInput): void {
  console.log('[POS-SYNC] enqueueCreateOrder - Enqueuing create:', {
    orderId: input.id,
    type: input.type,
    validatedAt: input.validatedAt,
  })
  enqueuePosSyncOp({ type: 'create', id: uid(), payload: input })
  console.log('[POS-SYNC] enqueueCreateOrder - Create enqueued for order:', input.id)
}

export function enqueueStatusUpdate(orderId: string, kitchenStatus: KitchenOrderStatus): void {
  enqueuePosSyncOp({ type: 'status', id: uid(), orderId, kitchenStatus })
}

export function enqueuePayment(orderId: string, payment: UpdateOrderPaymentInput): void {
  console.log('[POS-SYNC] enqueuePayment - Enqueuing payment:', {
    orderId,
    payment,
  })
  enqueuePosSyncOp({ type: 'payment', id: uid(), orderId, payment })
  console.log('[POS-SYNC] enqueuePayment - Payment enqueued for order:', orderId)
}

export function enqueueCancel(orderId: string): void {
  enqueuePosSyncOp({ type: 'cancel', id: uid(), orderId })
}

export function enqueueItemsUpdate(orderId: string, items: CreateOrderFromPosItem[]): void {
  enqueuePosSyncOp({ type: 'items', id: uid(), orderId, items })
}

/**
 * À appeler au mount du POS : écoute online/offline, charge la queue au retour.
 */
export function initPosSync(): () => void {
  if (!isBrowser()) return () => {}

  const onOnline = () => {
    notify()
    syncOnReconnect()
  }
  const onOffline = () => {
    notify()
  }

  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)

  if (isOnline()) {
    syncOnReconnect()
  } else {
    loadQueueFromIdb()
  }

  return () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}
