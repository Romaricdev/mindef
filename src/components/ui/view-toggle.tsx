'use client'

import * as React from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'card' | 'list'

export interface ViewToggleProps {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  className?: string
}

export function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
  return (
    <div className={cn('inline-flex rounded-lg border border-gray-200 bg-white p-1', className)}>
      <button
        type="button"
        onClick={() => onViewChange('card')}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A024] focus-visible:ring-offset-2',
          view === 'card'
            ? 'bg-[#F4A024] text-white shadow-sm'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        )}
        aria-label="Vue en cartes"
        aria-pressed={view === 'card'}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onViewChange('list')}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A024] focus-visible:ring-offset-2',
          view === 'list'
            ? 'bg-[#F4A024] text-white shadow-sm'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        )}
        aria-label="Vue en liste"
        aria-pressed={view === 'list'}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}
