'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Grid3X3,
  CreditCard,
  Users,
  Settings,
  ChefHat,
  Calendar,
  Building2,
  UtensilsCrossed,
  X,
  Monitor,
  Layers,
  Receipt,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'POS', href: '/dashboard/pos', icon: Monitor, highlight: true },
  { label: 'Tables', href: '/dashboard/tables', icon: UtensilsCrossed },
  { label: 'Salles', href: '/dashboard/halls', icon: Building2 },
  { label: 'Réservation salles', href: '/dashboard/reservation-halls', icon: Receipt },
  { label: 'Réservations', href: '/dashboard/reservations', icon: Calendar },
  { label: 'Commandes', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Menus', href: '/dashboard/menus', icon: ChefHat },
  { label: 'Produits', href: '/dashboard/products', icon: Package },
  { label: 'Catégories', href: '/dashboard/categories', icon: Grid3X3 },
  { label: 'Addons', href: '/dashboard/addons', icon: Layers },
  { label: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  { label: 'Aide utilisateur', href: '/dashboard/help', icon: HelpCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'dashboard-sidebar flex flex-col transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-dashboard-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-dashboard-primary flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-dashboard-text-primary">
              Mess Admin
            </span>
          </Link>
          <button 
            className="lg:hidden text-dashboard-text-secondary hover:text-dashboard-text-primary"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              const isHighlight = 'highlight' in item && item.highlight

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-dashboard-surface-muted text-dashboard-primary font-semibold'
                        : isHighlight
                          ? 'bg-dashboard-primary/10 text-dashboard-primary hover:bg-dashboard-primary/20 font-medium'
                          : 'text-dashboard-text-secondary hover:bg-dashboard-surface-muted hover:text-dashboard-text-primary'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                    {isHighlight && !isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-dashboard-primary animate-pulse" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dashboard-border">
          <div className="text-xs text-dashboard-text-muted text-center">
            Mess des Officiers v1.0
          </div>
        </div>
      </aside>
    </>
  )
}
