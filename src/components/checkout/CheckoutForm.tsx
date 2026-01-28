'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart-store'
import { Card, Input } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import { useAppSettings } from '@/hooks'
import { User, Phone, Mail, Truck, Package } from 'lucide-react'

export function CheckoutForm() {
  const {
    customerInfo,
    orderType,
    includeDelivery,
    setCustomerInfo,
    setOrderType,
    setIncludeDelivery,
  } = useCartStore()
  const { deliveryFee } = useAppSettings()

  const [name, setName] = useState(customerInfo?.name || '')
  const [phone, setPhone] = useState(customerInfo?.phone || '')
  const [email, setEmail] = useState(customerInfo?.email || '')

  // Update store when form values change
  useEffect(() => {
    setCustomerInfo({
      name,
      phone,
      email: email || undefined,
    })
  }, [name, phone, email, setCustomerInfo])

  return (
    <Card variant="site" padding="lg" className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
        Informations de facturation
      </h2>

      <div className="space-y-6 sm:space-y-8">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom complet"
              className="pl-12 h-12 sm:h-14 text-base"
              required
            />
          </div>
        </div>

        {/* Telephone */}
        <div>
          <label htmlFor="phone" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+237 6XX XXX XXX"
              className="pl-12 h-12 sm:h-14 text-base"
              required
            />
          </div>
        </div>

        {/* Email (optionnel) */}
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Email <span className="text-gray-400 text-xs">(optionnel)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="pl-12 h-12 sm:h-14 text-base"
            />
          </div>
        </div>

        {/* Type de commande */}
        <div className="pt-6 sm:pt-8 border-t border-gray-200">
          <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-4 sm:mb-6">
            Type de commande
          </label>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => {
                setOrderType('dine-in')
                setIncludeDelivery(false)
              }}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                orderType === 'dine-in'
                  ? 'border-[#F4A024] bg-[#F4A024]/10 text-[#F4A024]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Sur place</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderType('takeaway')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                orderType === 'takeaway'
                  ? 'border-[#F4A024] bg-[#F4A024]/10 text-[#F4A024]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Truck className="w-5 h-5" />
              <span className="font-medium">A emporter</span>
            </button>
          </div>
        </div>

        {/* Option livraison (uniquement pour commandes a emporter) */}
        {orderType === 'takeaway' && (
          <div className="pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={includeDelivery}
                  onChange={(e) => setIncludeDelivery(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 border-2 border-gray-300 rounded-md peer-checked:border-[#F4A024] peer-checked:bg-[#F4A024] transition-colors flex items-center justify-center">
                  {includeDelivery && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Livraison a domicile</span>
                  <span className="text-sm font-semibold text-[#F4A024]">
                    +{formatPrice(deliveryFee, 'XAF').replace('XAF', 'FCFA')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Faites-vous livrer votre commande directement chez vous
                </p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Champs obligatoires notice */}
      <p className="text-xs text-gray-500 mt-4">
        <span className="text-red-500">*</span> Champs obligatoires
      </p>
    </Card>
  )
}
