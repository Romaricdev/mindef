'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Users, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { FadeIn, Stagger } from '@/components/animations'

// ============================================
// MOCK EVENTS DATA
// ============================================

const upcomingEvents = [
  {
    id: 1,
    title: 'Soirée Jazz & Dîner',
    date: '2026-02-15',
    time: '19:00',
    location: 'Salle principale',
    capacity: 80,
    description: 'Une soirée exceptionnelle avec musique jazz en direct et menu gastronomique spécial.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    type: 'Événement',
  },
  {
    id: 2,
    title: 'Dégustation de Vins',
    date: '2026-02-22',
    time: '18:30',
    location: 'Bar à cocktails',
    capacity: 40,
    description: 'Découvrez une sélection de vins d\'exception accompagnés de fromages et charcuteries.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
    type: 'Dégustation',
  },
  {
    id: 3,
    title: 'Brunch Dominical',
    date: '2026-02-16',
    time: '11:00',
    location: 'Terrasse extérieure',
    capacity: 60,
    description: 'Brunch dominical avec buffet à volonté et musique live. Parfait pour toute la famille.',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
    type: 'Brunch',
  },
]

const pastEvents = [
  {
    id: 4,
    title: 'Mariage - Cérémonie privée',
    date: '2026-01-20',
    time: '14:00',
    location: 'Salle de réception',
    capacity: 120,
    description: 'Cérémonie de mariage élégante dans notre salle de réception.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    type: 'Mariage',
  },
  {
    id: 5,
    title: 'Conférence d\'entreprise',
    date: '2026-01-18',
    time: '09:00',
    location: 'Salle de conférence',
    capacity: 50,
    description: 'Séminaire d\'entreprise avec pause déjeuner gastronomique.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    type: 'Conférence',
  },
]

// ============================================
// HERO SECTION
// ============================================

function EventsHero() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F4A024]/5 via-white to-[#4B4F1E]/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4A024]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4B4F1E]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4A024]/10 rounded-full mb-6 border border-[#F4A024]/20">
            <Calendar className="w-5 h-5 text-[#F4A024]" />
            <span className="text-sm font-medium text-[#F4A024]">
              Nos Événements
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Événements & Célébrations
          </h1>
        </FadeIn>
        <FadeIn delay={0.3} direction="up">
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed text-justify">
            Découvrez nos événements à venir et réservez votre place pour des moments inoubliables.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ============================================
// EVENT CARD
// ============================================

interface EventCardProps {
  event: typeof upcomingEvents[0]
  isPast?: boolean
}

function EventCard({ event, isPast = false }: EventCardProps) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card variant="site" padding="none" className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={85}
        />
        {isPast && (
          <div className="absolute top-4 right-4">
            <Badge variant="default">Passé</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 sm:p-8">
        <div className="mb-4">
          <Badge variant="primary" className="mb-3">
            {event.type}
          </Badge>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {event.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify mb-4">
            {event.description}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
            <Calendar className="w-5 h-5 text-[#F4A024] flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
            <Clock className="w-5 h-5 text-[#F4A024] flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
            <MapPin className="w-5 h-5 text-[#F4A024] flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
            <Users className="w-5 h-5 text-[#F4A024] flex-shrink-0" />
            <span>Capacité: {event.capacity} personnes</span>
          </div>
        </div>

        {!isPast && (
          <Link href="/reservation">
            <Button variant="primary" size="lg" className="w-full gap-2">
              Réserver
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function EventsPage() {
  return (
    <>
      <EventsHero />

      {/* Upcoming Events */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Événements à Venir
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto text-justify">
                Réservez votre place pour nos prochains événements exceptionnels.
              </p>
            </div>
          </FadeIn>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Stagger>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Événements Passés
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto text-justify">
                Retour sur nos événements récents qui ont marqué nos clients.
              </p>
            </div>
          </FadeIn>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pastEvents.map((event, index) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </Stagger>
        </div>
      </section>
    </>
  )
}
