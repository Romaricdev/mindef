'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchDailyMenus } from '@/lib/data/menus'
import { fetchMenuItems } from '@/lib/data/menu'
import type { MenuItem } from '@/types'

interface UseDailyMenuItemsResult {
  menuItems: MenuItem[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook pour récupérer les produits du menu du jour
 * Récupère les menus actifs de type "daily" et extrait tous les produits associés
 */
export function useDailyMenuItems(): UseDailyMenuItemsResult {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    // Fonction helper pour récupérer les menus du jour avec gestion des AbortError
    const fetchDailyMenusWithRetry = async (): Promise<{ menus: any[]; error: any }> => {
      try {
        console.log('[useDailyMenuItems] Fetching daily menus...')
        const menus = await fetchDailyMenus()
        console.log('[useDailyMenuItems] Daily menus fetched:', menus.length)
        return { menus, error: null }
      } catch (error: any) {
        console.error('[useDailyMenuItems] Error fetching daily menus:', {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
        })
        // Si c'est une AbortError (React Strict Mode), on la retourne pour réessayer
        if (error?.message?.includes('AbortError') || error?.message?.includes('aborted')) {
          return { menus: [], error: { message: 'AbortError', code: 'ABORTED' } }
        }
        return { menus: [], error }
      }
    }

    // Fonction helper pour récupérer les produits avec gestion des AbortError
    const fetchMenuItemsWithRetry = async (): Promise<{ items: any[]; error: any }> => {
      try {
        const items = await fetchMenuItems()
        return { items, error: null }
      } catch (error: any) {
        // Si c'est une AbortError (React Strict Mode), on la retourne pour réessayer
        if (error?.message?.includes('AbortError') || error?.message?.includes('aborted')) {
          return { items: [], error: { message: 'AbortError', code: 'ABORTED' } }
        }
        return { items: [], error }
      }
    }

    try {
      // Essayer de récupérer les menus du jour (avec retry si AbortError)
      let menusResult = await fetchDailyMenusWithRetry()
      
      // Si AbortError, réessayer plusieurs fois avec des délais croissants
      let retryCount = 0
      const maxRetries = 3
      while (menusResult.error && 
             (menusResult.error.message === 'AbortError' || 
              menusResult.error.code === 'ABORTED' ||
              menusResult.error.message?.includes('AbortError') ||
              menusResult.error.details?.includes('AbortError')) && 
             retryCount < maxRetries) {
        retryCount++
        const delay = 300 * retryCount // 300ms, 600ms, 900ms
        console.log(`[useDailyMenuItems] Daily menus fetch aborted (React Strict Mode), retrying ${retryCount}/${maxRetries} after ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        menusResult = await fetchDailyMenusWithRetry()
        
        // Si on réussit, sortir de la boucle
        if (!menusResult.error) {
          break
        }
      }

      // Si erreur après retry, gérer selon le type d'erreur
      if (menusResult.error) {
        const isAbortError = menusResult.error.message === 'AbortError' 
          || menusResult.error.code === 'ABORTED'
          || menusResult.error.message?.includes('AbortError')
          || menusResult.error.details?.includes('AbortError')
        
        if (isAbortError) {
          // Pour les AbortError après retry, ignorer et continuer avec un tableau vide (pas d'erreur)
          // C'est normal en React Strict Mode en développement
          console.log('[useDailyMenuItems] AbortError after retry, ignoring and using empty array (React Strict Mode)')
          setMenuItems([])
          setLoading(false)
          return
        }
        
        // Pour les autres erreurs non-AbortError
        console.warn('[useDailyMenuItems] Error loading daily menus (non-AbortError):', {
          code: menusResult.error.code || 'NO_CODE',
          message: menusResult.error.message || 'NO_MESSAGE',
        })
        // Si c'est une erreur de permission ou de table inexistante, considérer comme "pas de menu du jour"
        // PGRST116 = no rows returned (normal si pas de menu du jour)
        if (menusResult.error.code === 'PGRST116' || menusResult.error.message?.includes('no rows')) {
          console.log('[useDailyMenuItems] No daily menus found (normal if not configured)')
          setMenuItems([])
          setLoading(false)
          return
        }
        // Pour les autres erreurs, ne pas définir d'erreur (car l'absence de menu du jour n'est pas une erreur)
        // On retourne juste un tableau vide
        setMenuItems([])
        setLoading(false)
        return
      }

      const dailyMenus = menusResult.menus || []
      
      if (dailyMenus.length === 0) {
        // Si aucun menu du jour, retourner un tableau vide (pas une erreur)
        console.log('[useDailyMenuItems] No daily menus found, returning empty array')
        setMenuItems([])
        setLoading(false)
        return
      }

      // Essayer de récupérer tous les produits (avec retry si AbortError)
      let productsResult = await fetchMenuItemsWithRetry()
      
      // Si AbortError, réessayer plusieurs fois avec des délais croissants
      let productsRetryCount = 0
      const maxProductsRetries = 3
      while (productsResult.error && 
             (productsResult.error.message === 'AbortError' || 
              productsResult.error.code === 'ABORTED' ||
              productsResult.error.message?.includes('AbortError') ||
              productsResult.error.details?.includes('AbortError')) && 
             productsRetryCount < maxProductsRetries) {
        productsRetryCount++
        const delay = 300 * productsRetryCount // 300ms, 600ms, 900ms
        console.log(`[useDailyMenuItems] Menu items fetch aborted (React Strict Mode), retrying ${productsRetryCount}/${maxProductsRetries} after ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        productsResult = await fetchMenuItemsWithRetry()
        
        // Si on réussit, sortir de la boucle
        if (!productsResult.error) {
          break
        }
      }

      // Si erreur après retry, gérer selon le type d'erreur
      if (productsResult.error) {
        const isAbortError = productsResult.error.message === 'AbortError' 
          || productsResult.error.code === 'ABORTED'
          || productsResult.error.message?.includes('AbortError')
          || productsResult.error.details?.includes('AbortError')
        
        if (isAbortError) {
          // Pour les AbortError après retry, ignorer et continuer avec un tableau vide (pas d'erreur)
          // C'est normal en React Strict Mode en développement
          console.log('[useDailyMenuItems] AbortError after retry on products, ignoring and using empty array (React Strict Mode)')
          setMenuItems([])
          setLoading(false)
          return
        }
        
        // Pour les autres erreurs non-AbortError
        console.error('[useDailyMenuItems] Error loading menu items:', {
          code: productsResult.error.code || 'NO_CODE',
          message: productsResult.error.message || 'NO_MESSAGE',
          details: productsResult.error.details || 'NO_DETAILS',
          hint: productsResult.error.hint || 'NO_HINT',
          fullError: productsResult.error,
        })
        // Extraire un message d'erreur lisible - toujours une string
        let errorMessage = 'Erreur lors du chargement des produits'
        if (productsResult.error.message && typeof productsResult.error.message === 'string') {
          errorMessage = productsResult.error.message
        } else if (productsResult.error.details && typeof productsResult.error.details === 'string') {
          errorMessage = productsResult.error.details
        } else if (productsResult.error.code && typeof productsResult.error.code === 'string') {
          errorMessage = `Erreur ${productsResult.error.code}`
        }
        setError(errorMessage)
        setLoading(false)
        return
      }

      const allProducts = productsResult.items

      // Extraire les IDs des produits des menus du jour
      const dailyMenuProductIds = new Set<number>()
      dailyMenus.forEach((menu: any) => {
        console.log('[useDailyMenuItems] Menu:', menu.name, 'Products:', menu.products.length)
        menu.products.forEach((product: { productId: number }) => {
          dailyMenuProductIds.add(product.productId)
        })
      })

      console.log('[useDailyMenuItems] Daily menu product IDs:', Array.from(dailyMenuProductIds))
      console.log('[useDailyMenuItems] All products count:', allProducts.length)
      console.log('[useDailyMenuItems] Sample product IDs from allProducts:', allProducts.slice(0, 5).map(p => ({ id: p.id, idType: typeof p.id, name: p.name })))

      // Filtrer les produits qui sont dans les menus du jour
      const dailyProducts = allProducts.filter((product) => {
        const productId = Number(product.id)
        const isInDailyMenu = dailyMenuProductIds.has(productId)
        if (isInDailyMenu) {
          console.log('[useDailyMenuItems] Product matched:', { id: product.id, name: product.name, productId })
        }
        return isInDailyMenu
      })

      console.log('[useDailyMenuItems] Filtered daily products:', dailyProducts.length)
      console.log('[useDailyMenuItems] Daily products details:', dailyProducts.map(p => ({ id: p.id, name: p.name, categoryId: p.categoryId })))
      setMenuItems(dailyProducts)
    } catch (e) {
      // Ignorer les AbortError dans le catch (déjà gérées ci-dessus)
      if (e instanceof Error && (e.message.includes('AbortError') || e.message.includes('aborted'))) {
        console.log('[useDailyMenuItems] AbortError caught in catch, using empty array')
        setMenuItems([])
        setLoading(false)
        return
      }
      // Extraire un message d'erreur lisible
      let errorMessage = 'Erreur lors du chargement du menu du jour'
      if (e instanceof Error) {
        errorMessage = e.message || errorMessage
      } else if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = String((e as any).message) || errorMessage
      } else if (e) {
        errorMessage = String(e)
      }
      setError(errorMessage)
      console.error('[useDailyMenuItems] Unexpected error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { menuItems, loading, error, refetch: load }
}
