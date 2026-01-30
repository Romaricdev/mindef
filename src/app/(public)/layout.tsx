'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PublicHeader, PublicFooter, WhatsAppButton } from '@/components/layout/public'
import { PageTransition } from '@/components/animations'
import { AppSettingsLoader } from '@/components/AppSettingsLoader'
import { MaintenanceOverlay } from '@/components/MaintenanceOverlay'
import { useAppSettings } from '@/hooks'

/** Routes du site public où des actions (réservation, commande) sont possibles → overlay maintenance. */
const MAINTENANCE_PUBLIC_PATHS = ['/reservation', '/cart', '/menu']

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { maintenanceMode, refetch } = useAppSettings()

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('app-settings-updated', handler)
    return () => window.removeEventListener('app-settings-updated', handler)
  }, [refetch])

  const isActionPage = pathname ? MAINTENANCE_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/')) : false
  const showMaintenanceOverlay = maintenanceMode && isActionPage

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Load app settings */}
      <AppSettingsLoader />

      {/* Mode maintenance : bloque uniquement les pages avec réservations / commandes */}
      <MaintenanceOverlay visible={showMaintenanceOverlay} />

      {/* Header - Sticky Navigation */}
      <PublicHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Footer */}
      <PublicFooter />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  )
}
