import type { Hall } from '@/types'

export const halls: Hall[] = [
  {
    id: 1,
    name: 'Salle A - Prestige',
    description: 'Salle élégante pour événements d\'entreprise et réceptions privées',
    capacity: 100,
    amenities: ['Sonorisation', 'Projecteur', 'Éclairage LED', 'Climatisation', 'Scène'],
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'],
    status: 'available',
  },
  {
    id: 2,
    name: 'Salle B - Intimité',
    description: 'Salle conviviale pour petits événements et célébrations familiales',
    capacity: 50,
    amenities: ['Sonorisation', 'Climatisation', 'Terrasse'],
    images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop'],
    status: 'occupied',
    currentReservationId: 'HALL-RES-001',
  },
  {
    id: 3,
    name: 'Salle C - Grand Événement',
    description: 'Grande salle polyvalente pour mariages, conférences et événements majeurs',
    capacity: 300,
    amenities: ['Sonorisation professionnelle', 'Projecteur HD', 'Éclairage scénique', 'Climatisation', 'Scène 50m²', 'Parking privé'],
    images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop'],
    status: 'available',
  },
  {
    id: 4,
    name: 'Salle D - Business',
    description: 'Salle de conférence moderne pour séminaires et formations',
    capacity: 80,
    amenities: ['Visioconférence', 'Tableau interactif', 'Climatisation', 'WiFi haut débit'],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'],
    status: 'available',
  },
  {
    id: 5,
    name: 'Salle E - Rooftop',
    description: 'Terrasse panoramique pour cocktails et événements en plein air',
    capacity: 120,
    amenities: ['Bar extérieur', 'Éclairage ambiance', 'Sonorisation extérieure', 'Vue panoramique'],
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'],
    status: 'available',
  },
]

export function getHallById(id: number | string): Hall | undefined {
  return halls.find(hall => hall.id === id)
}

export function getHallsByStatus(status: 'available' | 'occupied' | 'maintenance'): Hall[] {
  return halls.filter(hall => hall.status === status)
}

export function getAvailableHalls(): Hall[] {
  return halls.filter(hall => hall.status === 'available')
}
