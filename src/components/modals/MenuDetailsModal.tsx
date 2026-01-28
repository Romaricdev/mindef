'use client'

import { BaseModal } from './BaseModal'
import { Badge, Button } from '@/components/ui'
import { formatPrice, formatDate } from '@/lib/utils'
import { ChefHat, Edit, Package, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import type { Menu, MenuProduct, MenuItem } from '@/types'

// ============================================
// MENU DETAILS MODAL
// ============================================

interface MenuDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menu: Menu | null
  onEdit?: (menu: Menu) => void
  onToggleActive?: (menu: Menu) => void
  getProductById?: (id: number | string) => MenuItem | undefined
}

export function MenuDetailsModal({
  open,
  onOpenChange,
  menu,
  onEdit,
  onToggleActive,
  getProductById,
}: MenuDetailsModalProps) {
  if (!menu) return null

  const totalPrice = menu.products.reduce((sum, menuProduct) => {
    const product = getProductById?.(menuProduct.productId)
    if (product) return sum + product.price
    return sum
  }, 0)

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={menu.name}
      description={menu.description || `Détails du menu`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Status Badges */}
        <div className="flex items-center gap-3">
          <Badge variant={menu.type === 'daily' ? 'primary' : 'default'} size="lg">
            {menu.type === 'daily' ? 'Menu du jour' : 'Menu prédéfini'}
          </Badge>
          <Badge variant={menu.active ? 'success' : 'default'} size="lg">
            {menu.active ? 'Actif' : 'Inactif'}
          </Badge>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Produits</p>
            <p className="text-lg font-bold text-gray-900">{menu.products.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Valeur totale</p>
            <p className="text-lg font-bold text-gray-900">{formatPrice(totalPrice)}</p>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#F4A024]" />
            Produits associés
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {menu.products.map((menuProduct, index) => {
              const product = getProductById?.(menuProduct.productId)
              if (!product) return null

              const productImage = product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
              const isSupabasePublicImage =
                /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(productImage)

              return (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      quality={85}
                      unoptimized={isSupabasePublicImage}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                      <Badge variant="default" size="sm" className="text-xs">
                        {formatPrice(product.price)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Créé le {formatDate(menu.createdAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          {menu.updatedAt !== menu.createdAt && (
            <p>Modifié le {formatDate(menu.updatedAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onEdit?.(menu)
              onOpenChange(false)
            }}
            className="gap-2 flex-1"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onToggleActive?.(menu)
              onOpenChange(false)
            }}
            className="gap-2"
          >
            {menu.active ? (
              <>
                <XCircle className="w-4 h-4" />
                Désactiver
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Activer
              </>
            )}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
