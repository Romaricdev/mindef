'use client'

import { Card, CardContent } from '@/components/ui'
import { ChefHat } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/home" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4A024] flex items-center justify-center">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-xl text-gray-900">
              Mess des Officiers
            </span>
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
