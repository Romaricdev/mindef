'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus, Trash2 } from 'lucide-react'
import { Menu, MenuProduct, MenuItem } from '@/types'
import { Button, Input, Textarea, Select } from '@/components/ui'

interface MenuFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menu?: Menu | null
  menuItems: MenuItem[]
  onSubmit: (data: Partial<Menu>) => void
}

const typeOptions = [
  { value: 'predefined', label: 'Menu prédéfini' },
  { value: 'daily', label: 'Menu du jour' },
]

interface ProductSelection extends MenuProduct {
  product?: MenuItem
}

const initialFormData = {
  name: '',
  description: '',
  type: 'predefined' as 'predefined' | 'daily',
  active: true,
  products: [] as ProductSelection[],
}

export function MenuFormModal({
  open,
  onOpenChange,
  menu,
  menuItems,
  onSubmit,
}: MenuFormModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [selectedProductId, setSelectedProductId] = useState('')

  const isEditing = !!menu

  useEffect(() => {
    if (menu) {
      const productsWithDetails = menu.products.map((p) => ({
        ...p,
        product: menuItems.find((item) => item.id === p.productId),
      }))
      setFormData({
        name: menu.name,
        description: menu.description || '',
        type: menu.type,
        active: menu.active,
        products: productsWithDetails,
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
    setSelectedProductId('')
  }, [menu, menuItems, open])

  const availableProducts = menuItems.filter(
    (item) =>
      !formData.products.some((p) => p.productId === item.id) && item.available
  )

  const productOptions = availableProducts.map((item) => ({
    value: String(item.id),
    label: `${item.name} - ${item.price.toLocaleString('fr-FR')} FCFA`,
  }))

  const addProduct = () => {
    if (!selectedProductId) return

    const product = menuItems.find((item) => String(item.id) === selectedProductId)
    if (!product) return

    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          productId: product.id,
          product,
        },
      ],
    }))
    setSelectedProductId('')
  }

  const removeProduct = (productId: string | number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.productId !== productId),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, boolean> = {}
    if (!formData.name.trim()) newErrors.name = true
    if (formData.products.length === 0) newErrors.products = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
      active: formData.active,
      products: formData.products.map((p) => ({ productId: p.productId })),
    })

    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier le menu' : 'Créer un menu'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {isEditing
                  ? 'Modifiez la composition du menu'
                  : 'Composez un nouveau menu avec les produits disponibles'}
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
              {/* Name and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Menu du Jour"
                    error={errors.name}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        type: value as 'predefined' | 'daily',
                      })
                    }
                    options={typeOptions}
                    placeholder="Sélectionner..."
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description du menu..."
                  rows={2}
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="menuActive"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#F4A024] focus:ring-[#F4A024]"
                />
                <label
                  htmlFor="menuActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Menu actif
                </label>
              </div>

              {/* Products Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Produits <span className="text-red-500">*</span>
                  </label>
                  {errors.products && (
                    <span className="text-xs text-red-500">
                      Ajoutez au moins un produit
                    </span>
                  )}
                </div>

                {/* Add Product */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={selectedProductId}
                      onValueChange={setSelectedProductId}
                      options={productOptions}
                      placeholder="Sélectionner un produit..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addProduct}
                    disabled={!selectedProductId}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Products List */}
                {formData.products.length > 0 && (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {formData.products.map((p) => (
                      <div
                        key={String(p.productId)}
                        className="p-3 flex items-center gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {p.product?.name || `Produit #${p.productId}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.product?.price?.toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProduct(p.productId)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.products.length === 0 && (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-500">
                      Aucun produit ajouté. Sélectionnez des produits ci-dessus.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary" size="sm">
                  Annuler
                </Button>
              </Dialog.Close>
              <Button type="submit" variant="primary" size="sm">
                {isEditing ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
