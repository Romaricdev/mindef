import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AppSettings {
  restaurant_name: string
  restaurant_address: string
  restaurant_phone: string
  restaurant_email: string
  opening_hours_weekdays?: string
  opening_hours_weekends?: string
  delivery_fee: number
  service_fee_rate: number
  service_fee_min: number
  time_slots: string[]
}

const defaultSettings: AppSettings = {
  restaurant_name: 'Mess des Officiers',
  restaurant_address: 'Quartier Général, Yaoundé',
  restaurant_phone: '+237 6XX XXX XXX',
  restaurant_email: 'contact@messofficiers.cm',
  opening_hours_weekdays: '11h30 - 22h00',
  opening_hours_weekends: '12h00 - 23h00',
  delivery_fee: 1500,
  service_fee_rate: 0.1,
  service_fee_min: 500,
  time_slots: [
    '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  ],
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      
      // Logger pour déboguer
      console.log('[useAppSettings] Loading settings from app_settings table...')
      
      // Fonction helper pour charger les settings avec gestion des AbortError
      const fetchSettings = async (): Promise<{ data: any; error: any }> => {
        try {
          const { data, error } = await supabase
            .from('app_settings')
            .select('key, value')
          return { data, error }
        } catch (error: any) {
          // Si c'est une AbortError (React Strict Mode), on la retourne pour réessayer
          if (error?.message?.includes('AbortError') || error?.message?.includes('aborted')) {
            return { data: null, error: { message: 'AbortError', code: 'ABORTED' } }
          }
          return { data: null, error }
        }
      }

      // Essayer de charger les settings (avec retry si AbortError)
      let settingsResult = await fetchSettings()
      
      // Si AbortError, réessayer une fois après un court délai
      if (settingsResult.error?.message === 'AbortError' || settingsResult.error?.code === 'ABORTED') {
        console.log('[useAppSettings] Settings fetch aborted (React Strict Mode), retrying after 300ms...')
        await new Promise(resolve => setTimeout(resolve, 300))
        settingsResult = await fetchSettings()
      }

      const { data, error } = settingsResult

      if (error) {
        // Ignorer les AbortError après retry (elles sont normales en dev)
        if (error.message === 'AbortError' || error.code === 'ABORTED') {
          console.log('[useAppSettings] Settings fetch still aborted after retry, using defaults')
        } else {
          // Logger l'erreur avec tous les détails possibles
          console.error('[useAppSettings] Error loading app settings:', {
            code: error.code || 'NO_CODE',
            message: error.message || 'NO_MESSAGE',
            details: error.details || 'NO_DETAILS',
            hint: error.hint || 'NO_HINT',
            fullError: error,
          })
        }
        
        // En cas d'erreur, on garde les valeurs par défaut
        // C'est OK si la table n'existe pas encore ou si RLS bloque
        console.warn('[useAppSettings] Using default settings due to error')
        setSettings(defaultSettings)
        setLoading(false)
        return
      }

      console.log('[useAppSettings] Settings loaded successfully, count:', data?.length || 0)

      // Convertir les données de la base en objet settings
      const loadedSettings: Partial<AppSettings> = { ...defaultSettings }
      
      if (data) {
        ;(data as Array<{ key: string; value: unknown }>).forEach((item) => {
          const key = item.key as keyof AppSettings
          const value = item.value
          
          // Gérer les différents types de valeurs JSONB
          if (key === 'time_slots') {
            if (Array.isArray(value)) {
              loadedSettings[key] = value as string[]
            } else if (typeof value === 'string') {
              try {
                loadedSettings[key] = JSON.parse(value) as string[]
              } catch {
                loadedSettings[key] = defaultSettings.time_slots
              }
            }
          } else if (key === 'delivery_fee' || key === 'service_fee_rate' || key === 'service_fee_min') {
            if (typeof value === 'number') {
              loadedSettings[key] = value
            } else if (typeof value === 'string') {
              const num = Number(value)
              if (!isNaN(num)) {
                loadedSettings[key] = num
              }
            }
          } else {
            if (typeof value === 'string') {
              loadedSettings[key] = value
            } else {
              loadedSettings[key] = String(value)
            }
          }
        })
      }

      setSettings(loadedSettings as AppSettings)
      console.log('[useAppSettings] Settings processed and set')
    } catch (error) {
      // Logger l'erreur avec plus de détails
      console.error('[useAppSettings] Unexpected error in loadSettings:', {
        error,
        errorType: typeof error,
        isError: error instanceof Error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  return {
    settings,
    loading,
    // Helpers pour faciliter l'accès
    restaurantInfo: {
      name: settings.restaurant_name,
      address: settings.restaurant_address,
      phone: settings.restaurant_phone,
      email: settings.restaurant_email,
      openingHours: {
        weekdays: settings.opening_hours_weekdays || '11h30 - 22h00',
        weekends: settings.opening_hours_weekends || '12h00 - 23h00',
      },
    },
    deliveryFee: settings.delivery_fee,
    timeSlots: settings.time_slots,
    serviceFeeRate: settings.service_fee_rate,
    serviceFeeMin: settings.service_fee_min,
  }
}
