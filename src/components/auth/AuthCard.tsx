'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui'

const SITE_LOGO_URL = 'https://nlpizsiqsanewubknrsu.supabase.co/storage/v1/object/public/images/images_public/logo.png'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-md">
        {/* Logo (même que le header du site) */}
        <div className="text-center mb-8">
          <Link href="/home" className="inline-block">
            <div className="relative w-36 h-12 sm:w-44 sm:h-14 mx-auto">
              <Image
                src={SITE_LOGO_URL}
                alt=""
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 144px, 176px"
                unoptimized
              />
            </div>
          </Link>
        </div>

        {/* Card */}
        <Card variant="site" padding="lg" className="shadow-xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 text-sm">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form Content */}
            <div className="space-y-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                {footer}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
