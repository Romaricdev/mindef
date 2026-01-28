'use client'

import { usePathname } from 'next/navigation'
import { DashboardSidebar, DashboardTopbar } from '@/components/layout/dashboard'
import { Toaster } from '@/components/ui'
import { useRequireAdmin } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { loading, user, isAdmin, isAuthenticated } = useRequireAdmin()
  const initialized = useAuthStore((state) => state.initialized)

  // POS has its own full-screen layout
  if (pathname === '/dashboard/pos') {
    return <>{children}</>
  }

  // Afficher un loader pendant la vérification de l'authentification
  // Attendre que l'utilisateur soit complètement chargé avant de vérifier
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F4A024] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    )
  }

  // Si l'utilisateur n'est pas admin, useRequireAdmin aura déjà redirigé
  // Mais on ajoute une vérification de sécurité supplémentaire
  if (!isAdmin) {
    // En développement, afficher un message au lieu de null pour déboguer
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-red-600">Accès refusé - Utilisateur n'est pas admin</p>
            <p className="text-sm text-gray-500 mt-2">User: {user?.email} (Role: {user?.role})</p>
          </div>
        </div>
      )
    }
    return null // Le hook a déjà déclenché la redirection
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <DashboardTopbar />
      <main className="dashboard-content">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
