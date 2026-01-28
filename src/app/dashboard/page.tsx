'use client'

import { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
  Eye,
  Store,
  Truck
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge, SkeletonKPI, Skeleton, Button, DataTable } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import { useDashboardStats, useRevenueByDay, useTopSellingItems, useOrders } from '@/hooks'
import { OrderDetailsModal } from '@/components/modals'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Order } from '@/types'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Configuration des statuts et types pour les colonnes (en dehors du composant pour éviter la recréation)
const statusConfig: Record<Order['status'], { label: string; variant: 'warning' | 'info' | 'success' | 'error' }> = {
  pending: { label: 'En attente', variant: 'warning' },
  confirmed: { label: 'Confirmée', variant: 'info' },
  preparing: { label: 'En préparation', variant: 'info' },
  ready: { label: 'Prête', variant: 'success' },
  delivered: { label: 'Livrée', variant: 'success' },
  cancelled: { label: 'Annulée', variant: 'error' },
}

const typeConfig: Record<Order['type'], { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  'dine-in': { label: 'Sur place', icon: Store },
  'takeaway': { label: 'À emporter', icon: ShoppingBag },
  'delivery': { label: 'Livraison', icon: Truck },
}

export default function DashboardPage() {
  const { data: dashboardStats, loading: statsLoading } = useDashboardStats()
  const { data: revenueByDay, loading: revenueLoading } = useRevenueByDay()
  const { data: topSellingItems, loading: topLoading } = useTopSellingItems()
  const { data: orders, loading: ordersLoading } = useOrders()

  const isLoading = statsLoading || revenueLoading || topLoading
  const statsData = dashboardStats

  // État pour la modal de détails de commande
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  // Colonnes simplifiées pour le dashboard (responsive)
  const recentOrdersColumns: ColumnDef<Order>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs sm:text-sm text-gray-600">
          {String(row.original.id).slice(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Client',
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">
              {order.customerName || (order.tableNumber ? `Table ${order.tableNumber}` : 'Client')}
            </p>
            {order.customerPhone && (
              <p className="text-xs text-gray-500 truncate">{order.customerPhone}</p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type
        const config = typeConfig[type]
        const Icon = config.icon
        return (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{config.label}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status
        const config = statusConfig[status]
        return <Badge variant={config.variant} size="sm">{config.label}</Badge>
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-semibold text-sm sm:text-base text-gray-900 whitespace-nowrap">
          {formatPrice(row.original.total)}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return (
          <div className="text-xs sm:text-sm whitespace-nowrap">
            <p className="text-gray-900">{format(date, 'dd MMM yyyy', { locale: fr })}</p>
            <p className="text-xs text-gray-500">{format(date, 'HH:mm', { locale: fr })}</p>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedOrder(row.original)
              setIsOrderModalOpen(true)
            }}
            title="Voir les détails"
            className="min-h-[32px] min-w-[32px]"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )
      },
    },
  ], [])

  // Commandes récentes : 10 dernières toutes catégories de statut
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  }, [orders])

  const recentOrdersCount = recentOrders.length

  const stats = !statsData
    ? []
    : [
        {
          label: 'Revenu total',
          value: formatPrice(statsData.totalRevenue.value),
          change: statsData.totalRevenue.change,
          changeType: statsData.totalRevenue.changeType,
          icon: DollarSign,
        },
        {
          label: 'Commandes',
          value: statsData.totalOrders.value.toString(),
          change: statsData.totalOrders.change,
          changeType: statsData.totalOrders.changeType,
          icon: ShoppingBag,
        },
        {
          label: 'Panier moyen',
          value: formatPrice(statsData.averageOrderValue.value),
          change: statsData.averageOrderValue.change,
          changeType: statsData.averageOrderValue.changeType,
          icon: CreditCard,
        },
        {
          label: 'Clients actifs',
          value: statsData.activeCustomers.value.toString(),
          change: statsData.activeCustomers.change,
          changeType: statsData.activeCustomers.changeType,
          icon: Users,
        },
      ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Vue d&apos;ensemble de l&apos;activité du restaurant
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <SkeletonKPI />
            <SkeletonKPI />
            <SkeletonKPI />
            <SkeletonKPI />
          </>
        ) : (
          stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#F4A024]/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-[#F4A024]" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}%
                  </span>
                  <span className="text-xs text-gray-400">
                    vs semaine dernière
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution du chiffre d&apos;affaires</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : revenueByDay.length === 0 ? (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Aucune donnée disponible</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={revenueByDay.map((day) => ({
                    date: new Date(day.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    }),
                    revenue: Math.round(day.revenue),
                  }))}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number | undefined) => 
                      value != null ? formatPrice(value) : '0 FCFA'
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F4A024"
                    strokeWidth={2}
                    dot={{ fill: '#F4A024', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenus (FCFA)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Nombre de commandes par jour</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : revenueByDay.length === 0 ? (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Aucune donnée disponible</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={revenueByDay.map((day) => ({
                    date: new Date(day.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    }),
                    orders: day.orders,
                  }))}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="orders"
                    fill="#F4A024"
                    radius={[8, 8, 0, 0]}
                    name="Commandes"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Meilleures ventes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topSellingItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.quantity} vendus
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Commandes récentes</CardTitle>
          <Badge variant="primary">{recentOrdersCount} récentes</Badge>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                  <Skeleton className="w-24 h-4" />
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucune commande récente</p>
            </div>
          ) : (
            <DataTable
              columns={recentOrdersColumns}
              data={recentOrders}
              pageSize={10}
            />
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={isOrderModalOpen}
        onOpenChange={setIsOrderModalOpen}
        order={selectedOrder}
      />
    </div>
  )
}
