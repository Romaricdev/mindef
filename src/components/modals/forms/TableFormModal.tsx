'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { RestaurantTable } from '@/types'
import { Button, Input, Select } from '@/components/ui'

interface TableFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table?: RestaurantTable | null
  onSubmit: (data: Partial<RestaurantTable>) => void
}

const capacityOptions = [
  { value: '2', label: '2 places' },
  { value: '4', label: '4 places' },
  { value: '6', label: '6 places' },
  { value: '8', label: '8 places' },
  { value: '10', label: '10 places' },
  { value: '12', label: '12 places' },
]

const statusOptions = [
  { value: 'available', label: 'Libre' },
  { value: 'occupied', label: 'Occupée' },
  { value: 'reserved', label: 'Réservée' },
]

const initialFormData = {
  number: '',
  capacity: '4',
  status: 'available' as 'available' | 'occupied' | 'reserved',
}

export function TableFormModal({
  open,
  onOpenChange,
  table,
  onSubmit,
}: TableFormModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const isEditing = !!table

  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number.toString(),
        capacity: table.capacity.toString(),
        status: table.status,
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [table, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, boolean> = {}
    if (!formData.number || isNaN(Number(formData.number))) newErrors.number = true
    if (!formData.capacity) newErrors.capacity = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      number: Number(formData.number),
      capacity: Number(formData.capacity),
      status: formData.status,
    })

    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier la table' : 'Ajouter une table'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {isEditing
                  ? 'Modifiez les informations de la table'
                  : 'Créez une nouvelle table'}
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
              {/* Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Numéro de table <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  placeholder="Ex: 1"
                  min="1"
                  error={errors.number}
                />
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Capacité <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.capacity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, capacity: value })
                  }
                  options={capacityOptions}
                  placeholder="Sélectionner..."
                  error={errors.capacity}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Statut
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as 'available' | 'occupied' | 'reserved',
                    })
                  }
                  options={statusOptions}
                  placeholder="Sélectionner..."
                />
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
