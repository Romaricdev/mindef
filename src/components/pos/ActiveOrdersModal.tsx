'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { X, ChefHat, AlertTriangle, Clock, UtensilsCrossed, ShoppingBag, Truck, LayoutGrid, List, RefreshCw, WifiOff } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui'
import { usePosStore } from '@/store/pos-store'
import { ActiveOrderCard } from './ActiveOrderCard'
import { useOrderTimer } from '@/hooks/useOrderTimer'
import { resetOrderAlert } from '@/lib/sounds'
import { fetchActiveOrdersToday } from '@/lib/data/orders'
import type { ActiveOrder } from '@/store/pos-store'
import type { KitchenOrderStatus, Order } from '@/types'

type StatusFilter = 'all' | KitchenOrderStatus
type ViewMode = 'cards' | 'list'

const STATUS_OPTIONS: { value: StatusFilter; label: string; color?: 'amber' | 'blue' | 'green' | 'gray' }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente', color: 'amber' },
  { value: 'preparing', label: 'En préparation', color: 'blue' },
  { value: 'served', label: 'Remises', color: 'gray' },
]

const ORDER_TYPE_ICONS = {
  'dine-in': UtensilsCrossed,
  takeaway: ShoppingBag,
  delivery: Truck,
} as const

const STATUS_LABELS: Record<KitchenOrderStatus, string> = {
  pending: 'En attente',
  preparing: 'En préparation',
  ready: 'Prêt',
  served: 'Remise',
}

const STATUS_ROW_CLASSES: Record<KitchenOrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready: 'bg-green-100 text-green-700',
  served: 'bg-gray-200 text-gray-600',
}

/** Convertit un Order avec kitchenStatus en ActiveOrder pour l'interface cuisine. */
function orderToActiveOrder(
  order: Order & { kitchenStatus: KitchenOrderStatus; validatedAt: string; paidAt?: string | null; servedAt?: string | null }
): ActiveOrder & { paidAt?: string | null } {
  return {
    ...order,
    items: order.items.map((item, idx) => ({
      ...item,
      // `OrderItem` (types) n’a pas de champ `id`. On génère un id stable pour l’UI.
      // Priorité: menuItemId (stable) sinon fallback sur l’index.
      id: `${order.id}-item-${String((item as { menuItemId?: unknown }).menuItemId ?? idx)}`,
    })),
    validatedAt: order.validatedAt || order.createdAt,
    kitchenStatus: order.kitchenStatus || 'pending',
    servedAt: order.servedAt ?? undefined,
    status: order.status,
    paidAt: order.paidAt,
  } as ActiveOrder & { paidAt?: string | null }
}

export function ActiveOrdersModal() {
  const {
    activeOrdersModalOpen,
    closeActiveOrdersModal,
    activeOrders: storeActiveOrders,
    updateKitchenStatus,
    markOrderServed,
    getOverdueOrdersCount,
  } = usePosStore()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [selectedOrder, setSelectedOrder] = useState<ActiveOrder | null>(null)
  const [dbOrders, setDbOrders] = useState<ActiveOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  // Vérifier si on est en ligne
  const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine

  // Charger les commandes depuis la DB (seulement si en ligne)
  const loadDbOrders = useCallback(async () => {
    if (!activeOrdersModalOpen) return
    
    // Si hors ligne, ne pas essayer de charger depuis la DB
    if (!isOnline()) {
      setIsOffline(true)
      setLoading(false)
      return
    }

    setIsOffline(false)
    setLoading(true)
    try {
      const orders = await fetchActiveOrdersToday()
      // Convertir Order en ActiveOrder (les données sont déjà dans orders)
      const activeOrdersFromDb = orders.map(orderToActiveOrder)
      setDbOrders(activeOrdersFromDb)
    } catch (err) {
      console.warn('[ActiveOrdersModal] Error loading orders (will use local data):', err)
      // En cas d'erreur, on continue avec les données locales
      // Ne pas bloquer l'interface, juste marquer comme hors ligne
      setIsOffline(true)
      // Garder les données DB précédentes si disponibles
    } finally {
      setLoading(false)
    }
  }, [activeOrdersModalOpen])

  // Charger au montage et quand le modal s'ouvre
  useEffect(() => {
    if (activeOrdersModalOpen) {
      loadDbOrders()
      // Rafraîchir toutes les 10 secondes seulement si en ligne
      const interval = setInterval(() => {
        if (isOnline()) {
          loadDbOrders()
        }
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [activeOrdersModalOpen, loadDbOrders])

  // Écouter les changements de statut réseau
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      if (activeOrdersModalOpen) {
        loadDbOrders()
      }
    }
    const handleOffline = () => {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [activeOrdersModalOpen, loadDbOrders])

  // Fusionner les commandes du store (nouvelles / locales) avec celles de la DB.
  // Si hors ligne ou erreur, utiliser uniquement les données du store local.
  const allActiveOrders = useMemo(() => {
    // Si hors ligne ou pas de données DB, utiliser uniquement le store local
    if (isOffline || dbOrders.length === 0) {
      return storeActiveOrders
    }

    // Fusion simple: DB (source de vérité) + store (prioritaire si présence locale).
    // Les commandes annulées ne reviennent plus de la DB car `fetchActiveOrdersToday`
    // filtre déjà `status <> 'cancelled'`.
    const merged = new Map<string, ActiveOrder>()
    dbOrders.forEach((o) => merged.set(o.id, o))
    storeActiveOrders.forEach((o) => merged.set(o.id, o))
    return Array.from(merged.values())
  }, [storeActiveOrders, dbOrders, isOffline])

  const overdueCount = useMemo(() => {
    return allActiveOrders.filter((o) => {
      const timer = { isOverdue: false }
      try {
        const validatedAt = new Date(o.validatedAt || o.createdAt)
        const now = new Date()
        const diffMinutes = (now.getTime() - validatedAt.getTime()) / (1000 * 60)
        timer.isOverdue = diffMinutes > 30 && o.kitchenStatus !== 'served'
      } catch {
        // Ignore
      }
      return timer.isOverdue
    }).length
  }, [allActiveOrders])

  const filteredOrders = useMemo(() => {
    const list = statusFilter === 'all'
      ? [...allActiveOrders]
      : allActiveOrders.filter((o) => o.kitchenStatus === statusFilter)
    return list.sort((a, b) => {
      const aTime = new Date(a.validatedAt || a.createdAt).getTime()
      const bTime = new Date(b.validatedAt || b.createdAt).getTime()
      return aTime - bTime
    })
  }, [allActiveOrders, statusFilter])

  const handleCloseDetail = () => {
    setSelectedOrder(null)
  }

  const handleUpdateStatus = async (orderId: string, status: KitchenOrderStatus) => {
    updateKitchenStatus(orderId, status)
    // Rafraîchir après mise à jour seulement si en ligne
    if (isOnline()) {
      loadDbOrders().catch(() => {
        // Ignorer les erreurs, on continue avec les données locales
      })
    }
    if (selectedOrder?.id === orderId) handleCloseDetail()
  }

  const handleServe = async (orderId: string) => {
    updateKitchenStatus(orderId, 'served')
    resetOrderAlert(orderId)
    // Rafraîchir après mise à jour seulement si en ligne
    if (isOnline()) {
      loadDbOrders().catch(() => {
        // Ignorer les erreurs, on continue avec les données locales
      })
    }
    if (selectedOrder?.id === orderId) handleCloseDetail()
  }

  const handlePaymentComplete = async (orderId: string) => {
    markOrderServed(orderId)
    // Rafraîchir après mise à jour seulement si en ligne
    if (isOnline()) {
      loadDbOrders().catch(() => {
        // Ignorer les erreurs, on continue avec les données locales
      })
    }
    if (selectedOrder?.id === orderId) handleCloseDetail()
  }

  const renderCard = (order: ActiveOrder) => (
    <ActiveOrderCard
      key={order.id}
      order={order}
      onUpdateStatus={(status) => handleUpdateStatus(order.id, status)}
      onServe={() => handleServe(order.id)}
      onPaymentComplete={() => handlePaymentComplete(order.id)}
    />
  )

  if (!activeOrdersModalOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeActiveOrdersModal}
      />

      <div className="absolute inset-4 sm:inset-8 bg-gray-50 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F4A024] flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Commandes en cours</h2>
              <p className="text-sm text-gray-500">
                {allActiveOrders.length} commande{allActiveOrders.length > 1 ? 's' : ''} en cuisine
                {overdueCount > 0 && (
                  <span className="ml-2 text-red-600 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                    {overdueCount} en retard
                  </span>
                )}
                {isOffline && (
                  <span className="ml-2 text-amber-600 font-medium">
                    <WifiOff className="w-3.5 h-3.5 inline mr-1" />
                    Mode hors ligne
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadDbOrders}
              disabled={loading || isOffline}
              className="text-gray-500 hover:text-gray-900"
              title={isOffline ? 'Hors ligne - Utilisation des données locales' : 'Rafraîchir'}
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeActiveOrdersModal}
              className="text-gray-500 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Fermer</span>
            </Button>
          </div>
        </div>

        {/* Filtres + vue */}
        <div className="flex flex-wrap items-center gap-2 p-4 bg-white border-b border-gray-200">
          <div className="flex gap-2 overflow-x-auto flex-1 min-w-0">
            {STATUS_OPTIONS.map((opt) => {
              const count = opt.value === 'all'
                ? allActiveOrders.length
                : allActiveOrders.filter((o) => o.kitchenStatus === opt.value).length
              return (
                <StatusTab
                  key={opt.value}
                  label={opt.label}
                  count={count}
                  active={statusFilter === opt.value}
                  color={opt.color}
                  onClick={() => setStatusFilter(opt.value)}
                />
              )
            })}
          </div>
          <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'cards' ? 'bg-white shadow text-[#F4A024]' : 'text-gray-500 hover:text-gray-700'
              )}
              title="Vue cartes"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-white shadow text-[#F4A024]' : 'text-gray-500 hover:text-gray-700'
              )}
              title="Vue liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading && dbOrders.length === 0 && !isOffline ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-500">Chargement des commandes...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ChefHat className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {statusFilter === 'all' ? 'Aucune commande en cours' : 'Aucune commande pour ce filtre'}
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                {statusFilter === 'all'
                  ? 'Les nouvelles commandes validées apparaîtront ici automatiquement.'
                  : 'Changez de filtre ou validez une nouvelle commande.'}
              </p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOrders.map((order) => renderCard(order))}
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredOrders.map((order) => (
                <OrderListRow
                  key={order.id}
                  order={order}
                  onUpdateStatus={(status) => handleUpdateStatus(order.id, status)}
                  onServe={() => handleServe(order.id)}
                  onPaymentComplete={() => handlePaymentComplete(order.id)}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal détail (vue liste) — fermeture auto au clic sur une action */}
      {selectedOrder && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseDetail}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {selectedOrder.tableNumber ? `Table ${selectedOrder.tableNumber}` : 'Détail commande'}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleCloseDetail} className="text-gray-500">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <ActiveOrderCard
                order={selectedOrder}
                onUpdateStatus={(status) => handleUpdateStatus(selectedOrder.id, status)}
                onServe={() => handleServe(selectedOrder.id)}
                onPaymentComplete={() => handlePaymentComplete(selectedOrder.id)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface OrderListRowProps {
  order: ActiveOrder
  onUpdateStatus: (status: KitchenOrderStatus) => void
  onServe: () => void
  onPaymentComplete: () => void
  onClick: () => void
}

function OrderListRow({ order, onUpdateStatus, onServe, onPaymentComplete, onClick }: OrderListRowProps) {
  const timer = useOrderTimer(order.validatedAt || order.createdAt, order.servedAt)
  const TypeIcon = ORDER_TYPE_ICONS[order.type]
  const status = order.kitchenStatus
  const statusLabel = STATUS_LABELS[status]
  const statusClass = STATUS_ROW_CLASSES[status]

  const getActionButton = () => {
    // Ne pas afficher le bouton "Facturer" si la commande est déjà payée
    const isPaid = (order as any).paidAt != null
    
    switch (status) {
      case 'pending':
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onUpdateStatus('preparing')
            }}
            className="text-xs px-2 py-1"
          >
            Commencer
          </Button>
        )
      case 'preparing':
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onServe()
            }}
            className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700"
          >
            Remise
          </Button>
        )
      case 'ready':
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onServe()
            }}
            className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700"
          >
            Remise
          </Button>
        )
      case 'served':
        // Ne pas afficher le bouton si déjà payée
        if (isPaid) {
          return (
            <span className="text-xs text-gray-500 px-2 py-1">Payée</span>
          )
        }
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onPaymentComplete()
            }}
            className="text-xs px-2 py-1"
          >
            Facturer
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <li>
      <div
        className={cn(
          'w-full flex items-center justify-between gap-4 p-3 rounded-lg border bg-white transition-colors',
          timer.isOverdue && status !== 'served' && 'border-red-200 bg-red-50/50'
        )}
      >
        <button
          type="button"
          onClick={onClick}
          className="flex items-center gap-3 min-w-0 flex-1 text-left"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <TypeIcon className="w-4 h-4 text-gray-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {order.tableNumber ? `Table ${order.tableNumber}` : order.type === 'dine-in' ? 'Sur place' : order.type === 'takeaway' ? 'À emporter' : 'Livraison'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusClass)}>
                {statusLabel}
              </span>
              <span className={cn('flex items-center gap-1 text-xs font-mono', timer.isOverdue && status !== 'served' ? 'text-red-600' : 'text-gray-500')}>
                <Clock className="w-3 h-3" />
                {timer.formatted}
              </span>
            </div>
          </div>
        </button>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="font-bold text-[#F4A024]">{formatPrice(order.total)}</p>
            <p className="text-xs text-gray-500">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
          </div>
          {getActionButton()}
        </div>
      </div>
    </li>
  )
}

interface StatusTabProps {
  label: string
  count: number
  active: boolean
  color?: 'amber' | 'blue' | 'green' | 'gray'
  onClick: () => void
}

function StatusTab({ label, count, active, color, onClick }: StatusTabProps) {
  const colorClasses: Record<string, string> = {
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    gray: 'bg-gray-200 text-gray-600',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
        active ? 'bg-[#F4A024] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
    >
      {label}
      <span
        className={cn(
          'text-xs px-1.5 py-0.5 rounded-full',
          active ? 'bg-white/20 text-white' : color ? colorClasses[color] : 'bg-gray-200 text-gray-600'
        )}
      >
        {count}
      </span>
    </button>
  )
}
