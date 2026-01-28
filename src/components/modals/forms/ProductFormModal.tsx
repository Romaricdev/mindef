'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { MenuItem, Category } from '@/types'
import { Button, Input, Textarea, Select, ImageUploadField } from '@/components/ui'
import { STORAGE_IMAGE_FOLDERS } from '@/lib/constants'

interface ProductFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: MenuItem | null
  categories: Category[]
  onSubmit: (data: Partial<MenuItem>) => void
}

const initialFormData = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  available: true,
  image: '',
  preparationTime: '',
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const isEditing = !!product

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        categoryId: product.categoryId,
        available: product.available,
        image: product.image || '',
        preparationTime: product.preparationTime?.toString() || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [product, open])

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, boolean> = {}
    if (!formData.name.trim()) newErrors.name = true
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = true
    if (!formData.categoryId) newErrors.categoryId = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      categoryId: formData.categoryId,
      available: formData.available,
      image: formData.image.trim() || undefined,
      preparationTime: formData.preparationTime
        ? Number(formData.preparationTime)
        : undefined,
    })

    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {isEditing
                  ? 'Modifiez les informations du produit'
                  : 'Remplissez les informations du nouveau produit'}
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
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Poulet DG"
                  error={errors.name}
                />
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
                  placeholder="Description du produit..."
                  rows={3}
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Prix (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    min="0"
                    error={errors.price}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                    options={categoryOptions}
                    placeholder="Sélectionner..."
                    error={errors.categoryId}
                  />
                </div>
              </div>

              <ImageUploadField
                label="Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder={STORAGE_IMAGE_FOLDERS.products}
              />

              {/* Preparation Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Temps de préparation (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) =>
                    setFormData({ ...formData, preparationTime: e.target.value })
                  }
                  placeholder="15"
                  min="0"
                />
              </div>

              {/* Available */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#F4A024] focus:ring-[#F4A024]"
                />
                <label
                  htmlFor="available"
                  className="text-sm font-medium text-gray-700"
                >
                  Produit disponible
                </label>
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
                {isEditing ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
