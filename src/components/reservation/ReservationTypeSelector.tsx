'use client'

import { Card, CardContent, Button } from '@/components/ui'
import { UtensilsCrossed, Building2, ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/animations'

// ============================================
// RESERVATION TYPE SELECTOR
// ============================================

interface ReservationTypeSelectorProps {
  onSelectType: (type: 'table' | 'hall') => void
}

export function ReservationTypeSelector({ onSelectType }: ReservationTypeSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <FadeIn delay={0.1}>
        <Card variant="site" padding="none" className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => onSelectType('table')}>
          <CardContent className="p-0">
            <div className="relative h-48 sm:h-64 bg-gradient-to-br from-[#F4A024]/10 to-[#F4A024]/5 overflow-hidden">
              <div className="absolute inset-0 bg-[#F4A024]/5 group-hover:bg-[#F4A024]/10 transition-colors" />
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F4A024]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="w-8 h-8 text-[#F4A024]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Réserver une Table
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-sm">
                  Réservez une table au restaurant pour un repas en famille ou entre amis
                </p>
                <Button variant="site-primary" size="lg" className="gap-2 group-hover:scale-105 transition-transform">
                  Choisir une table
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card variant="site" padding="none" className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => onSelectType('hall')}>
          <CardContent className="p-0">
            <div className="relative h-48 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
              <div className="absolute inset-0 bg-gray-100/50 group-hover:bg-gray-100/70 transition-colors" />
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Réserver une Salle
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-sm">
                  Réservez une salle de fête pour vos événements, mariages, conférences ou célébrations
                </p>
                <Button variant="site-secondary" size="lg" className="gap-2 group-hover:scale-105 transition-transform">
                  Voir les salles
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
