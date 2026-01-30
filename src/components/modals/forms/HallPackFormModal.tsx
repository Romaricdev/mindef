'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, Package } from 'lucide-react'
import { Button, Input, Select } from '@/components/ui'
import type { HallPack, Hall, ReservationSlotType } from '@/types'
import type { CreateHallPackInput, UpdateHallPackInput } from '@/lib/data/reservation-config'

interface HallPackFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pack à modifier ; null = création */
  pack: HallPack | null
  halls: Hall[]
  slotTypes: ReservationSlotType[]
  onSubmitCreate?: (data: CreateHallPackInput) => Promise<void>
  onSubmitUpdate?: (id: number, data: UpdateHallPackInput) => Promise<void>
}

const initialFormData = {
  hallId: '',
  slotTypeSlug: '',
  name: '',
  description: '',
  costLabel: '',
  costAmount: '',
  observations: '',
  displayOrder: '0',
}

export function HallPackFormModal({
  open,
  onOpenChange,
  pack,
  halls,
  slotTypes,
  onSubmitCreate,
  onSubmitUpdate,
}: HallPackFormModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const isEditing = !!pack

  useEffect(() => {
    if (pack) {
      setFormData({
        hallId: String(pack.hallId),
        slotTypeSlug: pack.slotTypeSlug,
        name: pack.name ?? '',
        description: pack.description ?? '',
        costLabel: pack.costLabel,
        costAmount: pack.costAmount != null ? String(pack.costAmount) : '',
        observations: pack.observations ?? '',
        displayOrder: String(pack.displayOrder),
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [pack, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.costLabel.trim()) {
      newErrors.costLabel = 'Le libellé tarif est requis'
    }
    if (!isEditing) {
      if (!formData.hallId) newErrors.hallId = 'La salle est requise'
      if (!formData.slotTypeSlug) newErrors.slotTypeSlug = 'Le type de créneau est requis'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSaving(true)
    setErrors({})
    try {
      if (isEditing && pack) {
        const payload: UpdateHallPackInput = {
          name: formData.name.trim() || null,
          description: formData.description.trim() || null,
          costLabel: formData.costLabel.trim(),
          costAmount: formData.costAmount === '' ? null : Number(formData.costAmount),
          observations: formData.observations.trim() || null,
          displayOrder: Number(formData.displayOrder) || 0,
        }
        if (onSubmitUpdate) await onSubmitUpdate(pack.id, payload)
      } else {
        const payload: CreateHallPackInput = {
          hallId: Number(formData.hallId),
          slotTypeSlug: formData.slotTypeSlug,
          name: formData.name.trim() || null,
          description: formData.description.trim() || null,
          costLabel: formData.costLabel.trim(),
          costAmount: formData.costAmount === '' ? null : Number(formData.costAmount),
          observations: formData.observations.trim() || null,
          displayOrder: Number(formData.displayOrder) || 0,
        }
        if (onSubmitCreate) await onSubmitCreate(payload)
      }
      onOpenChange(false)
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement',
      })
    } finally {
      setSaving(false)
    }
  }

  const hallOptions = halls.map((h) => ({ value: String(h.id), label: h.name }))
  const slotOptions = slotTypes.map((s) => ({ value: s.slug, label: s.name }))

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 border border-dashboard-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dashboard-border">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-dashboard-surface-muted flex items-center justify-center">
                <Package className="w-5 h-5 text-dashboard-primary" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-dashboard-text-primary">
                  {isEditing ? 'Modifier le pack' : 'Ajouter un pack'}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-dashboard-text-secondary mt-0.5">
                  {isEditing
                    ? 'Modifiez les informations du pack de réservation'
                    : 'Créez un nouveau pack pour une salle et un créneau'}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-2 text-dashboard-text-muted hover:text-dashboard-text-primary hover:bg-dashboard-surface-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {errors.form && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {errors.form}
                </div>
              )}

              {/* Salle (création uniquement ou lecture en édition) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dashboard-text-secondary">
                  Salle {!isEditing && <span className="text-red-500">*</span>}
                </label>
                {isEditing ? (
                  <p className="text-sm text-dashboard-text-primary font-medium">
                    {halls.find((h) => Number(h.id) === Number(formData.hallId))?.name ?? `Salle #${formData.hallId}`}
                  </p>
                ) : (
                  <Select
                    value={formData.hallId}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, hallId: v }))}
                    options={hallOptions}
                    placeholder="Choisir une salle"
                    error={!!errors.hallId}
                  />
                )}
                {errors.hallId && (
                  <p className="text-xs text-red-500">{errors.hallId}</p>
                )}
              </div>

              {/* Type de créneau */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dashboard-text-secondary">
                  Type de créneau {!isEditing && <span className="text-red-500">*</span>}
                </label>
                {isEditing ? (
                  <p className="text-sm text-dashboard-text-primary font-medium">
                    {slotTypes.find((s) => s.slug === formData.slotTypeSlug)?.name ?? formData.slotTypeSlug}
                  </p>
                ) : (
                  <Select
                    value={formData.slotTypeSlug}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, slotTypeSlug: v }))}
                    options={slotOptions}
                    placeholder="Choisir un créneau"
                    error={!!errors.slotTypeSlug}
                  />
                )}
                {errors.slotTypeSlug && (
                  <p className="text-xs text-red-500">{errors.slotTypeSlug}</p>
                )}
              </div>

              {/* Nom du pack */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dashboard-text-secondary">
                  Nom du pack
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="ex. Pack Bravo"
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dashboard-text-secondary">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="ex. Salle + chaises + sono"
                  className="w-full"
                />
              </div>

              {/* Libellé tarif */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dashboard-text-secondary">
                  Libellé tarif <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.costLabel}
                  onChange={(e) => setFormData((prev) => ({ ...prev, costLabel: e.target.value }))}
                  placeholder="ex. 300 000 FCFA ou À négocier"
                  className="w-full"
                  error={!!errors.costLabel}
                />
                {errors.costLabel && (
                  <p className="text-xs text-red-500">{errors.costLabel}</p>
                )}
              </div>

              {/* Montant (optionnel) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dashboard-text-secondary">
                  Montant (optionnel)
                </label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={formData.costAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, costAmount: e.target.value }))}
                  placeholder="ex. 300000"
                  className="w-full"
                />
              </div>

              {/* Observations */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dashboard-text-secondary">
                  Observations
                </label>
                <Input
                  value={formData.observations}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                  placeholder="Notes internes ou affichées"
                  className="w-full"
                />
              </div>

              {/* Ordre d'affichage */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dashboard-text-secondary">
                  Ordre d&apos;affichage
                </label>
                <Input
                  type="number"
                  min={0}
                  value={formData.displayOrder}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: e.target.value }))}
                  placeholder="0"
                  className="w-full max-w-[120px]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end p-6 border-t border-dashboard-border bg-dashboard-surface-muted/30">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={saving} className="gap-2">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
                {isEditing ? 'Enregistrer' : 'Créer le pack'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
