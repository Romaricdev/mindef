import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { BackOnlineToast } from '@/components/BackOnlineToast'

export const metadata: Metadata = {
  title: 'Mess des Officiers',
  description: 'Système de gestion de restaurant - Mess des Officiers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
          <BackOnlineToast />
        </AuthProvider>
      </body>
    </html>
  )
}
