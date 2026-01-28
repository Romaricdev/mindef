'use client'

import { useState } from 'react'
import { Input } from '@/components/ui'
import { Calendar, Clock, Users, User, Phone, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppSettings } from '@/hooks'

export interface ReservationFormData {
  fullName: string
  phone: string
  date: string
  time: string
  partySize: string
  message: string
}

interface ReservationFormProps {
  formData: ReservationFormData
  onChange: (data: ReservationFormData) => void
  errors?: Partial<Record<keyof ReservationFormData, string>>
}

// Party sizes
const partySizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']

export function ReservationForm({ formData, onChange, errors = {} }: ReservationFormProps) {
  const { timeSlots } = useAppSettings()
  
  const handleChange = (field: keyof ReservationFormData, value: string) => {
    onChange({ ...formData, [field]: value })
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6 sm:space-y-8">
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
              'pl-12 h-12 sm:h-14 border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024] text-base',
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
          Numéro de téléphone <span className="text-red-500">*</span>
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
              'pl-12 h-12 sm:h-14 border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024] text-base',
              errors.phone && 'border-red-500 focus:ring-red-500'
            )}
            required
          />
        </div>
        {errors.phone && (
          <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Date and Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              min={today}
              className={cn(
                'pl-12 h-12 sm:h-14 border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024] text-base',
                errors.date && 'border-red-500 focus:ring-red-500'
              )}
              required
            />
          </div>
          {errors.date && (
            <p className="mt-2 text-sm text-red-500">{errors.date}</p>
          )}
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Heure <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <select
              id="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className={cn(
                'w-full h-12 sm:h-14 pl-12 pr-4 rounded-md border bg-white text-base min-h-[48px]',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]',
                errors.time && 'border-red-500 focus:ring-red-500'
              )}
              required
            >
              <option value="">Sélectionner une heure</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          {errors.time && (
            <p className="mt-2 text-sm text-red-500">{errors.time}</p>
          )}
        </div>
      </div>

      {/* Party Size */}
      <div>
        <label htmlFor="partySize" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
          Nombre de personnes <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
          <select
            id="partySize"
            value={formData.partySize}
            onChange={(e) => handleChange('partySize', e.target.value)}
            className={cn(
              'w-full h-12 sm:h-14 pl-12 pr-4 rounded-md border bg-white text-base min-h-[48px]',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]',
              errors.partySize && 'border-red-500 focus:ring-red-500'
            )}
            required
          >
            <option value="">Sélectionner</option>
            {partySizes.map((size) => (
              <option key={size} value={size}>
                {size} {size === '1' ? 'personne' : 'personnes'}
              </option>
            ))}
          </select>
        </div>
        {errors.partySize && (
          <p className="mt-2 text-sm text-red-500">{errors.partySize}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
          Message / Note (optionnel)
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Informations supplémentaires, allergies, préférences..."
            rows={4}
            className={cn(
              'w-full pl-12 pr-4 py-4 rounded-md border bg-white text-base',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'border-gray-300 focus:border-[#F4A024] focus:ring-[#F4A024]',
              'placeholder:text-gray-400 resize-none min-h-[120px]'
            )}
          />
        </div>
      </div>
    </div>
  )
}
