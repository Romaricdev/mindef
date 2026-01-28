'use client'

import Link from 'next/link'
import { CheckCircle2, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui'
import type { ReservationFormData } from './ReservationForm'

interface ReservationSuccessProps {
  reservationData: ReservationFormData
}

export function ReservationSuccess({ reservationData }: ReservationSuccessProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fadeIn">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 animate-fadeInSlideUp">
          Réservation confirmée !
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8 animate-fadeIn">
          Votre réservation a été prise en compte avec succès. 
          Nous vous attendons le{' '}
          <span className="font-semibold text-gray-900">
            {new Date(reservationData.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </span>{' '}
          à{' '}
          <span className="font-semibold text-gray-900">
            {reservationData.time}
          </span>
          .
        </p>

        {/* Reservation Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left animate-fadeIn">
          <h3 className="font-semibold text-gray-900 mb-4">Détails de votre réservation</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Nom :</span> {reservationData.fullName}
            </p>
            <p>
              <span className="font-medium text-gray-900">Téléphone :</span> {reservationData.phone}
            </p>
            <p>
              <span className="font-medium text-gray-900">Personnes :</span> {reservationData.partySize}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
          <Link href="/home">
            <Button variant="site-primary" size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="w-5 h-5" />
              Retour à l&apos;accueil
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="site-secondary" size="lg" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-5 h-5" />
              Voir le menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
