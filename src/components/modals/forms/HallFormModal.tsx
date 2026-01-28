'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Check } from 'lucide-react'
import { Hall } from '@/types'
import { Button, Input, Textarea, Select, MultiImageUploadField } from '@/components/ui'
import { STORAGE_IMAGE_FOLDERS } from '@/lib/constants'

interface HallFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hall?: Hall | null
  onSubmit: (data: Partial<Hall>) => void
}

const statusOptions = [
  { value: 'available', label: 'Disponible' },
  { value: 'occupied', label: 'Occupée' },
  { value: 'maintenance', label: 'En maintenance' },
]

const amenitiesOptions = [
  'Sonorisation',
  'Sonorisation professionnelle',
  'Projecteur',
  'Projecteur HD',
  'Éclairage LED',
  'Éclairage scénique',
  'Climatisation',
  'Scène',
  'Scène 50m²',
  'Terrasse',
  'Bar extérieur',
  'Parking privé',
  'Visioconférence',
  'Tableau interactif',
  'WiFi haut débit',
  'Vue panoramique',
]

const initialFormData = {
  name: '',
  description: '',
  capacity: '',
  amenities: [] as string[],
  images: [] as string[],
  status: 'available' as 'available' | 'occupied' | 'maintenance',
}

export function HallFormModal({
  open,
  onOpenChange,
  hall,
  onSubmit,
}: HallFormModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const isEditing = !!hall

  useEffect(() => {
    if (hall) {
      setFormData({
        name: hall.name,
        description: hall.description || '',
        capacity: hall.capacity.toString(),
        amenities: hall.amenities || [],
        images: hall.images ?? [],
        status: hall.status,
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [hall, open])

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, boolean> = {}
    if (!formData.name.trim()) newErrors.name = true
    if (!formData.capacity || isNaN(Number(formData.capacity))) newErrors.capacity = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      capacity: Number(formData.capacity),
      amenities: formData.amenities.length > 0 ? formData.amenities : undefined,
      images: formData.images.length > 0 ? formData.images : undefined,
      status: formData.status,
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
                {isEditing ? 'Modifier la salle' : 'Ajouter une salle'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {isEditing
                  ? 'Modifiez les informations de la salle'
                  : 'Créez une nouvelle salle de fête'}
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
                  placeholder="Ex: Salle Prestige"
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
                  placeholder="Description de la salle..."
                  rows={2}
                />
              </div>

              {/* Capacity and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Capacité <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    placeholder="100"
                    min="1"
                    error={errors.capacity}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as 'available' | 'occupied' | 'maintenance',
                      })
                    }
                    options={statusOptions}
                    placeholder="Sélectionner..."
                  />
                </div>
              </div>

              <MultiImageUploadField
                label="Images de la salle"
                value={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                folder={STORAGE_IMAGE_FOLDERS.halls}
                maxImages={20}
              />

              {/* Amenities */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Équipements
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {amenitiesOptions.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-[#F4A024]/10 text-[#F4A024]'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          formData.amenities.includes(amenity)
                            ? 'bg-[#F4A024] border-[#F4A024]'
                            : 'border-gray-300'
                        }`}
                      >
                        {formData.amenities.includes(amenity) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="truncate">{amenity}</span>
                    </button>
                  ))}
                </div>
                {formData.amenities.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {formData.amenities.length} équipement(s) sélectionné(s)
                  </p>
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
                {isEditing ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
