'use client'

import { useEffect } from 'react'
import { updateTableStatusesFromReservations } from '@/lib/data/reservations'

/**
 * Hook pour vérifier périodiquement les réservations et mettre à jour les statuts des tables.
 * Vérifie toutes les 30 secondes et marque les tables comme "reserved" 15 minutes avant l'heure de réservation.
 */
export function useTableReservations() {
  useEffect(() => {
    // Vérifier immédiatement au montage
    updateTableStatusesFromReservations().catch((error) => {
      console.error('[useTableReservations] Error updating table statuses:', error)
    })

    // Vérifier toutes les 30 secondes
    const interval = setInterval(() => {
      updateTableStatusesFromReservations().catch((error) => {
        console.error('[useTableReservations] Error updating table statuses:', error)
      })
    }, 30000) // 30 secondes

    return () => clearInterval(interval)
  }, [])
}
