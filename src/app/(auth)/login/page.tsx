'use client'

import { AuthCard, LoginForm } from '@/components/auth'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <AuthCard
      title="Connexion"
      subtitle="Connectez-vous à votre compte pour continuer"
      footer={
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous n&apos;avez pas de compte ?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#F4A024] hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthCard>
  )
}
