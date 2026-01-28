'use client'

import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePosStore } from '@/store/pos-store'
import { getCurrentPartySizeForTable } from '@/lib/data/orders'
import type { RestaurantTable } from '@/types'

interface TablesPanelProps {
  tables: RestaurantTable[]
  onTableClick: (table: RestaurantTable) => void
}

export function TablesPanel({ tables, onTableClick }: TablesPanelProps) {
  const { selectedTableId, tableOrders } = usePosStore()
  const [partySizes, setPartySizes] = useState<Map<number, number>>(new Map())

  // Charger le nombre de personnes pour les tables occupées
  useEffect(() => {
    const loadPartySizes = async () => {
      const sizes = new Map<number, number>()
      const occupiedTables = tables.filter((t) => t.status === 'occupied')
      
      for (const table of occupiedTables) {
        try {
          const size = await getCurrentPartySizeForTable(table.number)
          if (size > 0) {
            sizes.set(table.number, size)
          }
        } catch (error) {
          console.error(`[TablesPanel] Error loading party size for table ${table.number}:`, error)
        }
      }
      
      setPartySizes(sizes)
    }

    loadPartySizes()
    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(loadPartySizes, 10000)
    return () => clearInterval(interval)
  }, [tables])

  const getTableStatus = (table: RestaurantTable) => {
    // Check if table has an active POS order
    if (tableOrders.has(table.id as number)) {
      return 'pos-active'
    }
    return table.status
  }

  const statusConfig = {
    'available': {
      bg: 'bg-white hover:bg-gray-50',
      border: 'border-gray-200',
      dot: 'bg-green-500',
      label: 'Libre',
    },
    'occupied': {
      bg: 'bg-white hover:bg-gray-50',
      border: 'border-gray-200',
      dot: 'bg-red-500',
      label: 'Occupée',
    },
    'reserved': {
      bg: 'bg-white hover:bg-gray-50',
      border: 'border-gray-200',
      dot: 'bg-amber-500',
      label: 'Réservée',
    },
    'pos-active': {
      bg: 'bg-[#F4A024]/10 hover:bg-[#F4A024]/20',
      border: 'border-[#F4A024]',
      dot: 'bg-[#F4A024]',
      label: 'En cours',
    },
  }

  return (
    <div className="p-4">
      {!selectedTableId && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-sm text-gray-600 font-medium">Sélectionnez une table pour commencer</p>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tables.map((table) => {
          const status = getTableStatus(table)
          const config = statusConfig[status as keyof typeof statusConfig]
          const isSelected = selectedTableId === table.id
          const hasOrder = tableOrders.has(table.id as number)
          const orderItemCount = hasOrder
            ? tableOrders.get(table.id as number)?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0
            : 0

          return (
            <button
              key={table.id}
              onClick={() => onTableClick(table)}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all duration-200',
                'flex flex-col items-center justify-center gap-2',
                'min-h-[90px]',
                config.bg,
                config.border,
                isSelected && 'ring-2 ring-[#F4A024] ring-offset-2 ring-offset-white'
              )}
            >
              {/* Status dot */}
              <div className={cn('absolute top-2 right-2 w-2 h-2 rounded-full', config.dot)} />

              {/* Table number */}
              <span className="text-2xl font-bold text-gray-900">
                {table.number}
              </span>

              {/* Capacity / Current party size */}
              <div className="flex flex-col items-center gap-0.5 text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="w-3.5 h-3.5" />
                  <span>{table.capacity}</span>
                </div>
                {/* Afficher le nombre de personnes actuellement à la table si occupée */}
                {table.status === 'occupied' && partySizes.has(table.number) && (
                  <span className="text-[10px] text-amber-600 font-medium">
                    {partySizes.get(table.number)} {partySizes.get(table.number) === 1 ? 'pers.' : 'pers.'}
                  </span>
                )}
              </div>

              {/* Order badge */}
              {hasOrder && orderItemCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#F4A024] rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-white">
                    {orderItemCount}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
