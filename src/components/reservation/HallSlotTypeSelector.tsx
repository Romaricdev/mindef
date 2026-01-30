'use client'

import { Card, CardContent, Button } from '@/components/ui'
import { useReservationSlotTypes } from '@/hooks'
import { Clock, ArrowRight, Loader2 } from 'lucide-react'
import { FadeIn, Stagger } from '@/components/animations'
import type { ReservationSlotType } from '@/types'

// ============================================
// HALL SLOT TYPE SELECTOR
// ============================================

interface HallSlotTypeSelectorProps {
  onSelectSlotType: (slotType: ReservationSlotType) => void
  selectedSlotSlug?: string | null
}

export function HallSlotTypeSelector({
  onSelectSlotType,
  selectedSlotSlug,
}: HallSlotTypeSelectorProps) {
  const { data: slotTypes, loading, error } = useReservationSlotTypes()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-[#F4A024] animate-spin mb-4" />
        <p className="text-gray-500">Chargement des créneaux…</p>
      </div>
    )
  }

  if (error || !slotTypes?.length) {
    return (
      <Card variant="site" padding="lg">
        <CardContent>
          <p className="text-gray-500 text-center">
            {error || 'Aucun créneau disponible pour le moment.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
          Choisissez un créneau
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Sélectionnez le type de réservation qui correspond à votre événement
        </p>
      </div>

      <Stagger className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {slotTypes.map((slot) => {
          const isSelected = selectedSlotSlug === slot.slug
          return (
            <Card
              key={slot.id}
              variant="site"
              padding="none"
              className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                isSelected ? 'ring-2 ring-[#F4A024]' : ''
              }`}
              onClick={() => onSelectSlotType(slot)}
            >
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#F4A024]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#F4A024]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-1">
                      {slot.name}
                    </h3>
                    <p className="text-sm text-gray-600">{slot.horaires}</p>
                  </div>
                </div>
                <Button
                  variant={isSelected ? 'site-primary' : 'site-secondary'}
                  size="sm"
                  className="w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectSlotType(slot)
                  }}
                >
                  Choisir
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </Stagger>
    </div>
  )
}
