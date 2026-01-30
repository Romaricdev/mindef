'use client'

import { useState, useMemo, useEffect } from 'react'
import { BaseModal } from '@/components/modals'
import { Button, Input } from '@/components/ui'
import { Users, CheckCircle, AlertCircle, Loader2, DoorOpen } from 'lucide-react'
import { useTableReservationsByTable } from '@/hooks'
import { isReservationActiveNow } from '@/lib/utils'
import { getCurrentPartySizeForTable } from '@/lib/data/orders'
import type { RestaurantTable } from '@/types'

const RESERVATION_WINDOW_MINUTES = 10

interface TableConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: RestaurantTable | null
  onStartOrder: (
    tableId: number,
    tableNumber: number,
    partySize: number | undefined,
    status: 'available' | 'occupied' | 'reserved'
  ) => void
  onReleaseTable?: (tableNumber: number) => Promise<void>
}

export function TableConfigModal({
  open,
  onOpenChange,
  table,
  onStartOrder,
  onReleaseTable,
}: TableConfigModalProps) {
  const [partySize, setPartySize] = useState<string>('')
  const [status, setStatus] = useState<
    'available' | 'occupied' | 'reserved'
  >('available')
  const [currentPartySize, setCurrentPartySize] = useState<number | null>(null)
  const [loadingPartySize, setLoadingPartySize] = useState(false)
  const [releasing, setReleasing] = useState(false)

  const { data: reservations, loading: loadingReservations } =
    useTableReservationsByTable(table?.number ?? null)

  const hasActiveReservation = useMemo(
    () =>
      (reservations ?? []).some((r) =>
        isReservationActiveNow(r, RESERVATION_WINDOW_MINUTES)
      ),
    [reservations]
  )

  // Toujours permettre de créer une commande, même si la table est occupée
  const canConfigure = useMemo(() => {
    if (!table || loadingReservations) return false
    // Permettre toujours de créer une commande, même si occupée
    return true
  }, [table, loadingReservations])

  // Calculer le nombre de places disponibles
  const availableSeats = useMemo(() => {
    if (!table) return 0
    if (currentPartySize === null) return table.capacity
    return Math.max(0, table.capacity - currentPartySize)
  }, [table, currentPartySize])

  // Vérifier si la capacité est atteinte
  const isCapacityReached = useMemo(() => {
    if (!table || currentPartySize === null) return false
    return currentPartySize >= table.capacity
  }, [table, currentPartySize])

  // Validation : le nombre de personnes ne doit pas dépasser les places disponibles.
  // Table occupée : on peut toujours créer une nouvelle commande sans ressaisir le nombre de personnes.
  const isValid = useMemo(() => {
    if (table?.status === 'occupied') return true
    if (isCapacityReached) return true
    if (!partySize) return false
    const size = parseInt(partySize, 10)
    if (size < 1) return false
    return size <= availableSeats
  }, [table?.status, partySize, isCapacityReached, availableSeats])

  const submitDisabled = !canConfigure || !isValid

  // Charger le nombre de personnes actuellement à la table si elle est occupée
  useEffect(() => {
    if (table && table.status === 'occupied' && open) {
      setLoadingPartySize(true)
      getCurrentPartySizeForTable(table.number)
        .then((size) => {
          setCurrentPartySize(size)
          setLoadingPartySize(false)
        })
        .catch((error) => {
          console.error('[TableConfigModal] Error loading party size:', error)
          setCurrentPartySize(null)
          setLoadingPartySize(false)
        })
    } else {
      setCurrentPartySize(null)
    }
  }, [table?.id, table?.status, open])

  useEffect(() => {
    if (table) {
      setPartySize('')
      setStatus(table.status === 'available' ? 'available' : 'reserved')
    }
  }, [table?.id])

  if (!table) return null

  const handleStartOrder = () => {
    if (!canConfigure) return

    // Si la capacité est atteinte, on ne peut pas ajouter de personnes, mais on peut créer une commande
    // Dans ce cas, on passe undefined pour ne pas compter dans le calcul du nombre de personnes
    let size: number | undefined = undefined
    if (!isCapacityReached && partySize) {
      size = parseInt(partySize, 10) || undefined
      // S'assurer que le nombre ne dépasse pas les places disponibles
      if (size && size > availableSeats) {
        size = availableSeats
      }
      // S'assurer qu'on a au moins 1 personne si on saisit quelque chose
      if (size && size < 1) {
        size = 1
      }
    }
    
    const effectiveStatus =
      hasActiveReservation ? 'occupied' : status
    // Passer undefined si la capacité est atteinte (ou le nombre saisi si valide)
    onStartOrder(table.id as number, table.number, size, effectiveStatus)
    onOpenChange(false)
    setPartySize('')
    setStatus('available')
  }

  const handleReleaseTable = async () => {
    if (!onReleaseTable || !table) return
    
    setReleasing(true)
    try {
      await onReleaseTable(table.number)
      onOpenChange(false)
      // La table sera rafraîchie automatiquement via les props
    } catch (error) {
      console.error('[TableConfigModal] Error releasing table:', error)
      // On peut afficher une notification d'erreur ici si nécessaire
    } finally {
      setReleasing(false)
    }
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Table ${table.number}`}
      description="Configurez la table avant de commencer la commande"
      maxWidth="sm"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#F4A024]/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#F4A024]">
              {table.number}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Capacité maximale</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {table.capacity} personnes
            </p>
            {/* Afficher le nombre de personnes actuellement à la table si occupée */}
            {table.status === 'occupied' && (
              <div className="mt-2">
                {loadingPartySize ? (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Chargement...
                  </div>
                ) : currentPartySize !== null ? (
                  <p className="text-xs text-amber-600 font-medium">
                    Actuellement: {currentPartySize} {currentPartySize === 1 ? 'personne' : 'personnes'}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {loadingReservations && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Vérification des réservations…
          </div>
        )}

        {table.status === 'occupied' && !loadingReservations && (
          <div className="space-y-3">
            <div className="flex gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">
                  Cette table est occupée. Vous pouvez toujours créer une nouvelle commande pour cette table.
                </p>
              </div>
            </div>
            {onReleaseTable && (
              <Button
                variant="secondary"
                onClick={handleReleaseTable}
                disabled={releasing}
                className="w-full gap-2"
              >
                {releasing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Libération...
                  </>
                ) : (
                  <>
                    <DoorOpen className="w-4 h-4" />
                    Libérer la table
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="partySize"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Nombre de personnes{' '}
            {table.status !== 'occupied' && !isCapacityReached && <span className="text-red-500">*</span>}
            {table.status === 'occupied' && (
              <span className="ml-2 text-xs font-normal text-gray-500">(optionnel pour ajouter une commande)</span>
            )}
            {table.status !== 'occupied' && !isCapacityReached && currentPartySize !== null && currentPartySize > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                (Places disponibles: {availableSeats})
              </span>
            )}
            {table.status !== 'occupied' && isCapacityReached && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                (Optionnel - capacité atteinte)
              </span>
            )}
          </label>
          <Input
            id="partySize"
            type="number"
            min={1}
            max={isCapacityReached ? 0 : availableSeats}
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            placeholder={
              table.status === 'occupied'
                ? `Optionnel — actuellement ${currentPartySize ?? '…'} pers.`
                : isCapacityReached
                  ? 'Capacité maximale atteinte'
                  : `1 à ${availableSeats} personne${availableSeats > 1 ? 's' : ''}`
            }
            disabled={isCapacityReached || loadingPartySize}
            className="w-full"
          />
          {isCapacityReached ? (
            <p className="mt-1 text-xs text-amber-600 font-medium">
              ⚠️ La capacité maximale de la table est atteinte ({currentPartySize}/{table.capacity} personnes). 
              Vous pouvez toujours créer une commande, mais sans ajouter de personnes.
            </p>
          ) : (
            <>
              {partySize && parseInt(partySize, 10) < 1 && (
                <p className="mt-1 text-xs text-red-500">
                  Le nombre doit être au moins 1
                </p>
              )}
              {partySize && parseInt(partySize, 10) > availableSeats && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠️ Il ne reste que {availableSeats} place{availableSeats > 1 ? 's' : ''} disponible{availableSeats > 1 ? 's' : ''} sur cette table
                </p>
              )}
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            État de la table
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStatus('available')}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${
                  status === 'available'
                    ? 'border-[#F4A024] bg-[#F4A024]/10 text-[#F4A024]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <span className="text-xs font-medium">Libre</span>
            </button>
            <button
              type="button"
              onClick={() => setStatus('occupied')}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${
                  status === 'occupied'
                    ? 'border-[#F4A024] bg-[#F4A024]/10 text-[#F4A024]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <span className="text-xs font-medium">Occupée</span>
            </button>
            <button
              type="button"
              onClick={() => setStatus('reserved')}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${
                  status === 'reserved'
                    ? 'border-[#F4A024] bg-[#F4A024]/10 text-[#F4A024]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <span className="text-xs font-medium">Réservée</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleStartOrder}
            disabled={submitDisabled}
            className="flex-1 gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Démarrer la commande
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
