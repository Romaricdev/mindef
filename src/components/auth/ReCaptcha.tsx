'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReCaptchaProps {
  onVerify: (verified: boolean) => void
  error?: boolean
}

export function ReCaptcha({ onVerify, error }: ReCaptchaProps) {
  const [isChecked, setIsChecked] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // Reset verification when component mounts or error occurs
    if (error) {
      setIsChecked(false)
      setIsVerified(false)
      onVerify(false)
    }
  }, [error, onVerify])

  const handleCheck = async () => {
    if (isVerified) {
      // Uncheck
      setIsChecked(false)
      setIsVerified(false)
      onVerify(false)
      return
    }

    setIsChecked(true)
    setIsVerifying(true)

    // Simulate reCAPTCHA verification (mock delay)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsVerifying(false)
    setIsVerified(true)
    onVerify(true)
  }

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={handleCheck}
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200',
          isVerified
            ? 'bg-[#F4A024] border-[#F4A024]'
            : error
            ? 'border-red-500 bg-white'
            : 'border-gray-300 bg-white hover:border-[#F4A024]',
          isVerifying && 'opacity-50 cursor-wait'
        )}
        disabled={isVerifying}
        aria-label="reCAPTCHA checkbox"
      >
        {isVerifying ? (
          <div className="w-4 h-4 border-2 border-[#F4A024] border-t-transparent rounded-full animate-spin" />
        ) : isVerified ? (
          <Check className="w-4 h-4 text-white" />
        ) : null}
      </button>
      <div className="flex-1">
        <p className="text-sm text-gray-700">
          Je ne suis pas un robot
        </p>
        {error && (
          <p className="text-xs text-red-500 mt-1">
            Veuillez vérifier que vous n&apos;êtes pas un robot
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          reCAPTCHA protège ce site contre les abus
        </p>
      </div>
    </div>
  )
}
