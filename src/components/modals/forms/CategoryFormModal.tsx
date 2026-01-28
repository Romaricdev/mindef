'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Salad, UtensilsCrossed, Flame, Fish, Cake, Wine } from 'lucide-react'
import { Category } from '@/types'
import { Button, Input, Textarea, Select } from '@/components/ui'

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSubmit: (data: Partial<Category>) => void
}

const iconOptions = [
  { value: 'Salad', label: 'Salade' },
  { value: 'UtensilsCrossed', label: 'Couverts' },
  { value: 'Flame', label: 'Flamme' },
  { value: 'Fish', label: 'Poisson' },
  { value: 'Cake', label: 'Gâteau' },
  { value: 'Wine', label: 'Vin' },
]

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Salad,
  UtensilsCrossed,
  Flame,
  Fish,
  Cake,
  Wine,
}

const initialFormData = {
  name: '',
  description: '',
  icon: '',
  order: '',
}

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const isEditing = !!category

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        order: category.order.toString(),
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [category, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, boolean> = {}
    if (!formData.name.trim()) newErrors.name = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      icon: formData.icon || undefined,
      order: formData.order ? Number(formData.order) : 0,
    })

    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {isEditing
                  ? 'Modifiez les informations de la catégorie'
                  : 'Créez une nouvelle catégorie de produits'}
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
                  placeholder="Ex: Entrées"
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
                  placeholder="Description de la catégorie..."
                  rows={2}
                />
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Icône
                </label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) =>
                    setFormData({ ...formData, icon: value })
                  }
                  options={iconOptions}
                  placeholder="Choisir une icône..."
                />
                {formData.icon && iconComponents[formData.icon] && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span>Aperçu:</span>
                    {(() => {
                      const IconComp = iconComponents[formData.icon]
                      return <IconComp className="h-5 w-5 text-[#F4A024]" />
                    })()}
                  </div>
                )}
              </div>

              {/* Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Ordre d&apos;affichage
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  placeholder="1"
                  min="0"
                />
                <p className="text-xs text-gray-500">
                  Les catégories sont triées par ordre croissant
                </p>
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
