'use client'

import { useEffect, useState } from 'react'
import { PosLayout } from '@/components/pos'
import { usePosData } from '@/hooks'
import { initPosSync } from '@/lib/pos-sync'
import { fetchTables } from '@/lib/data/tables'
import type { MenuItem, RestaurantTable } from '@/types'

export default function PosPage() {
  const { data, loading, error, refetch } = usePosData()
  const [tables, setTables] = useState<RestaurantTable[]>(data.tables)

  useEffect(() => {
    return initPosSync()
  }, [])

  // Rafraîchir les tables toutes les 10 secondes pour voir les changements de statut (seulement si en ligne)
  useEffect(() => {
    const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine
    
    const refreshTables = async () => {
      if (!isOnline()) return
      try {
        const updatedTables = await fetchTables()
        setTables(updatedTables)
      } catch (error) {
        console.error('[POS] Error refreshing tables:', error)
      }
    }

    refreshTables()
    const interval = setInterval(refreshTables, 10000) // Toutes les 10 secondes
    return () => clearInterval(interval)
  }, [])

  // Mettre à jour les tables quand les données changent
  useEffect(() => {
    if (data.tables.length > 0) {
      setTables(data.tables)
    }
  }, [data.tables])

  const { products, categories, dailyMenus, onlineOrders } = data

  const getProductById = (id: number | string): MenuItem | undefined =>
    products.find((p) => p.id === id)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Chargement du POS…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <PosLayout
      tables={tables}
      products={products}
      categories={categories}
      dailyMenus={dailyMenus}
      onlineOrders={onlineOrders}
      getProductById={getProductById}
    />
  )
}
