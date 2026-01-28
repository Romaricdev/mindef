import type { TableReservation } from '@/types'

export const reservations: TableReservation[] = [
  {
    id: 'RES-001',
    type: 'table',
    customerName: 'Jean Dupont',
    customerPhone: '+237 691 234 567',
    customerEmail: 'jean.dupont@example.com',
    date: '2026-01-18',
    time: '19:00',
    partySize: 4,
    notes: 'Anniversaire, table près de la fenêtre si possible',
    status: 'confirmed',
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'RES-002',
    type: 'table',
    customerName: 'Marie Atangana',
    customerPhone: '+237 677 888 999',
    customerEmail: 'marie.atangana@example.com',
    date: '2026-01-18',
    time: '20:00',
    partySize: 2,
    notes: '',
    status: 'pending',
    createdAt: '2026-01-17T14:20:00Z',
  },
  {
    id: 'RES-003',
    type: 'table',
    customerName: 'Pierre Nkono',
    customerPhone: '+237 699 111 222',
    customerEmail: 'pierre.nkono@example.com',
    date: '2026-01-19',
    time: '19:30',
    partySize: 6,
    notes: 'Dîner d\'affaires',
    status: 'confirmed',
    createdAt: '2026-01-16T09:15:00Z',
  },
  {
    id: 'RES-004',
    type: 'table',
    customerName: 'Sophie Mbarga',
    customerPhone: '+237 655 333 444',
    customerEmail: 'sophie.mbarga@example.com',
    date: '2026-01-19',
    time: '12:30',
    partySize: 3,
    notes: '',
    status: 'pending',
    createdAt: '2026-01-17T16:45:00Z',
  },
  {
    id: 'RES-005',
    type: 'table',
    customerName: 'David Essomba',
    customerPhone: '+237 688 555 666',
    customerEmail: 'david.essomba@example.com',
    date: '2026-01-20',
    time: '20:30',
    partySize: 8,
    notes: 'Célébration, gâteau d\'anniversaire',
    status: 'confirmed',
    createdAt: '2026-01-14T11:00:00Z',
  },
  {
    id: 'RES-006',
    type: 'table',
    customerName: 'Claire Tchouassi',
    customerPhone: '+237 622 777 888',
    customerEmail: 'claire.tchouassi@example.com',
    date: '2026-01-17',
    time: '18:00',
    partySize: 2,
    notes: '',
    status: 'cancelled',
    createdAt: '2026-01-15T13:30:00Z',
  },
]

export function getReservationsByStatus(status: 'pending' | 'confirmed' | 'cancelled'): TableReservation[] {
  return reservations.filter(reservation => reservation.status === status)
}

export function getPendingReservations(): TableReservation[] {
  return reservations.filter(reservation => reservation.status === 'pending')
}

export function getReservationById(id: string | number): TableReservation | undefined {
  return reservations.find(reservation => reservation.id === id)
}

export function getTodayReservations(): TableReservation[] {
  const today = new Date().toISOString().split('T')[0]
  return reservations.filter(reservation => reservation.date === today && reservation.status !== 'cancelled')
}
