'use client'

import { useState, useCallback } from 'react'
import { BaseModal } from '@/components/modals'
import { Button, Input } from '@/components/ui'
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Table2,
} from 'lucide-react'
import { useAppSettings } from '@/hooks'
import type { CreateTableReservationInput } from '@/lib/data'
import type { RestaurantTable } from '@/types'

interface NewReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: CreateTableReservationInput) => Promise<void>
  tables?: RestaurantTable[]
}

const todayIso = () => new Date().toISOString().split('T')[0]

export function NewReservationModal({
  open,
  onOpenChange,
  onSubmit,
  tables = [],
}: NewReservationModalProps) {
  const { timeSlots } = useAppSettings()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [tableNumber, setTableNumber] = useState<number | undefined>()
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isValid =
    Boolean(customerName.trim()) &&
    Boolean(customerPhone.trim()) &&
    Boolean(date) &&
    Boolean(time) &&
    partySize > 0

  const resetForm = useCallback(() => {
    setCustomerName('')
    setCustomerPhone('')
    setCustomerEmail('')
    setDate('')
    setTime('')
    setPartySize(2)
    setTableNumber(undefined)
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
    if (!isValid) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload: CreateTableReservationInput = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        date,
        time,
        partySize,
        tableNumber,
        notes: notes.trim() || undefined,
      }
      await onSubmit?.(payload)
      resetForm()
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la création')
    } finally {
      setSubmitting(false)
    }
  }, [
    isValid,
    customerName,
    customerPhone,
    customerEmail,
    date,
    time,
    partySize,
    tableNumber,
    notes,
    onSubmit,
    resetForm,
    onOpenChange,
  ])

  const availableTables = tables.filter(
    (t) => t.status === 'available' && t.capacity >= partySize
  )

  return (
    <BaseModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Nouvelle réservation"
      description="Créer une nouvelle réservation de table"
      maxWidth="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Calendar className="w-4 h-4" />
              </div>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={todayIso()}
                className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Clock className="w-4 h-4" />
              </div>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 min-w-0 h-12 sm:h-10 min-h-[48px] sm:min-h-[40px] border-0 rounded-none px-4 bg-transparent text-sm focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              >
                <option value="">Sélectionner</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de personnes <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Users className="w-4 h-4" />
              </div>
              <Input
                type="number"
                value={partySize}
                onChange={(e) =>
                  setPartySize(
                    Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1))
                  )
                }
                min={1}
                max={20}
                className="flex-1 min-w-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-gray-400 bg-gray-50/80 border-r border-gray-200">
                <Table2 className="w-4 h-4" />
              </div>
              <select
                value={tableNumber ?? ''}
                onChange={(e) =>
                  setTableNumber(
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="flex-1 min-w-0 h-12 sm:h-10 min-h-[48px] sm:min-h-[40px] border-0 rounded-none px-4 bg-transparent text-sm focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              >
                <option value="">Non attribuée</option>
                {availableTables.map((t) => (
                  <option key={t.id} value={t.number}>
                    Table {t.number} ({t.capacity} places)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400 text-xs">(optionnel)</span>
          </label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F4A024] focus-within:ring-offset-0">
            <div className="w-14 flex-shrink-0 flex items-start justify-center pt-3 text-gray-400 bg-gray-50/80 border-r border-gray-200">
              <MessageSquare className="w-4 h-4" />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Demandes spéciales, allergies, etc."
              rows={3}
              className="flex-1 min-w-0 border-0 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-0 resize-none bg-transparent"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>

        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={() => handleOpenChange(false)}
            disabled={submitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="flex-1"
          >
            {submitting ? 'Création…' : 'Créer la réservation'}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
