'use client'

import { BaseModal } from './BaseModal'
import { Badge, Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Calendar, Phone, Mail, Users, UtensilsCrossed, Building2, CheckCircle, XCircle } from 'lucide-react'
import type { Reservation, TableReservation, HallReservation } from '@/types'

// ============================================
// RESERVATION DETAILS MODAL
// ============================================

interface ReservationDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation: Reservation | null
  onConfirm?: (reservation: Reservation) => void
  onCancel?: (reservation: Reservation) => void
  getHallById?: (id: number | string) => { images?: string[] } | null
}

export function ReservationDetailsModal({
  open,
  onOpenChange,
  reservation,
  onConfirm,
  onCancel,
  getHallById,
}: ReservationDetailsModalProps) {
  if (!reservation) return null

  const isTableReservation = reservation.type === 'table'
  const tableReservation = isTableReservation ? (reservation as TableReservation) : null
  const hallReservation = !isTableReservation ? (reservation as HallReservation) : null

  const statusConfig = {
    pending: { label: 'En attente', variant: 'warning' as const, color: 'text-amber-600' },
    confirmed: { label: 'Confirmée', variant: 'success' as const, color: 'text-green-600' },
    cancelled: { label: 'Annulée', variant: 'error' as const, color: 'text-red-600' },
  }

  const status = statusConfig[reservation.status]

  const hallImage = hallReservation && getHallById ? getHallById(hallReservation.hallId)?.images?.[0] : null

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Réservation ${isTableReservation ? 'de Table' : 'de Salle'}`}
      description={`Détails de la réservation ${reservation.id}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Hall Image for hall reservations */}
        {hallReservation && hallImage && (
          <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src={hallImage}
              alt={hallReservation.hallName}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <Badge variant={status.variant} size="lg">
            {status.label}
          </Badge>
          <Badge variant={isTableReservation ? 'default' : 'primary'} size="lg">
            {isTableReservation ? (
              <>
                <UtensilsCrossed className="w-3 h-3 mr-1" />
                Table
              </>
            ) : (
              <>
                <Building2 className="w-3 h-3 mr-1" />
                Salle
              </>
            )}
          </Badge>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">Informations Client</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Nom:</span>
              <span>{reservation.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-gray-500" />
              <a href={`tel:${reservation.customerPhone}`} className="hover:text-[#F4A024] transition-colors">
                {reservation.customerPhone}
              </a>
            </div>
            {reservation.customerEmail && (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href={`mailto:${reservation.customerEmail}`} className="hover:text-[#F4A024] transition-colors">
                  {reservation.customerEmail}
                </a>
              </div>
            )}
            {hallReservation?.organization && (
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Organisation:</span>
                <span>{hallReservation.organization}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reservation Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Détails de la Réservation</h3>

          {isTableReservation && tableReservation ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(tableReservation.date, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Heure</p>
                <p className="font-medium text-gray-900">{tableReservation.time}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Nombre de personnes</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <p className="font-medium text-gray-900">
                    {tableReservation.partySize} {tableReservation.partySize === 1 ? 'personne' : 'personnes'}
                  </p>
                </div>
              </div>
              {tableReservation.tableNumber && (
                <div className="space-y-1">
                  <p className="text-gray-500">Table</p>
                  <p className="font-medium text-[#F4A024]">Table {tableReservation.tableNumber}</p>
                </div>
              )}
            </div>
          ) : hallReservation ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">Salle</p>
                <p className="font-medium text-[#F4A024]">{hallReservation.hallName}</p>
              </div>
              {hallReservation.eventType && (
                <div className="space-y-1">
                  <p className="text-gray-500">Type d'événement</p>
                  <p className="font-medium text-gray-900">{hallReservation.eventType}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-gray-500">Date de début</p>
                <p className="font-medium text-gray-900">
                  {formatDate(hallReservation.startDate, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Date de fin</p>
                <p className="font-medium text-gray-900">
                  {formatDate(hallReservation.endDate, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {hallReservation.expectedGuests && (
                <div className="space-y-1">
                  <p className="text-gray-500">Invités attendus</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-900">
                      {hallReservation.expectedGuests} {hallReservation.expectedGuests === 1 ? 'personne' : 'personnes'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {(tableReservation?.notes || hallReservation?.notes) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700 italic">
                &quot;{(tableReservation?.notes || hallReservation?.notes)}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Créée le {formatDate(reservation.createdAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        {/* Actions */}
        {reservation.status === 'pending' && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onConfirm?.(reservation)
                onOpenChange(false)
              }}
              className="gap-2 flex-1"
            >
              <CheckCircle className="w-4 h-4" />
              Confirmer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onCancel?.(reservation)
                onOpenChange(false)
              }}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Annuler
            </Button>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
