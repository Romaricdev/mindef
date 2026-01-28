import { supabase } from '@/lib/supabase/client'

const DEFAULT_DELIVERY_FEE = 1500

/**
 * Récupère le frais de livraison depuis app_settings
 * Utilisé dans les stores Zustand qui ne peuvent pas utiliser des hooks React
 */
export async function getDeliveryFee(): Promise<number> {
  // Fonction helper pour charger le delivery fee avec gestion des AbortError
  const fetchDeliveryFee = async (): Promise<{ data: any; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'delivery_fee')
        .single()
      return { data, error }
    } catch (error: any) {
      // Si c'est une AbortError (React Strict Mode), on la retourne pour réessayer
      if (error?.message?.includes('AbortError') || error?.message?.includes('aborted')) {
        return { data: null, error: { message: 'AbortError', code: 'ABORTED' } }
      }
      return { data: null, error }
    }
  }

  try {
    // Essayer de charger le delivery fee (avec retry si AbortError)
    let feeResult = await fetchDeliveryFee()
    
    // Si AbortError, réessayer une fois après un court délai
    if (feeResult.error?.message === 'AbortError' || feeResult.error?.code === 'ABORTED') {
      await new Promise(resolve => setTimeout(resolve, 300))
      feeResult = await fetchDeliveryFee()
    }

    const { data, error } = feeResult

    if (error || !data) {
      // Ignorer les AbortError après retry (elles sont normales en dev)
      if (error && error.message !== 'AbortError' && error.code !== 'ABORTED') {
        console.warn('Could not load delivery fee from settings, using default:', error)
      }
      return DEFAULT_DELIVERY_FEE
    }

    const value = data.value
    if (typeof value === 'number') {
      return value
    } else if (typeof value === 'string') {
      const num = Number(value)
      return isNaN(num) ? DEFAULT_DELIVERY_FEE : num
    }

    return DEFAULT_DELIVERY_FEE
  } catch (error) {
    // Ignorer les AbortError dans le catch (déjà gérées ci-dessus)
    if (error instanceof Error && (error.message.includes('AbortError') || error.message.includes('aborted'))) {
      return DEFAULT_DELIVERY_FEE
    }
    console.error('Error loading delivery fee:', error)
    return DEFAULT_DELIVERY_FEE
  }
}

/**
 * Cache pour éviter de charger plusieurs fois
 */
let deliveryFeeCache: number | null = null
let deliveryFeeCacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Récupère le frais de livraison avec cache
 */
export async function getDeliveryFeeCached(): Promise<number> {
  const now = Date.now()
  
  if (deliveryFeeCache !== null && (now - deliveryFeeCacheTime) < CACHE_DURATION) {
    return deliveryFeeCache
  }

  deliveryFeeCache = await getDeliveryFee()
  deliveryFeeCacheTime = now
  return deliveryFeeCache
}

/**
 * Invalide le cache (à appeler après mise à jour des paramètres)
 */
export function invalidateDeliveryFeeCache() {
  deliveryFeeCache = null
  deliveryFeeCacheTime = 0
}
