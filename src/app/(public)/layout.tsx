'use client'

import { PublicHeader, PublicFooter, WhatsAppButton } from '@/components/layout/public'
import { PageTransition } from '@/components/animations'
import { AppSettingsLoader } from '@/components/AppSettingsLoader'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Load app settings */}
      <AppSettingsLoader />
      
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
