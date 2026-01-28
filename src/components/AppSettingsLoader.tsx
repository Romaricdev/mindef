'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cart-store'

/**
 * Composant qui charge les paramètres de l'application au démarrage
 * et les met à jour dans les stores
 */
export function AppSettingsLoader() {
  const loadDeliveryFee = useCartStore((state) => state.loadDeliveryFee)

  useEffect(() => {
    // Charger le frais de livraison au démarrage
    loadDeliveryFee()
  }, [loadDeliveryFee])

  return null // Ce composant ne rend rien
}
