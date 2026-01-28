'use client'

import { use, useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart-store'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { formatPrice, cn } from '@/lib/utils'
import { Clock, Plus, Check, Utensils, ArrowLeft, ShoppingBag, ChefHat, UtensilsCrossed } from 'lucide-react'
import type { Category, MenuItem } from '@/types'
import { FadeIn, Stagger } from '@/components/animations'
import { useDailyMenuItems } from '@/hooks'

// ============================================
// HERO SECTION
// ============================================

interface TableMenuHeroProps {
  tableNumber: number
}

function TableMenuHero({ tableNumber }: TableMenuHeroProps) {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#F4A024]/10 via-white to-[#4B4F1E]/5 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4A024]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4B4F1E]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4A024]/10 rounded-full mb-6 border border-[#F4A024]/20">
              <ChefHat className="w-5 h-5 text-[#F4A024]" />
              <span className="text-sm font-medium text-[#F4A024]">
                Table {tableNumber}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Notre Menu
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed text-justify">
              Commandez directement depuis votre table. Ajoutez vos plats au panier et nous vous servirons à table.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ============================================
// CATEGORY FILTER
// ============================================

interface CategoryFilterProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'sticky top-[80px] z-40 bg-white border-b border-gray-200 transition-all duration-300',
        isSticky && 'shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex gap-2 sm:gap-3 overflow-x-auto py-4 sm:py-5 scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap min-h-[44px]',
                activeCategory === category.id
                  ? 'bg-[#F4A024] text-white shadow-lg shadow-[#F4A024]/25 scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-[#F4A024]'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MENU ITEM CARD
// ============================================

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  isAdding?: boolean
}

function MenuItemCard({ item, onAddToCart, isAdding = false }: MenuItemCardProps) {
  const { items: cartItems } = useCartStore()
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Vérifier si l'item est dans le panier (utiliser menuItemId)
  const cartItem = cartItems.find(ci => ci.menuItemId === item.id)
  const isSelected = cartItem !== undefined

  // Extraire quelques mots-clés de la description pour les tags (simulation)
  const extractTags = (description: string): string[] => {
    const commonIngredients = [
      'Thyme', 'Oregano', 'Jalapeno', 'Bell Pepper', 'Beef', 'Chicken', 
      'Pineapple', 'Kiwi', 'Raspberry', 'Sesame Oil', 'Soy Sauce', 'Noodles',
      'Serrano Pepper', 'Spicy', 'Fresh'
    ]
    const words = description.toLowerCase().split(/\s+/)
    const found = commonIngredients.filter(ing => 
      words.some(word => word.includes(ing.toLowerCase()))
    )
    return found.slice(0, 4) // Limiter à 4 tags
  }

  const tags = extractTags(item.description || '')
  const imageSrc =
    item.image ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
  const isSupabasePublicImage =
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(imageSrc)

  const handleSelect = () => {
    if (!item.available || isAdding) return
    onAddToCart(item)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 relative">
      {/* Badge de sélection en bas à droite */}
      {isSelected && (
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#F4A024] rounded-full flex items-center justify-center shadow-lg z-10">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      <div className="flex gap-4 sm:gap-5">
        {/* Image circulaire */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
            quality={85}
            unoptimized={isSupabasePublicImage}
          />
          {!item.available && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Badge variant="error" className="text-[10px]">
                Indisponible
              </Badge>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {/* Nom du plat */}
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 line-clamp-1">
            {item.name}
          </h3>

          {/* Tags d'ingrédients */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-full text-xs text-gray-700"
                >
                  {index === 0 && <UtensilsCrossed className="w-3 h-3 text-gray-500" />}
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          )}

          {/* Prix et bouton sélectionner */}
          <div className="flex items-center justify-between mt-3 sm:mt-4">
            {/* Prix */}
            <div>
              <p className="text-lg sm:text-xl font-bold text-[#F4A024]">
                {formatPrice(item.price)}
              </p>
              {item.preparationTime && (
                <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {item.preparationTime} min
                </p>
              )}
            </div>

            {/* Bouton Sélectionner */}
            <Button
              onClick={handleSelect}
              disabled={!item.available || isAdding || showSuccess}
              className={cn(
                "rounded-lg transition-all duration-200 min-h-[40px] sm:min-h-[44px] px-4 sm:px-6",
                isSelected || showSuccess
                  ? "bg-[#F4A024] hover:bg-[#F4A024]/90 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
              variant="ghost"
            >
              {showSuccess || isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Sélectionné
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Sélectionner
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// FLOATING CART BUTTON
// ============================================

interface FloatingCartButtonProps {
  itemCount: number
  total: number
  onClick: () => void
}

function FloatingCartButton({ itemCount, total, onClick }: FloatingCartButtonProps) {
  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="primary"
        size="lg"
        onClick={onClick}
        className="shadow-2xl hover:shadow-3xl transition-all duration-300 gap-3 min-h-[56px] px-6"
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#F4A024] rounded-full flex items-center justify-center text-xs font-bold">
              {itemCount}
            </span>
          )}
        </div>
        <div className="text-left">
          <div className="text-xs opacity-90">Panier</div>
          <div className="text-sm font-bold">{formatPrice(total)}</div>
        </div>
      </Button>
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

interface TableMenuPageProps {
  params: Promise<{ id: string }>
}

export default function TableMenuPage({ params }: TableMenuPageProps) {
  const { id } = use(params)
  const tableNumber = parseInt(id, 10)
  const router = useRouter()
  const { menuItems: dailyMenuItems, loading: menuItemsLoading, error: menuItemsError } = useDailyMenuItems()
  // NOTE: On n'utilise PAS useMenuData ici car on veut UNIQUEMENT le menu du jour pour les tables
  // Si le menu du jour n'est pas disponible, on affiche un message, pas tous les produits
  
  // Normaliser les erreurs en string
  const normalizeError = (err: unknown): string | null => {
    if (!err) return null
    if (typeof err === 'string') return err
    if (typeof err === 'object' && err !== null) {
      if ('message' in err && typeof (err as { message?: unknown }).message === 'string')
        return (err as { message: string }).message
      if ('details' in err && typeof (err as { details?: unknown }).details === 'string')
        return (err as { details: string }).details
      return 'Une erreur est survenue'
    }
    return String(err)
  }
  
  // Normaliser les erreurs
  const hasDailyMenuError = normalizeError(menuItemsError)
  
  // Sur cette page, on utilise UNIQUEMENT le menu du jour (pas de fallback vers tous les produits)
  // C'est spécifique aux tables via QR code
  const menuItems = dailyMenuItems
  const loading = menuItemsLoading
  
  // Afficher une erreur seulement si :
  // - Pas de produits du tout ET erreur sur le menu du jour
  // Si on a des produits, on n'affiche jamais d'erreur
  const hasProducts = menuItems.length > 0
  const error = hasProducts 
    ? null 
    : (dailyMenuItems.length === 0 && hasDailyMenuError ? hasDailyMenuError : null)
  
  const [addingItemId, setAddingItemId] = useState<number | string | null>(null)
  const { addItem, setTableNumber, getItemCount, getTotal, updateQuantity, removeItem } = useCartStore()

  // Set table number in cart when component mounts
  useEffect(() => {
    if (tableNumber && !isNaN(tableNumber)) {
      setTableNumber(tableNumber)
    }
  }, [tableNumber, setTableNumber])

  // Afficher tous les produits disponibles du menu du jour (sans filtre par catégorie)
  const availableItems = useMemo(
    () => {
      const items = menuItems.filter(item => item.available)
      console.log('[TableMenuPage] Available items from menu du jour:', items.length, 'from', menuItems.length, 'total items')
      console.log('[TableMenuPage] All available items:', items.map(item => ({ id: item.id, name: item.name, categoryId: item.categoryId })))
      return items
    },
    [menuItems]
  )
  
  // Logs pour déboguer
  useEffect(() => {
    console.log('[TableMenuPage] Final State:', {
      dailyMenuItemsCount: dailyMenuItems.length,
      finalMenuItemsCount: menuItems.length,
      availableItemsCount: availableItems.length,
      menuItemsError: menuItemsError,
      hasDailyMenuError,
      finalError: error,
      loading,
      menuItemsLoading,
      dailyMenuItems: dailyMenuItems.map(item => ({ id: item.id, name: item.name, categoryId: item.categoryId })),
      finalMenuItems: menuItems.map(item => ({ id: item.id, name: item.name, categoryId: item.categoryId })),
      availableItems: availableItems.map(item => ({ id: item.id, name: item.name, categoryId: item.categoryId })),
    })
  }, [dailyMenuItems, menuItems, availableItems, menuItemsError, hasDailyMenuError, error, loading, menuItemsLoading])

  const handleAddToCart = async (item: MenuItem) => {
    setAddingItemId(item.id)
    addItem(item, 1)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setAddingItemId(null)
  }

  const handleViewCart = () => {
    router.push(`/table/${id}/cart`)
  }

  const itemCount = getItemCount()
  const total = getTotal()

  return (
    <>
      <TableMenuHero tableNumber={tableNumber} />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href={`/table/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#F4A024] transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Retour</span>
        </Link>
      </div>

      {loading ? (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500">Chargement du menu…</p>
          </div>
        </section>
      ) : error ? (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-semibold mb-2">Erreur de chargement</p>
              <p className="text-red-600 text-sm">
                {typeof error === 'string' 
                  ? error 
                  : 'Impossible de charger le menu. Veuillez réessayer plus tard.'}
              </p>
            </div>
          </div>
        </section>
      ) : menuItems.length === 0 && !loading ? (
        // Aucun menu du jour configuré - afficher un message informatif (pas une erreur)
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md mx-auto">
              <Utensils className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <p className="text-amber-800 font-semibold mb-2">Aucun menu du jour disponible</p>
              <p className="text-amber-700 text-sm">
                Aucun menu du jour n&apos;est actuellement configuré. Veuillez contacter le restaurant.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Badge pour indiquer que c'est le menu du jour */}
            <div className="mb-6 sm:mb-8 text-center">
              <Badge variant="primary" className="text-sm sm:text-base px-4 py-2">
                Menu du jour - {availableItems.length} {availableItems.length === 1 ? 'plat disponible' : 'plats disponibles'}
              </Badge>
            </div>
            
                {availableItems.length > 0 ? (
              <>
                <div className="space-y-3 sm:space-y-4">
                  {availableItems.map((item) => {
                    console.log('[TableMenuPage] Rendering item:', { id: item.id, name: item.name, categoryId: item.categoryId })
                    return (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                        isAdding={addingItemId === item.id}
                      />
                    )
                  })}
                </div>
              </>
            ) : (
              <FadeIn>
                <div className="text-center py-16">
                  <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Aucun plat disponible
                  </p>
                  <p className="text-gray-600">
                    Aucun plat n&apos;est actuellement disponible dans le menu du jour.
                  </p>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* Floating Cart Button */}
      <FloatingCartButton
        itemCount={itemCount}
        total={total}
        onClick={handleViewCart}
      />
    </>
  )
}
