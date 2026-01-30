'use client'

import { useEffect } from 'react'
import { MaintenanceOverlay } from '@/components/MaintenanceOverlay'
import { useAppSettings } from '@/hooks'

export default function TableLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { maintenanceMode, refetch } = useAppSettings()

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('app-settings-updated', handler)
    return () => window.removeEventListener('app-settings-updated', handler)
  }, [refetch])

  return (
    <div className="min-h-screen">
      <MaintenanceOverlay visible={maintenanceMode} />
      {children}
    </div>
  )
}
