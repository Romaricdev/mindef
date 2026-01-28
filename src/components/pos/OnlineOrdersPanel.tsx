'use client'

import { Clock, User, Phone, Package, ChefHat, CheckCircle, Truck } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { Button, Badge } from '@/components/ui'
import { usePosStore } from '@/store/pos-store'
import type { Order, OrderStatus } from '@/types'

interface OnlineOrdersPanelProps {
  orders: Order[]
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
}

export function OnlineOrdersPanel({ orders, onUpdateStatus }: OnlineOrdersPanelProps) {
  const { acceptOnlineOrderToKitchen } = usePosStore()

  const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
    pending: {
      label: 'Nouvelle',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      icon: Clock,
    },
    confirmed: {
      label: 'En cuisine',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      icon: ChefHat,
    },
    preparing: {
      label: 'En préparation',
      color: 'text-[#F4A024]',
      bgColor: 'bg-[#F4A024]/20',
      icon: ChefHat,
    },
    ready: {
      label: 'Prête',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      icon: Package,
    },
  }

  const handleAcceptOrder = (orderId: string) => {
    acceptOnlineOrderToKitchen(orderId)
  }

  // Filter only online orders (takeaway/delivery) that are active
  const onlineOrders = orders.filter(
    order =>
      (order.type === 'takeaway' || order.type === 'delivery') &&
      ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
  )

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: Record<string, OrderStatus> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
    }
    return flow[currentStatus] || null
  }

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    const labels: Record<string, string> = {
      pending: 'Confirmer',
      confirmed: 'En préparation',
      preparing: 'Prête',
      ready: 'Remise',
    }
    return labels[currentStatus] || ''
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (onlineOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Package className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 text-sm font-medium">Aucune commande en ligne</p>
        <p className="text-gray-500 text-xs mt-1">Les nouvelles commandes apparaîtront ici</p>
      </div>
    )
  }

  return (
    <div className="p-3 space-y-2 overflow-y-auto">
      {onlineOrders.map((order) => {
        const config = statusConfig[order.status]
        const StatusIcon = config?.icon || Clock
        const nextStatus = getNextStatus(order.status)

        return (
          <div
            key={order.id}
            className={cn(
              'p-3 rounded-lg border border-gray-200 bg-white',
              'transition-all duration-200 hover:border-[#F4A024] hover:shadow-sm'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-900 text-sm">
                  {order.id}
                </span>
                <Badge className={cn('text-[10px]', config?.bgColor, config?.color)}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config?.label}
                </Badge>
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(order.createdAt)}
              </span>
            </div>

            {/* Customer info */}
            {order.customerName && (
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {order.customerName}
                </span>
                {order.customerPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {order.customerPhone}
                  </span>
                )}
              </div>
            )}

            {/* Items summary */}
            <div className="text-xs text-gray-600 mb-2">
              {order.items.slice(0, 2).map((item, idx) => (
                <span key={idx}>
                  {item.quantity}x {item.name}
                  {idx < Math.min(order.items.length, 2) - 1 && ', '}
                </span>
              ))}
              {order.items.length > 2 && (
                <span className="text-gray-500"> +{order.items.length - 2} autres</span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-[#F4A024] font-bold text-sm">
                  {formatPrice(order.total)}
                </span>
                {order.type === 'delivery' && (
                  <Badge className="text-[9px] bg-blue-100 text-blue-700">
                    <Truck className="w-2.5 h-2.5 mr-0.5" />
                    Livraison
                  </Badge>
                )}
              </div>
              {order.status === 'pending' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAcceptOrder(order.id as string)}
                  className="text-xs h-7 px-3"
                >
                  Accepter → Cuisine
                </Button>
              ) : nextStatus && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onUpdateStatus(order.id as string, nextStatus)}
                  className="text-xs h-7 px-3"
                >
                  {getNextStatusLabel(order.status)}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
