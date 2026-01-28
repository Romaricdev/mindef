'use client'

import { useState } from 'react'
import { BaseModal } from '@/components/modals'
import { Button, Input } from '@/components/ui'
import { formatPrice, cn } from '@/lib/utils'
import { Banknote, CreditCard, Smartphone, CheckCircle } from 'lucide-react'
import type { PaymentMethod } from '@/types'

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onPaymentComplete: (method: PaymentMethod, amountReceived?: number, change?: number) => void
}

export function PaymentModal({
  open,
  onOpenChange,
  total,
  onPaymentComplete,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [amountReceived, setAmountReceived] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setAmountReceived('')
    setError('')
  }

  const calculateChange = () => {
    if (!amountReceived) return 0
    const received = parseFloat(amountReceived)
    if (isNaN(received) || received < total) return 0
    return received - total
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      setError('Veuillez sélectionner un mode de paiement')
      return
    }

    if (selectedMethod === 'cash') {
      const received = parseFloat(amountReceived)
      if (isNaN(received) || received < total) {
        setError('Le montant reçu doit être supérieur ou égal au total')
        return
      }
      const change = received - total

      // Show success animation first
      setShowSuccess(true)
      setTimeout(() => {
        onPaymentComplete('cash', received, change)
        // Reset after callback
        setShowSuccess(false)
        setSelectedMethod(null)
        setAmountReceived('')
        setError('')
        onOpenChange(false)
      }, 1200)
    } else {
      // Show success animation first
      setShowSuccess(true)
      setTimeout(() => {
        onPaymentComplete(selectedMethod)
        // Reset after callback
        setShowSuccess(false)
        setSelectedMethod(null)
        setAmountReceived('')
        setError('')
        onOpenChange(false)
      }, 1200)
    }
  }

  const handleClose = () => {
    if (showSuccess) return // Don't close during success animation
    setSelectedMethod(null)
    setAmountReceived('')
    setError('')
    onOpenChange(false)
  }

  const change = calculateChange()

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      title={showSuccess ? "" : "Paiement"}
      description={showSuccess ? "" : `Total à payer: ${formatPrice(total)}`}
      maxWidth="sm"
    >
      {/* Success Animation */}
      {showSuccess ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-700 mb-2">Paiement réussi !</h3>
          <p className="text-gray-500 text-sm">Ouverture de la facture pour impression…</p>
        </div>
      ) : (
      <div className="space-y-6">
        {/* Payment methods */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Mode de paiement
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleMethodSelect('cash')}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                ${selectedMethod === 'cash'
                  ? 'border-[#F4A024] bg-[#F4A024]/10'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <Banknote className={cn('w-6 h-6', selectedMethod === 'cash' ? 'text-[#F4A024]' : 'text-gray-400')} />
              <span className={cn('text-sm font-medium', selectedMethod === 'cash' ? 'text-[#F4A024]' : 'text-gray-600')}>
                Cash
              </span>
            </button>
            <button
              onClick={() => handleMethodSelect('mobile')}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                ${selectedMethod === 'mobile'
                  ? 'border-[#F4A024] bg-[#F4A024]/10'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <Smartphone className={cn('w-6 h-6', selectedMethod === 'mobile' ? 'text-[#F4A024]' : 'text-gray-400')} />
              <span className={cn('text-sm font-medium', selectedMethod === 'mobile' ? 'text-[#F4A024]' : 'text-gray-600')}>
                Mobile Money
              </span>
            </button>
            <button
              onClick={() => handleMethodSelect('card')}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                ${selectedMethod === 'card'
                  ? 'border-[#F4A024] bg-[#F4A024]/10'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <CreditCard className={cn('w-6 h-6', selectedMethod === 'card' ? 'text-[#F4A024]' : 'text-gray-400')} />
              <span className={cn('text-sm font-medium', selectedMethod === 'card' ? 'text-[#F4A024]' : 'text-gray-600')}>
                Carte
              </span>
            </button>
          </div>
        </div>

        {/* Cash payment fields */}
        {selectedMethod === 'cash' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label htmlFor="amountReceived" className="block text-sm font-semibold text-gray-900 mb-2">
                Montant reçu
              </label>
              <Input
                id="amountReceived"
                type="number"
                value={amountReceived}
                onChange={(e) => {
                  setAmountReceived(e.target.value)
                  setError('')
                }}
                placeholder="0"
                className="w-full text-lg"
                min={total}
                step="100"
              />
            </div>

            {change > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Reçu</span>
                  <span className="font-semibold text-gray-900">{formatPrice(parseFloat(amountReceived) || 0)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Monnaie à rendre</span>
                  <span className="text-lg font-bold text-[#F4A024]">{formatPrice(change)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
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
            onClick={handlePayment}
            disabled={!selectedMethod || (selectedMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < total))}
            className="flex-1"
          >
            Valider le paiement
          </Button>
        </div>
      </div>
      )}
    </BaseModal>
  )
}
