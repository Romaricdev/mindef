'use client'

import { useState, useCallback, useMemo } from 'react'
import { BaseModal } from '@/components/modals'
import { Button, Input, Select, Textarea } from '@/components/ui'
import {
  User,
  Phone,
  Mail,
  Calendar,
  Building2,
  Users,
  MessageSquare,
  Check,
  Clock,
  Package,
} from 'lucide-react'
import { useReservationSlotTypes, useHallPacks } from '@/hooks'
import type { CreateHallReservationInput } from '@/lib/data'
import type { Hall } from '@/types'

const todayIso = () => new Date().toISOString().split('T')[0]

const EVENT_TYPES = [
  'Mariage',
  'Anniversaire',
  'Cérémonie',
  'Conférence',
  'Séminaire',
  'Formation',
  'Cocktail',
  'Autre',
]

interface NewHallReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: CreateHallReservationInput) => Promise<void>
  halls: Hall[]
}

export function NewHallReservationModal({
  open,
  onOpenChange,
  onSubmit,
  halls = [],
}: NewHallReservationModalProps) {
  const [hallId, setHallId] = useState<string>('')
  const [slotTypeSlug, setSlotTypeSlug] = useState<string>('')
  const [hallPackId, setHallPackId] = useState<string>('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [eventType, setEventType] = useState('')
  const [expectedGuests, setExpectedGuests] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: slotTypes = [] } = useReservationSlotTypes()
  const { data: packsForHall = [] } = useHallPacks({
    hallId: hallId ? parseInt(hallId, 10) : undefined,
  })

  const slotTypeOptions = useMemo(() => {
    const slugs = [...new Set(packsForHall.map((p) => p.slotTypeSlug))]
    return slugs
      .map((slug) => {
        const st = slotTypes.find((s) => s.slug === slug)
        return { value: slug, label: st?.name ?? slug }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [packsForHall, slotTypes])

  const packOptions = useMemo(() => {
    if (!slotTypeSlug) return []
    return packsForHall
      .filter((p) => p.slotTypeSlug === slotTypeSlug)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((p) => ({
        value: String(p.id),
        label: p.name ? `${p.name}${p.costLabel ? ` — ${p.costLabel}` : ''}` : p.costLabel || `Pack #${p.id}`,
      }))
  }, [packsForHall, slotTypeSlug])

  const isValid =
    Boolean(hallId) &&
    Boolean(customerName.trim()) &&
    Boolean(customerPhone.trim()) &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    new Date(endDate) >= new Date(startDate)

  const resetForm = useCallback(() => {
    setHallId('')
    setSlotTypeSlug('')
    setHallPackId('')
    setCustomerName('')
    setCustomerPhone('')
    setCustomerEmail('')
    setOrganization('')
    setStartDate('')
    setEndDate('')
    setEventType('')
    setExpectedGuests('')
    setNotes('')
    setError('')
  }, [])

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) resetForm()
      onOpenChange(isOpen)
    },
    [onOpenChange, resetForm]
  )

  const handleSubmit = useCallback(async () => {
    if (!onSubmit) {
      setError('Configuration erreur : aucune action de création fournie.')
      return
    }
    if (!isValid) {
      setError('Veuillez remplir les champs obligatoires (salle, nom, téléphone, dates).')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload: CreateHallReservationInput = {
        hallId: parseInt(hallId, 10),
        slotTypeSlug: slotTypeSlug.trim() || undefined,
        hallPackId: hallPackId ? parseInt(hallPackId, 10) : undefined,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        organization: organization.trim() || undefined,
        startDate,
        endDate,
        eventType: eventType.trim() || undefined,
        expectedGuests: expectedGuests ? parseInt(expectedGuests, 10) : undefined,
        notes: notes.trim() || undefined,
      }
      await onSubmit(payload)
      resetForm()
      onOpenChange(false)
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : typeof (e as { message?: string })?.message === 'string'
            ? (e as { message: string }).message
            : 'Erreur lors de la création'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }, [
    isValid,
    hallId,
    slotTypeSlug,
    hallPackId,
    customerName,
    customerPhone,
    customerEmail,
    organization,
    startDate,
    endDate,
    eventType,
    expectedGuests,
    notes,
    onSubmit,
    resetForm,
    onOpenChange,
  ])

  const eventOptions = EVENT_TYPES.map((t) => ({ value: t, label: t }))
  const defaultHallImage = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      void handleSubmit()
    },
    [handleSubmit]
  )

  return (
    <BaseModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Nouvelle réservation de salle"
      description="Choisissez une salle puis renseignez les informations"
      maxWidth="lg"
    >
      <form onSubmit={onFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Choix de la salle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choisir la salle <span className="text-red-500">*</span>
          </label>
          {halls.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucune salle disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {halls.map((hall) => {
                const isSelected = hallId === String(hall.id)
                const img = (hall.images && hall.images[0]) || defaultHallImage
                return (
                  <button
                    key={hall.id}
                    type="button"
                    onClick={() => {
                      setHallId(String(hall.id))
                      setSlotTypeSlug('')
                      setHallPackId('')
                    }}
                    className={`rounded-lg border-2 overflow-hidden text-left transition-all ${
                      isSelected
                        ? 'border-[#F4A024] ring-2 ring-[#F4A024]/30'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <img
                        src={img}
                        alt={hall.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#F4A024] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {hall.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {hall.capacity} pers.
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {hallId && slotTypeOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de créneau <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Clock className="w-4 h-4" />
              </div>
              <Select
                value={slotTypeSlug}
                onValueChange={(v) => {
                  setSlotTypeSlug(v)
                  setHallPackId('')
                }}
                options={slotTypeOptions}
                placeholder="Sélectionner un créneau"
                className="flex-1 min-w-0 border-0 rounded-none focus:ring-0"
              />
            </div>
          </div>
        )}

        {hallId && slotTypeSlug && packOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pack <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Package className="w-4 h-4" />
              </div>
              <Select
                value={hallPackId}
                onValueChange={setHallPackId}
                options={packOptions}
                placeholder="Sélectionner un pack"
                className="flex-1 min-w-0 border-0 rounded-none focus:ring-0"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du client <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
            <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
              <User className="w-4 h-4" />
            </div>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nom complet"
              className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
            <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
              <Phone className="w-4 h-4" />
            </div>
            <Input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+237 6XX XXX XXX"
              className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-gray-400 text-xs">(optionnel)</span>
          </label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
            <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
              <Mail className="w-4 h-4" />
            </div>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@exemple.com"
              className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organisation <span className="text-gray-400 text-xs">(optionnel)</span>
          </label>
          <Input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Nom de l&apos;organisation"
            className="border-gray-300 focus:ring-[#F4A024]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Calendar className="w-4 h-4" />
              </div>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={todayIso()}
                className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Calendar className="w-4 h-4" />
              </div>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || todayIso()}
                className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d&apos;événement
            </label>
            <Select
              value={eventType}
              onValueChange={setEventType}
              options={eventOptions}
              placeholder="Sélectionner"
              className="border-gray-300 focus:ring-[#F4A024]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invités attendus
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Users className="w-4 h-4" />
              </div>
              <Input
                type="number"
                value={expectedGuests}
                onChange={(e) => setExpectedGuests(e.target.value)}
                placeholder="Nombre"
                min={1}
                className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400 text-xs">(optionnel)</span>
          </label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
            <div className="w-14 flex-shrink-0 flex items-center justify-center pt-3 text-gray-400 bg-gray-50/80 border-r border-gray-200 self-start">
              <MessageSquare className="w-4 h-4" />
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Demandes particulières..."
              rows={3}
              className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>

        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleOpenChange(false)}
            disabled={submitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!isValid || submitting}
            className="flex-1"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void handleSubmit()
            }}
          >
            {submitting ? 'Création…' : 'Créer la réservation'}
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}
