'use client'

import { useState } from 'react'
import { Input } from '@/components/ui'
import { Calendar, Clock, Users, User, Phone, MessageSquare, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Hall } from '@/types'

export interface HallReservationFormData {
  fullName: string
  phone: string
  email?: string
  organization?: string
  hallId: string
  startDate: string
  endDate: string
  eventType?: string
  expectedGuests?: string
  message: string
}

interface HallReservationFormProps {
  formData: HallReservationFormData
  onChange: (data: HallReservationFormData) => void
  errors?: Partial<Record<keyof HallReservationFormData, string>>
  selectedHall?: Hall
}

export function HallReservationForm({ formData, onChange, errors = {}, selectedHall }: HallReservationFormProps) {
  const handleChange = (field: keyof HallReservationFormData, value: string) => {
    onChange({ ...formData, [field]: value })
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  const eventTypes = [
    'Mariage',
    'Anniversaire',
    'Cérémonie',
    'Conférence',
    'Séminaire',
    'Formation',
    'Cocktail',
    'Autre',
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Selected Hall Info */}
      {selectedHall && (
        <div className="p-5 sm:p-6 bg-[#F4A024]/10 border border-[#F4A024]/20 rounded-lg">
          <div className="flex items-center gap-4">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#F4A024] flex-shrink-0" />
            <div>
              <p className="font-semibold text-base sm:text-lg text-gray-900">{selectedHall.name}</p>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Capacité : {selectedHall.capacity} {selectedHall.capacity === 1 ? 'personne' : 'personnes'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Votre nom complet"
            className={cn(
              'pl-12 h-12 sm:h-14 text-base border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]',
              errors.fullName && 'border-red-500 focus:ring-red-500'
            )}
            required
          />
        </div>
        {errors.fullName && (
          <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+237 6XX XXX XXX"
            className={cn(
              'pl-12 h-12 sm:h-14 text-base border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]',
              errors.phone && 'border-red-500 focus:ring-red-500'
            )}
            required
          />
        </div>
        {errors.phone && (
          <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="votre@email.com"
          className="h-12 sm:h-14 text-base border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]"
        />
      </div>

      {/* Organization */}
      <div>
        <label htmlFor="organization" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
          Organisation (optionnel)
        </label>
        <Input
          id="organization"
          type="text"
          value={formData.organization || ''}
          onChange={(e) => handleChange('organization', e.target.value)}
          placeholder="Nom de votre organisation"
          className="h-12 sm:h-14 text-base border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]"
        />
      </div>

      {/* Start Date and End Date Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Date de début <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              min={today}
              className={cn(
                'pl-12 h-12 sm:h-14 text-base border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]',
                errors.startDate && 'border-red-500 focus:ring-red-500'
              )}
              required
            />
          </div>
          {errors.startDate && (
            <p className="mt-2 text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Date de fin <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              min={formData.startDate || today}
              className={cn(
                'pl-12 h-12 sm:h-14 text-base border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]',
                errors.endDate && 'border-red-500 focus:ring-red-500'
              )}
              required
            />
          </div>
          {errors.endDate && (
            <p className="mt-2 text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Event Type and Expected Guests Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Event Type */}
        <div>
          <label htmlFor="eventType" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Type d&apos;événement
          </label>
          <select
            id="eventType"
            value={formData.eventType || ''}
            onChange={(e) => handleChange('eventType', e.target.value)}
            className="w-full h-12 sm:h-14 pl-4 pr-10 rounded-md border bg-white text-base min-h-[48px] border-gray-300 focus:border-[#F4A024] focus:ring-2 focus:ring-[#F4A024] focus:outline-none"
          >
            <option value="">Sélectionner</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Expected Guests */}
        <div>
          <label htmlFor="expectedGuests" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Nombre d&apos;invités attendus
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <Input
              id="expectedGuests"
              type="number"
              value={formData.expectedGuests || ''}
              onChange={(e) => handleChange('expectedGuests', e.target.value)}
              placeholder="Nombre d'invités"
              min="1"
              className="pl-12 h-12 sm:h-14 text-base border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]"
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
          Message ou demandes particulières
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Informations complémentaires sur votre événement..."
            rows={4}
            className={cn(
              'w-full pl-12 pr-4 py-4 rounded-md border bg-white text-base resize-none min-h-[120px]',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]',
              errors.message && 'border-red-500 focus:ring-red-500'
            )}
          />
        </div>
        {errors.message && (
          <p className="mt-2 text-sm text-red-500">{errors.message}</p>
        )}
      </div>
    </div>
  )
}
