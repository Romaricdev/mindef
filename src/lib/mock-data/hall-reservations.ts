import type { HallReservation, ID } from '@/types'

export const hallReservations: HallReservation[] = [
  {
    id: 'HALL-RES-001',
    type: 'hall',
    customerName: 'Entreprise Tech Solutions',
    customerPhone: '+237 691 111 222',
    customerEmail: 'contact@techsolutions.cm',
    organization: 'Tech Solutions SARL',
    hallId: 2,
    hallName: 'Salle B - Intimité',
    startDate: '2026-01-20',
    endDate: '2026-01-20',
    eventType: 'Séminaire d\'entreprise',
    expectedGuests: 45,
    notes: 'Besoin d\'un projecteur et d\'un micro',
    status: 'confirmed',
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'HALL-RES-002',
    type: 'hall',
    customerName: 'Marie et Jean Dupont',
    customerPhone: '+237 677 333 444',
    customerEmail: 'marie.dupont@example.com',
    organization: '',
    hallId: 3,
    hallName: 'Salle C - Grand Événement',
    startDate: '2026-02-14',
    endDate: '2026-02-14',
    eventType: 'Mariage',
    expectedGuests: 250,
    notes: 'Cérémonie et réception, décoration personnalisée',
    status: 'confirmed',
    createdAt: '2026-01-05T14:30:00Z',
  },
  {
    id: 'HALL-RES-003',
    type: 'hall',
    customerName: 'Association des Jeunes Entrepreneurs',
    customerPhone: '+237 699 555 666',
    customerEmail: 'contact@aje.cm',
    organization: 'AJE Cameroun',
    hallId: 1,
    hallName: 'Salle A - Prestige',
    startDate: '2026-01-25',
    endDate: '2026-01-25',
    eventType: 'Conférence',
    expectedGuests: 80,
    notes: 'Conférence sur l\'entrepreneuriat, besoin de visioconférence',
    status: 'pending',
    createdAt: '2026-01-17T11:20:00Z',
  },
  {
    id: 'HALL-RES-004',
    type: 'hall',
    customerName: 'Sophie Mbarga',
    customerPhone: '+237 655 777 888',
    customerEmail: 'sophie.mbarga@example.com',
    organization: '',
    hallId: 4,
    hallName: 'Salle D - Business',
    startDate: '2026-01-22',
    endDate: '2026-01-22',
    eventType: 'Formation',
    expectedGuests: 60,
    notes: 'Formation en management, matériel de projection nécessaire',
    status: 'pending',
    createdAt: '2026-01-16T15:45:00Z',
  },
  {
    id: 'HALL-RES-005',
    type: 'hall',
    customerName: 'David Essomba',
    customerPhone: '+237 688 999 000',
    customerEmail: 'david.essomba@example.com',
    organization: 'Essomba Events',
    hallId: 5,
    hallName: 'Salle E - Rooftop',
    startDate: '2026-02-01',
    endDate: '2026-02-01',
    eventType: 'Cocktail d\'entreprise',
    expectedGuests: 100,
    notes: 'Cocktail networking, bar extérieur nécessaire',
    status: 'confirmed',
    createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'HALL-RES-006',
    type: 'hall',
    customerName: 'Claire Tchouassi',
    customerPhone: '+237 622 111 222',
    customerEmail: 'claire.tchouassi@example.com',
    organization: '',
    hallId: 1,
    hallName: 'Salle A - Prestige',
    startDate: '2026-01-18',
    endDate: '2026-01-18',
    eventType: 'Anniversaire',
    expectedGuests: 70,
    notes: '',
    status: 'cancelled',
    createdAt: '2026-01-14T13:00:00Z',
  },
]

export function getHallReservationsByStatus(status: 'pending' | 'confirmed' | 'cancelled'): HallReservation[] {
  return hallReservations.filter(reservation => reservation.status === status)
}

export function getPendingHallReservations(): HallReservation[] {
  return hallReservations.filter(reservation => reservation.status === 'pending')
}

export function getHallReservationById(id: string | number): HallReservation | undefined {
  return hallReservations.find(reservation => reservation.id === id)
}

export function getHallReservationsByHall(hallId: ID): HallReservation[] {
  return hallReservations.filter(reservation => reservation.hallId === hallId)
}
