'use client'

import { useState } from 'react'
import { BaseModal } from '@/components/modals'
import { Button, Input } from '@/components/ui'
import { formatPrice, cn } from '@/lib/utils'
import { ShoppingBag, Truck, User, Phone, MapPin } from 'lucide-react'
import { usePosStore } from '@/store/pos-store'

interface NewOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewOrderModal({ open, onOpenChange }: NewOrderModalProps) {
  const { createTakeawayDeliveryOrder, defaultDeliveryFee, setDefaultDeliveryFee } = usePosStore()

  const [orderType, setOrderType] = useState<'takeaway' | 'delivery'>('takeaway')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [deliveryFee, setDeliveryFee] = useState(defaultDeliveryFee)
  const [error, setError] = useState('')

  const handleCreate = () => {
    if (!customerName.trim()) {
      setError('Veuillez entrer le nom du client')
      return
    }
    if (!customerPhone.trim()) {
      setError('Veuillez entrer le numéro de téléphone')
      return
    }
    if (orderType === 'delivery' && !customerAddress.trim()) {
      setError('Veuillez entrer l\'adresse de livraison')
      return
    }

    // Create the order
    createTakeawayDeliveryOrder(
      orderType,
      customerName.trim(),
      customerPhone.trim(),
      orderType === 'delivery' ? customerAddress.trim() : undefined
    )

    // Update default delivery fee if changed
    if (orderType === 'delivery' && deliveryFee !== defaultDeliveryFee) {
      setDefaultDeliveryFee(deliveryFee)
    }

    // Reset and close
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setOrderType('takeaway')
    setCustomerName('')
    setCustomerPhone('')
    setCustomerAddress('')
    setDeliveryFee(defaultDeliveryFee)
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      title="Nouvelle commande"
      description="Commande téléphone ou en personne"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Order Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Type de commande
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setOrderType('takeaway')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2',
                orderType === 'takeaway'
                  ? 'border-[#F4A024] bg-[#F4A024]/10'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <ShoppingBag className={cn('w-8 h-8', orderType === 'takeaway' ? 'text-[#F4A024]' : 'text-gray-400')} />
              <span className={cn('text-sm font-medium', orderType === 'takeaway' ? 'text-[#F4A024]' : 'text-gray-600')}>
                À emporter
              </span>
              <span className="text-xs text-gray-500">Le client vient chercher</span>
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2',
                orderType === 'delivery'
                  ? 'border-[#F4A024] bg-[#F4A024]/10'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <Truck className={cn('w-8 h-8', orderType === 'delivery' ? 'text-[#F4A024]' : 'text-gray-400')} />
              <span className={cn('text-sm font-medium', orderType === 'delivery' ? 'text-[#F4A024]' : 'text-gray-600')}>
                Livraison
              </span>
              <span className="text-xs text-gray-500">Livré à domicile</span>
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du client <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <User className="w-4 h-4" />
              </div>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value)
                  setError('')
                }}
                placeholder="Nom complet"
                className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Phone className="w-4 h-4" />
              </div>
              <Input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value)
                  setError('')
                }}
                placeholder="+237 6XX XXX XXX"
                className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {orderType === 'delivery' && (
            <>
              <div>
                <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse de livraison <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
                  <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <Input
                    id="customerAddress"
                    value={customerAddress}
                    onChange={(e) => {
                      setCustomerAddress(e.target.value)
                      setError('')
                    }}
                    placeholder="Quartier, rue, repère..."
                    className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <label htmlFor="deliveryFee" className="block text-sm font-semibold text-blue-900 mb-2">
                  Frais de livraison
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-32"
                    min={0}
                    step={500}
                  />
                  <span className="text-sm text-blue-700">FCFA</span>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Ce montant sera ajouté au total de la commande
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Summary */}
        {orderType === 'delivery' && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Frais de livraison inclus:</span>
              <span className="font-bold text-[#F4A024]">{formatPrice(deliveryFee)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            className="flex-1"
          >
            Créer la commande
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
