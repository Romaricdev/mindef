import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================
// BASE SKELETON COMPONENT
// ============================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'shimmer' | 'pulse'
}

function Skeleton({ className, variant = 'shimmer', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-gray-200',
        variant === 'shimmer'
          ? 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer'
          : 'animate-skeleton-pulse',
        className
      )}
      {...props}
    />
  )
}

// ============================================
// SKELETON CARD
// ============================================

interface SkeletonCardProps {
  hasImage?: boolean
  imageHeight?: string
  lines?: number
  className?: string
}

function SkeletonCard({
  hasImage = false,
  imageHeight = 'h-32',
  lines = 3,
  className
}: SkeletonCardProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg overflow-hidden', className)}>
      {hasImage && (
        <Skeleton className={cn('w-full', imageHeight)} />
      )}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-4', i === lines - 1 ? 'w-1/2' : 'w-full')}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// SKELETON KPI (Dashboard Stats)
// ============================================

interface SkeletonKPIProps {
  className?: string
}

function SkeletonKPI({ className }: SkeletonKPIProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-4', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

// ============================================
// SKELETON TABLE
// ============================================

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-100 last:border-0 px-4 py-3">
          <div className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className={cn(
                  'h-4 flex-1',
                  colIndex === 0 && 'max-w-[120px]'
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// SKELETON LIST
// ============================================

interface SkeletonListProps {
  items?: number
  hasAvatar?: boolean
  className?: string
}

function SkeletonList({ items = 5, hasAvatar = false, className }: SkeletonListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {hasAvatar && (
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// SKELETON STATS ROW
// ============================================

interface SkeletonStatsRowProps {
  count?: number
  className?: string
}

function SkeletonStatsRow({ count = 4, className }: SkeletonStatsRowProps) {
  return (
    <div className={cn('grid gap-4', className)} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonKPI key={i} />
      ))}
    </div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonKPI,
  SkeletonTable,
  SkeletonList,
  SkeletonStatsRow
}
