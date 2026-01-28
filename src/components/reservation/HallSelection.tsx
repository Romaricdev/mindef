'use client'

import { Card, CardContent, Button, Badge } from '@/components/ui'
import { useHalls } from '@/hooks'
import { Building2, Users, ArrowRight, Check } from 'lucide-react'
import { FadeIn, Stagger } from '@/components/animations'
import type { Hall, ID } from '@/types'

// ============================================
// HALL SELECTION COMPONENT
// ============================================

interface HallSelectionProps {
  onSelectHall: (hall: Hall) => void
  selectedHallId?: ID
}

export function HallSelection({ onSelectHall, selectedHallId }: HallSelectionProps) {
  const { data: halls } = useHalls()
  const availableHalls = halls.filter((h) => h.status === 'available')

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
          Choisissez une salle
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Sélectionnez la salle qui convient le mieux à votre événement
        </p>
      </div>

      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {availableHalls.map((hall) => {
          const isSelected = selectedHallId === hall.id
          const hallImage = (hall.images && hall.images[0]) || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'

          return (
            <Card
              key={hall.id}
              variant="site"
              padding="none"
              className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                isSelected ? 'ring-2 ring-[#F4A024]' : ''
              }`}
              onClick={() => onSelectHall(hall)}
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={hallImage}
                  alt={hall.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/5" />
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="primary" size="sm" className="gap-1">
                      <Check className="w-3 h-3" />
                      Sélectionnée
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-5 sm:p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-4 sm:mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#F4A024]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#F4A024]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-2">
                      {hall.name}
                    </h3>
                    {hall.description && (
                      <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                        {hall.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Capacité : {hall.capacity} {hall.capacity === 1 ? 'personne' : 'personnes'}</span>
                  </div>
                  {hall.amenities && hall.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {hall.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="default" size="sm" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {hall.amenities.length > 3 && (
                        <Badge variant="default" size="sm" className="text-xs">
                          +{hall.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  variant={isSelected ? 'site-primary' : 'site-secondary'}
                  size="sm"
                  className="w-full gap-2 min-h-[48px]"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectHall(hall)
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      Sélectionnée
                    </>
                  ) : (
                    <>
                      Réserver cette salle
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </Stagger>

      {availableHalls.length === 0 && (
        <Card variant="site" padding="lg">
          <CardContent>
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Aucune salle disponible pour le moment
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
