'use client'

import Link from 'next/link'
import { Construction, Settings } from 'lucide-react'

const DEFAULT_MESSAGE = 'Système en maintenance. Les réservations et commandes sont temporairement indisponibles. Réessayez plus tard.'

interface MaintenanceOverlayProps {
  /** Afficher l’overlay (ex. maintenanceMode ou maintenanceMode && pathname !== '/dashboard/settings') */
  visible: boolean
  /** Message personnalisé (optionnel) */
  message?: string
  /** Si fourni, affiche un lien vers la page paramètres pour désactiver le mode (ex. dashboard) */
  settingsPath?: string
}

export function MaintenanceOverlay({ visible, message = DEFAULT_MESSAGE, settingsPath }: MaintenanceOverlayProps) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm"
      aria-live="assertive"
      role="alert"
    >
      <div className="mx-4 max-w-md rounded-xl bg-white p-8 shadow-xl text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Construction className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Mode maintenance</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        {settingsPath && (
          <Link
            href={settingsPath}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F4A024] px-4 py-2 text-sm font-medium text-white hover:bg-[#C97F16]"
          >
            <Settings className="h-4 w-4" />
            Accès Paramètres (désactiver la maintenance)
          </Link>
        )}
      </div>
    </div>
  )
}
