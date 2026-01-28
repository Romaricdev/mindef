'use client'

import { AuthCard, RegisterForm } from '@/components/auth'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <AuthCard
      title="Créer un compte"
      subtitle="Rejoignez-nous pour profiter de nos services"
      footer={
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#F4A024] hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      }
    >
      <RegisterForm />
    </AuthCard>
  )
}
