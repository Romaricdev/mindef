'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Store, ShoppingBag, Truck } from 'lucide-react'
import { Order, OrderStatus } from '@/types'
import { Button, Select, Badge } from '@/components/ui'

interface OrderStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onSubmit: (orderId: string | number, newStatus: OrderStatus) => void
}

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'ready', label: 'Prête' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
]

const statusConfig: Record<OrderStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'error' }> = {
  pending: { label: 'En attente', variant: 'warning' },
  confirmed: { label: 'Confirmée', variant: 'info' },
  preparing: { label: 'En préparation', variant: 'info' },
  ready: { label: 'Prête', variant: 'success' },
  delivered: { label: 'Livrée', variant: 'success' },
  cancelled: { label: 'Annulée', variant: 'error' },
}

const typeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  'dine-in': { label: 'Sur place', icon: Store },
  'takeaway': { label: 'À emporter', icon: ShoppingBag },
  'delivery': { label: 'Livraison', icon: Truck },
}

export function OrderStatusModal({
  open,
  onOpenChange,
  order,
  onSubmit,
}: OrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pending')

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status)
    }
  }, [order, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (order) {
      onSubmit(order.id, selectedStatus)
      onOpenChange(false)
    }
  }

  if (!order) return null

  const TypeIcon = typeConfig[order.type]?.icon || Store

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                Modifier le statut
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                Commande {String(order.id)}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {typeConfig[order.type]?.label}
                    </span>
                  </div>
                  <Badge variant={statusConfig[order.status].variant}>
                    {statusConfig[order.status].label}
                  </Badge>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm font-medium text-gray-900">
                    {order.customerName || `Table ${order.tableNumber}`}
                  </p>
                  {order.customerPhone && (
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-500 mb-2">Articles:</p>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold text-[#F4A024]">
                    {order.total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nouveau statut
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                  options={statusOptions}
                  placeholder="Sélectionner un statut..."
                />
              </div>

              {/* Status Change Preview */}
              {selectedStatus !== order.status && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={statusConfig[order.status].variant}>
                    {statusConfig[order.status].label}
                  </Badge>
                  <span className="text-gray-400">→</span>
                  <Badge variant={statusConfig[selectedStatus].variant}>
                    {statusConfig[selectedStatus].label}
                  </Badge>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary" size="sm">
                  Annuler
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={selectedStatus === order.status}
              >
                Mettre à jour
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
