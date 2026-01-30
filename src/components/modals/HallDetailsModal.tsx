'use client'

import { useMemo } from 'react'
import { BaseModal } from './BaseModal'
import { Badge, Button } from '@/components/ui'
import { Building2, Users, Calendar, Edit, Lock, Package } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Hall } from '@/types'
import { useHallReservationsByHall, useHallPacks } from '@/hooks'

// ============================================
// HALL DETAILS MODAL
// ============================================

interface HallDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hall: Hall | null
  onEdit?: (hall: Hall) => void
  onBlockDates?: (hall: Hall) => void
  /** Pour la sélection depuis la page réservation publique */
  onSelect?: (hall: Hall) => void
  /** Type de créneau (ex. journee_pleine) pour afficher les packs dans le modal public */
  slotTypeSlug?: string | null
}

export function HallDetailsModal({
  open,
  onOpenChange,
  hall,
  onEdit,
  onBlockDates,
  onSelect,
  slotTypeSlug,
}: HallDetailsModalProps) {
  const { data: reservations } = useHallReservationsByHall(hall?.id ?? null)
  const { data: allPacks } = useHallPacks(
    onSelect && slotTypeSlug ? { slotTypeSlug } : undefined
  )
  const hallPacks = useMemo(() => {
    if (!hall || !allPacks?.length) return []
    const id = Number(hall.id)
    return allPacks
      .filter((p) => p.hallId === id)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }, [hall, allPacks])

  if (!hall) return null

  const statusConfig = {
    available: { label: 'Disponible', variant: 'success' as const },
    occupied: { label: 'Occupée', variant: 'error' as const },
    maintenance: { label: 'Maintenance', variant: 'warning' as const },
  }

  const status = statusConfig[hall.status]
  const upcomingReservations = reservations.filter(r => 
    r.status !== 'cancelled' && new Date(r.startDate) >= new Date()
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  const pastReservations = reservations.filter(r => 
    new Date(r.endDate) < new Date()
  ).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={hall.name}
      description={hall.description || 'Détails de la salle'}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Hall Images Gallery */}
        {hall.images && hall.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {hall.images.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={url}
                  alt={`${hall.name} – image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}

        {/* Status & Info */}
        <div className="flex items-start gap-4">
          {(!hall.images || hall.images.length === 0) && (
            <div className="w-16 h-16 rounded-lg bg-[#F4A024]/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-[#F4A024]" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{hall.name}</h3>
              <Badge variant={status.variant} size="lg">
                {status.label}
              </Badge>
            </div>
            {hall.description && (
              <p className="text-sm text-gray-600 mb-3">{hall.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Capacité: {hall.capacity} {hall.capacity === 1 ? 'personne' : 'personnes'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {hall.amenities && hall.amenities.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Équipements</h4>
            <div className="flex flex-wrap gap-2">
              {hall.amenities.map((amenity, index) => (
                <Badge key={index} variant="default" size="sm">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Packs & tarifs (mode réservation publique) */}
        {onSelect && hallPacks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-site-primary" />
              Packs & tarifs
            </h4>
            <ul className="space-y-2">
              {hallPacks.map((pack) => (
                <li
                  key={pack.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-lg bg-site-background-muted px-4 py-3 text-sm border border-gray-100"
                >
                  <span className="font-medium text-gray-800">
                    {pack.name ?? 'Offre'}
                  </span>
                  <span className="font-semibold text-gray-800 tabular-nums shrink-0">
                    {pack.costLabel}
                  </span>
                  {pack.description && (
                    <span className="w-full text-xs text-gray-500 leading-snug mt-0.5">
                      {pack.description}
                    </span>
                  )}
                  {pack.observations && (
                    <span className="w-full text-xs text-gray-500 italic mt-0.5">
                      {pack.observations}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upcoming Reservations (masqué en mode public) */}
        {!onSelect && upcomingReservations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#F4A024]" />
              Réservations à venir
            </h4>
            <div className="space-y-2">
              {upcomingReservations.slice(0, 5).map((reservation) => (
                <div key={reservation.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{reservation.customerName}</span>
                    <Badge variant={reservation.status === 'confirmed' ? 'success' : 'warning'} size="sm">
                      {reservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                    </Badge>
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <div>
                      {formatDate(reservation.startDate, { day: 'numeric', month: 'short' })} -{' '}
                      {formatDate(reservation.endDate, { day: 'numeric', month: 'short' })}
                    </div>
                    {reservation.eventType && (
                      <div className="text-xs text-gray-500">{reservation.eventType}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Reservations (last 3, masqué en mode public) */}
        {!onSelect && pastReservations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Réservations passées</h4>
            <div className="space-y-2">
              {pastReservations.slice(0, 3).map((reservation) => (
                <div key={reservation.id} className="bg-gray-50 rounded-lg p-3 text-sm opacity-75">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">{reservation.customerName}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(reservation.endDate, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {reservation.eventType && (
                    <div className="text-xs text-gray-500">{reservation.eventType}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions (bouton "Sélectionner cette salle" masqué sur le site public) */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          {onSelect ? null : (
            // Mode admin (modifier/bloquer)
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onEdit?.(hall)
                  onOpenChange(false)
                }}
                className="gap-2 flex-1"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onBlockDates?.(hall)
                  onOpenChange(false)
                }}
                className="gap-2"
              >
                <Lock className="w-4 h-4" />
                Bloquer dates
              </Button>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  )
}
