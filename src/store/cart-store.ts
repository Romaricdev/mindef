import { create } from 'zustand'
import type { CartItem, MenuItem, CustomerBillingInfo, OrderType } from '@/types'
import { generateId } from '@/lib/utils'
import { getDeliveryFeeCached } from '@/lib/app-settings'

interface CartState {
  items: CartItem[]
  tableNumber: number | null
  customerInfo: CustomerBillingInfo | null
  orderType: OrderType
  includeDelivery: boolean
  deliveryFee: number // Frais de livraison chargé depuis app_settings

  // Actions
  addItem: (item: MenuItem, quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  setTableNumber: (tableNumber: number | null) => void
  setCustomerInfo: (info: CustomerBillingInfo) => void
  setOrderType: (type: OrderType) => void
  setIncludeDelivery: (include: boolean) => void
  setDeliveryFee: (fee: number) => void
  loadDeliveryFee: () => Promise<void>

  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getServiceFee: () => number
  getDeliveryFee: () => number
  getTotal: () => number
  isCustomerInfoValid: () => boolean
  canCheckout: () => boolean
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  tableNumber: null,
  customerInfo: null,
  orderType: 'takeaway',
  includeDelivery: false,
  deliveryFee: 1500, // Valeur par défaut, sera chargée depuis app_settings

  addItem: (menuItem: MenuItem, quantity = 1) => {
    set((state) => {
      // Check if item already exists in cart
      const existingItem = state.items.find(
        (item) => item.menuItemId === menuItem.id
      )

      if (existingItem) {
        // Update quantity
        return {
          items: state.items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        }
      }

      // Add new item
      const newItem: CartItem = {
        id: generateId(),
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      }

      return { items: [...state.items, newItem] }
    })
  },

  removeItem: (cartItemId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== cartItemId),
    }))
  },

  updateQuantity: (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId)
      return
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      ),
    }))
  },

  clearCart: () => {
    set({
      items: [],
      tableNumber: null,
      customerInfo: null,
      orderType: 'takeaway',
      includeDelivery: false,
    })
  },

  setTableNumber: (tableNumber: number | null) => {
    set({ tableNumber })
  },

  setCustomerInfo: (info: CustomerBillingInfo) => {
    set({ customerInfo: info })
  },

  setOrderType: (type: OrderType) => {
    set({ orderType: type })
  },

  setIncludeDelivery: (include: boolean) => {
    set({ includeDelivery: include })
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },

  getSubtotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  },

  getServiceFee: () => {
    // Pas de frais de service pour les commandes via QR code des tables
    if (get().tableNumber != null) return 0
    const subtotal = get().getSubtotal()
    // 10% frais de service, minimum 500 FCFA (site public / à emporter)
    return Math.max(subtotal * 0.1, 500)
  },

  setDeliveryFee: (fee: number) => {
    set({ deliveryFee: fee })
  },

  loadDeliveryFee: async () => {
    const fee = await getDeliveryFeeCached()
    set({ deliveryFee: fee })
  },

  getDeliveryFee: () => {
    const { includeDelivery, orderType, deliveryFee } = get()
    // Only apply delivery fee for takeaway orders with delivery option enabled
    if (orderType === 'takeaway' && includeDelivery) {
      return deliveryFee
    }
    return 0
  },

  getTotal: () => {
    const subtotal = get().getSubtotal()
    const serviceFee = get().getServiceFee()
    const deliveryFee = get().getDeliveryFee()
    return subtotal + serviceFee + deliveryFee
  },

  isCustomerInfoValid: () => {
    const { customerInfo } = get()
    if (!customerInfo) return false
    return customerInfo.name.trim().length > 0 && customerInfo.phone.trim().length > 0
  },

  canCheckout: () => {
    const { items } = get()
    const isInfoValid = get().isCustomerInfoValid()
    return items.length > 0 && isInfoValid
  },
}))
