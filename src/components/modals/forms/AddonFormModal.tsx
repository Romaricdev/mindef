'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { Addon, AddonCategoryOption, Category } from '@/types'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface AddonFormData {
  name: string
  price: number
  available: boolean
}

export interface AddonCategoryOptionForm {
  categoryId: string
  includedFree: boolean
  extraPrice: number | null
}

interface AddonFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  addon: Addon | null
  categories: Category[]
  existingOptions: AddonCategoryOption[]
  onSubmit: (data: AddonFormData, categoryOptions: AddonCategoryOptionForm[]) => void
}

export function AddonFormModal({
  open,
  onOpenChange,
  addon,
  categories,
  existingOptions,
  onSubmit,
}: AddonFormModalProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [available, setAvailable] = useState(true)
  const [categoryOpts, setCategoryOpts] = useState<Map<string, { includedFree: boolean; extraPrice: string }>>(new Map())
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const isEditing = !!addon

  useEffect(() => {
    if (!open) return
    if (addon) {
      setName(addon.name)
      setPrice(addon.price.toString())
      setAvailable(addon.available)
      const map = new Map<string, { includedFree: boolean; extraPrice: string }>()
      for (const c of categories) {
        const opt = existingOptions.find((o) => o.addonId === addon.id && o.categoryId === c.id)
        if (opt) {
          map.set(c.id, {
            includedFree: opt.includedFree,
            extraPrice: opt.extraPrice != null ? opt.extraPrice.toString() : '',
          })
        }
      }
      setCategoryOpts(map)
    } else {
      setName('')
      setPrice('')
      setAvailable(true)
      setCategoryOpts(new Map())
    }
    setErrors({})
  }, [addon, categories, existingOptions, open])

  const toggleCategory = (categoryId: string) => {
    setCategoryOpts((prev) => {
      const next = new Map(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.set(categoryId, { includedFree: false, extraPrice: '' })
      }
      return next
    })
  }

  const setCategoryIncludedFree = (categoryId: string, value: boolean) => {
    setCategoryOpts((prev) => {
      const next = new Map(prev)
      const cur = next.get(categoryId) ?? { includedFree: false, extraPrice: '' }
      next.set(categoryId, { ...cur, includedFree: value })
      return next
    })
  }

  const setCategoryExtraPrice = (categoryId: string, value: string) => {
    setCategoryOpts((prev) => {
      const next = new Map(prev)
      const cur = next.get(categoryId) ?? { includedFree: false, extraPrice: '' }
      next.set(categoryId, { ...cur, extraPrice: value })
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, boolean> = {}
    if (!name.trim()) newErrors.name = true
    const priceNum = parseFloat(price)
    if (Number.isNaN(priceNum) || priceNum < 0) newErrors.price = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const categoryOptions: AddonCategoryOptionForm[] = Array.from(categoryOpts.entries()).map(
      ([categoryId, v]) => ({
        categoryId,
        includedFree: v.includedFree,
        extraPrice: v.extraPrice.trim() === '' ? null : parseFloat(v.extraPrice) || null,
      })
    )

    onSubmit(
      { name: name.trim(), price: priceNum, available },
      categoryOptions
    )
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier l\'addon' : 'Ajouter un addon'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {isEditing
                  ? 'Modifiez l\'addon et sa configuration par catégorie'
                  : 'Créez un supplément et définissez les catégories concernées'}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Infos de base */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Mayonnaise"
                    error={errors.name}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Prix par défaut (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    error={errors.price}
                  />
                  <p className="text-xs text-gray-500">
                    Utilisé pour le supplément si aucun prix spécifique n’est défini par catégorie.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="rounded border-gray-300 text-[#F4A024] focus:ring-[#F4A024]"
                  />
                  <span className="text-sm font-medium text-gray-700">Disponible</span>
                </label>
              </div>

              {/* Configuration par catégorie */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800">Configuration par catégorie</h4>
                <p className="text-xs text-gray-500">
                  Cochez les catégories pour lesquelles cet addon est proposé. Vous pouvez définir
                  « Inclus gratuit » et un « Prix supplément » spécifique par catégorie.
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {categories.map((cat) => {
                    const selected = categoryOpts.has(cat.id)
                    const opt = categoryOpts.get(cat.id)
                    return (
                      <div
                        key={cat.id}
                        className={cn(
                          'rounded-lg border p-3 space-y-2 transition-colors',
                          selected ? 'border-[#F4A024]/50 bg-[#F4A024]/5' : 'border-gray-200 bg-gray-50/50'
                        )}
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleCategory(cat.id)}
                            className="rounded border-gray-300 text-[#F4A024] focus:ring-[#F4A024]"
                          />
                          <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                        </label>
                        {selected && opt && (
                          <div className="pl-6 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={opt.includedFree}
                                onChange={(e) => setCategoryIncludedFree(cat.id, e.target.checked)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="text-xs text-gray-600">Inclus gratuit (optionnel)</span>
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                              <label className="text-xs text-gray-600 whitespace-nowrap">
                                Prix supplément (FCFA):
                              </label>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                value={opt.extraPrice}
                                onChange={(e) => setCategoryExtraPrice(cat.id, e.target.value)}
                                placeholder="défaut"
                                className="h-8 text-sm max-w-28"
                              />
                              <span className="text-xs text-gray-500">vide = prix par défaut</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary" size="sm">
                  Annuler
                </Button>
              </Dialog.Close>
              <Button type="submit" variant="primary" size="sm">
                {isEditing ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
