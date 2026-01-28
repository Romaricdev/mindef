'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Calendar,
  Clock,
  Users,
  Phone,
  User,
  Plus,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Badge } from '@/components/ui'
import { NewReservationModal } from './NewReservationModal'
import { useTableReservations } from '@/hooks'
import {
  createTableReservation,
  type CreateTableReservationInput,
} from '@/lib/data'
import type { TableReservation, RestaurantTable } from '@/types'

interface ReservationsPanelProps {
  onSelectTable?: (tableNumber: number) => void
  tables?: RestaurantTable[]
}

type FilterKind = 'today' | 'upcoming' | 'all'

function filterReservations(
  list: TableReservation[],
  filter: FilterKind
): TableReservation[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return list.filter((r) => {
    const d = new Date(r.date)
    d.setHours(0, 0, 0, 0)
    const t = d.getTime()
    const todayT = today.getTime()

    if (filter === 'today') return t === todayT
    if (filter === 'upcoming') return t >= todayT
    return true
  })
}

function sortByDateTime(list: TableReservation[]): TableReservation[] {
  return [...list].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime()
    const dateB = new Date(`${b.date}T${b.time}`).getTime()
    return dateA - dateB
  })
}

function formatReservationDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
} as const

export function ReservationsPanel({
  onSelectTable,
  tables = [],
}: ReservationsPanelProps) {
  const [filter, setFilter] = useState<FilterKind>('today')
  const [modalOpen, setModalOpen] = useState(false)

  const { data: reservations, loading, error, refetch } = useTableReservations()

  const filtered = useMemo(
    () => sortByDateTime(filterReservations(reservations, filter)),
    [reservations, filter]
  )

  const handleCreateReservation = useCallback(
    async (input: CreateTableReservationInput) => {
      await createTableReservation(input)
      await refetch()
    },
    [refetch]
  )

  const handleModalClose = useCallback((open: boolean) => {
    setModalOpen(open)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex gap-2">
          {(['today', 'upcoming', 'all'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                filter === f
                  ? 'bg-[#F4A024] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {f === 'today' ? "Aujourd'hui" : f === 'upcoming' ? 'À venir' : 'Toutes'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
            <Loader2 className="w-10 h-10 text-[#F4A024] animate-spin" />
            <p className="text-sm text-gray-500">Chargement des réservations…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              Réessayer
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-600">Aucune réservation</p>
            <p className="text-xs text-gray-500 mt-1">
              {filter === 'today'
                ? "Pas de réservation pour aujourd'hui"
                : 'Aucune réservation pour ce filtre'}
            </p>
          </div>
        ) : (
          filtered.map((reservation) => {
            const status = STATUS_CONFIG[reservation.status]
            return (
              <div
                key={reservation.id}
                className={cn(
                  'p-3 rounded-lg border bg-white',
                  reservation.status === 'cancelled'
                    ? 'border-gray-200 opacity-60'
                    : 'border-gray-200 hover:border-[#F4A024] transition-colors'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900 text-sm">
                      Table {reservation.tableNumber ?? '?'}
                    </span>
                    <Badge className={cn('text-[10px]', status.color)}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatReservationDate(reservation.date)}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {reservation.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {reservation.partySize} pers.
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {reservation.customerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {reservation.customerPhone}
                  </span>
                </div>

                {reservation.notes && (
                  <p className="text-xs text-gray-500 italic mb-2 truncate">
                    &quot;{reservation.notes}&quot;
                  </p>
                )}

                {reservation.status === 'confirmed' &&
                  reservation.tableNumber != null && (
                    <div className="pt-2 border-t border-gray-100">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          onSelectTable?.(reservation.tableNumber!)
                        }
                        className="w-full text-xs"
                      >
                        Ouvrir Table {reservation.tableNumber}
                      </Button>
                    </div>
                  )}

                {reservation.status === 'pending' && (
                  <p className="pt-2 border-t border-gray-100 text-xs text-amber-600">
                    En attente de confirmation
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-white">
        <Button
          variant="secondary"
          className="w-full gap-2"
          onClick={() => setModalOpen(true)}
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Nouvelle réservation
        </Button>
      </div>

      <NewReservationModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        onSubmit={handleCreateReservation}
        tables={tables}
      />
    </div>
  )
}
