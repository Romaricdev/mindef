'use client'

import { Card, CardContent } from '@/components/ui'
import { Calendar, Clock, Users, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ReservationFormData } from './ReservationForm'

interface ReservationSummaryProps {
  formData: ReservationFormData
  onConfirm: () => void
  isLoading?: boolean
  /** Erreur renvoyée par le serveur à l'envoi */
  submitError?: string | null
}

export function ReservationSummary({ formData, onConfirm, isLoading = false, submitError }: ReservationSummaryProps) {
  const hasRequiredFields = formData.fullName && formData.phone && formData.date && formData.time && formData.partySize

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    return `${hours}h${minutes || '00'}`
  }

  return (
    <Card variant="site" padding="lg" className="lg:sticky lg:top-[100px]">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Récapitulatif</h2>

      <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
        {/* Date */}
        {formData.date && (
          <div className="flex items-start gap-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#F4A024] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1.5">Date</p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">
                {formatDate(new Date(formData.date), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}

        {/* Time */}
        {formData.time && (
          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#F4A024] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1.5">Heure</p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">{formatTime(formData.time)}</p>
            </div>
          </div>
        )}

        {/* Party Size */}
        {formData.partySize && (
          <div className="flex items-start gap-4">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#F4A024] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1.5">Nombre de personnes</p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">
                {formData.partySize} {formData.partySize === '1' ? 'personne' : 'personnes'}
              </p>
            </div>
          </div>
        )}

        {/* Message */}
        {formData.message && (
          <div className="flex items-start gap-4">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#F4A024] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1.5">Message</p>
              <p className="text-sm sm:text-base text-gray-700 line-clamp-3">{formData.message}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasRequiredFields && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Remplissez le formulaire pour voir le récapitulatif</p>
          </div>
        )}
      </div>

      {submitError && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={!hasRequiredFields || isLoading}
        className={`
          w-full h-12 sm:h-14 rounded-lg font-semibold text-sm sm:text-base text-white
          transition-all duration-300
          flex items-center justify-center gap-2
          min-h-[48px]
          ${
            hasRequiredFields && !isLoading
              ? 'bg-[#F4A024] hover:bg-[#C97F16] shadow-lg shadow-[#F4A024]/25 hover:shadow-xl hover:shadow-[#F4A024]/30'
              : 'bg-gray-300 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <Calendar className="w-5 h-5" />
            Confirmer la réservation
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        En confirmant, vous acceptez nos conditions de réservation
      </p>
    </Card>
  )
}
