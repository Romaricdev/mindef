'use client'

import { BaseModal } from './BaseModal'
import { Badge, Button } from '@/components/ui'
import {
  UtensilsCrossed,
  Users,
  Calendar,
  Edit,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { useTableReservationsByTable } from '@/hooks'
import type { RestaurantTable } from '@/types'

const STATUS_CONFIG = {
  available: { label: 'Libre', variant: 'success' as const },
  occupied: { label: 'Occupée', variant: 'error' as const },
  reserved: { label: 'Réservée', variant: 'warning' as const },
}

interface TableDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: RestaurantTable | null
  onEdit?: (table: RestaurantTable) => void
  onDisable?: (table: RestaurantTable) => void
}

export function TableDetailsModal({
  open,
  onOpenChange,
  table,
  onEdit,
  onDisable,
}: TableDetailsModalProps) {
  const { data: upcomingReservations, loading: loadingReservations } =
    useTableReservationsByTable(table?.number ?? null)

  if (!table) return null

  const status = STATUS_CONFIG[table.status]

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Table ${table.number}`}
      description={`Détails et historique de la table ${table.number}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-[#F4A024]/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#F4A024]">
              {table.number}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                Table {table.number}
              </h3>
              <Badge variant={status.variant} size="lg">
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  Capacité: {table.capacity}{' '}
                  {table.capacity === 1 ? 'personne' : 'personnes'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F4A024]" />
            Réservations à venir
          </h4>
          {loadingReservations ? (
            <div className="flex items-center justify-center py-8 gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Chargement…</span>
            </div>
          ) : upcomingReservations.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              Aucune réservation à venir pour cette table.
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingReservations.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-50 rounded-lg p-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">
                      {r.customerName}
                    </span>
                    <span className="text-gray-500">
                      {r.date} à {r.time}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {r.partySize}{' '}
                    {r.partySize === 1 ? 'personne' : 'personnes'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onEdit?.(table)
              onOpenChange(false)
            }}
            className="gap-2 flex-1"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          {table.status !== 'occupied' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onDisable?.(table)
                onOpenChange(false)
              }}
              className="gap-2"
            >
              <EyeOff className="w-4 h-4" />
              Désactiver
            </Button>
          )}
        </div>
      </div>
    </BaseModal>
  )
}
