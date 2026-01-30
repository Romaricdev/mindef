'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Plus, Minus, Check, Utensils } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui'
import { BaseModal } from '@/components/modals/BaseModal'
import { useAddonsWithCategoryOptions } from '@/hooks'
import type { MenuItem, AddonWithCategoryOption, OrderItemAddon } from '@/types'

interface TableAddonSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: MenuItem | null
  onConfirm: (addons: OrderItemAddon[]) => void
}

export function TableAddonSelectorModal({
  open,
  onOpenChange,
  product,
  onConfirm,
}: TableAddonSelectorModalProps) {
  const [includedAddons, setIncludedAddons] = useState<Set<string>>(new Set())
  const [extraQuantities, setExtraQuantities] = useState<Map<string, number>>(new Map())

  const categoryId = product?.categoryId ?? null
  const { data: options, loading: optionsLoading } = useAddonsWithCategoryOptions(categoryId)

  useEffect(() => {
    if (open) {
      setIncludedAddons(new Set())
      setExtraQuantities(new Map())
    }
  }, [open])

  const toggleIncluded = (addonId: string) => {
    setIncludedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(addonId)) next.delete(addonId)
      else next.add(addonId)
      return next
    })
  }

  const changeExtraQty = (addonId: string, delta: number) => {
    setExtraQuantities((prev) => {
      const next = new Map(prev)
      const cur = next.get(addonId) ?? 0
      const n = Math.max(0, cur + delta)
      if (n === 0) next.delete(addonId)
      else next.set(addonId, n)
      return next
    })
  }

  const addonsToSubmit = useMemo((): OrderItemAddon[] => {
    if (!product) return []
    const list: OrderItemAddon[] = []
    for (const { addon, includedFree, extraPrice } of options) {
      if (includedFree && includedAddons.has(addon.id)) {
        list.push({
          addonId: addon.id,
          type: 'included',
          name: addon.name,
          price: 0,
          quantity: 1,
        })
      }
      const qty = extraQuantities.get(addon.id) ?? 0
      if (qty > 0) {
        list.push({
          addonId: addon.id,
          type: 'extra',
          name: addon.name,
          price: extraPrice ?? addon.price,
          quantity: qty,
        })
      }
    }
    return list
  }, [product, options, includedAddons, extraQuantities])

  const totalAddonsPrice = addonsToSubmit.reduce(
    (sum, a) => sum + a.price * a.quantity,
    0
  )
  const calculateTotal = () => (product?.price ?? 0) + totalAddonsPrice

  const hasAnySelection =
    includedAddons.size > 0 || Array.from(extraQuantities.values()).some((q) => q > 0)

  const handleAdd = () => {
    onConfirm(addonsToSubmit)
    onOpenChange(false)
  }

  const handleAddWithoutAddons = () => {
    onConfirm([])
    onOpenChange(false)
  }

  if (!product) return null

  const productImage = product.image || ''

  return (
    <BaseModal
      open={open}
      onOpenChange={(o) => !o && onOpenChange(false)}
      title={`Ajouter : ${product.name}`}
      maxWidth="md"
      footer={
        <div className="flex gap-2 w-full">
          <Button
            variant="secondary"
            onClick={handleAddWithoutAddons}
            className="flex-1"
          >
            Sans supplément
          </Button>
          <Button
            variant="primary"
            onClick={handleAdd}
            className="flex-1 gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter - {formatPrice(calculateTotal())}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {productImage ? (
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized={/supabase\.co\/storage/i.test(productImage)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Utensils className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-gray-900 font-medium truncate">{product.name}</h4>
            <p className="text-[#F4A024] font-bold">{formatPrice(product.price)}</p>
          </div>
        </div>

        {optionsLoading ? (
          <div className="text-center py-6 text-gray-500">
            <span className="inline-block w-5 h-5 border-2 border-[#F4A024] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Chargement des suppléments…</p>
          </div>
        ) : options.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Options et suppléments
            </h3>
            <div className="space-y-2">
              {options.map((opt) => (
                <TableAddonRow
                  key={opt.addon.id}
                  opt={opt}
                  included={includedAddons.has(opt.addon.id)}
                  extraQty={extraQuantities.get(opt.addon.id) ?? 0}
                  onToggleIncluded={() => toggleIncluded(opt.addon.id)}
                  onExtraDelta={(d) => changeExtraQty(opt.addon.id, d)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>Aucun supplément disponible pour ce produit</p>
          </div>
        )}

        {hasAnySelection && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Produit</span>
              <span>{formatPrice(product.price)}</span>
            </div>
            {addonsToSubmit.map((a) => (
              <div
                key={`${a.addonId}-${a.type}`}
                className="flex items-center justify-between text-sm text-gray-600"
              >
                <span>
                  + {a.name}
                  {a.type === 'included' ? ' (inclus)' : a.quantity > 1 ? ` × ${a.quantity}` : ''}
                </span>
                <span>
                  {a.price === 0 ? 'Gratuit' : formatPrice(a.price * a.quantity)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-[#F4A024]">{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}

function TableAddonRow({
  opt,
  included,
  extraQty,
  onToggleIncluded,
  onExtraDelta,
}: {
  opt: AddonWithCategoryOption
  included: boolean
  extraQty: number
  onToggleIncluded: () => void
  onExtraDelta: (delta: number) => void
}) {
  const { addon, includedFree } = opt
  const extraPrice = opt.extraPrice ?? addon.price

  return (
    <div className="p-3 rounded-lg border border-gray-200 bg-white space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-gray-900 font-medium">{addon.name}</span>
        {includedFree && (
          <button
            type="button"
            onClick={onToggleIncluded}
            className={cn(
              'flex items-center gap-2 rounded-md px-2.5 py-1 text-sm transition-colors',
              included
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            )}
          >
            <div
              className={cn(
                'w-4 h-4 rounded border flex items-center justify-center',
                included ? 'bg-green-600 border-green-600' : 'border-gray-400'
              )}
            >
              {included && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
            <span>Inclus</span>
            <span className="text-xs opacity-80">(gratuit)</span>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-gray-500">Supplément</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onExtraDelta(-1)}
            disabled={extraQty === 0}
            className={cn(
              'w-8 h-8 rounded border flex items-center justify-center transition-colors',
              extraQty === 0
                ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 hover:bg-gray-100 text-gray-700'
            )}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-medium text-gray-900">
            {extraQty}
          </span>
          <button
            type="button"
            onClick={() => onExtraDelta(1)}
            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <span
            className={cn(
              'text-sm font-semibold ml-1',
              extraPrice > 0 ? 'text-[#F4A024]' : 'text-green-600'
            )}
          >
            {extraPrice > 0 ? `+${formatPrice(extraPrice)}/u` : 'Gratuit'}
          </span>
        </div>
      </div>
    </div>
  )
}
