'use client'

import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { FadeIn, Stagger } from '@/components/animations'

// ============================================
// MOCK TESTIMONIALS DATA
// ============================================

const testimonials = [
  {
    id: 1,
    name: 'Marie Kouam',
    role: 'Cliente régulière',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: 'Un restaurant exceptionnel ! Le service est impeccable et les plats sont délicieux. Je recommande vivement le Poulet DG, c\'est une merveille.',
    date: 'Janvier 2026',
  },
  {
    id: 2,
    name: 'Jean-Pierre Nkono',
    role: 'Entrepreneur',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: 'Parfait pour organiser des événements d\'entreprise. L\'équipe est professionnelle et l\'ambiance est idéale pour les réunions importantes.',
    date: 'Décembre 2025',
  },
  {
    id: 3,
    name: 'Sophie Mvondo',
    role: 'Food Blogger',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: 'Une expérience culinaire authentique ! Les saveurs sont incroyables et la présentation des plats est soignée. Un must à Yaoundé.',
    date: 'Janvier 2026',
  },
  {
    id: 4,
    name: 'Paul Essono',
    role: 'Chef d\'entreprise',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: 'Le meilleur restaurant de Yaoundé ! J\'y organise régulièrement des dîners d\'affaires. Toujours parfait.',
    date: 'Novembre 2025',
  },
  {
    id: 5,
    name: 'Amina Diallo',
    role: 'Événementiel',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: 'Nous avons organisé un mariage ici et tout était parfait. La salle est magnifique et le service irréprochable.',
    date: 'Octobre 2025',
  },
  {
    id: 6,
    name: 'David Mbarga',
    role: 'Critique gastronomique',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: 'Une cuisine raffinée qui respecte les traditions tout en apportant une touche moderne. Bravo à toute l\'équipe !',
    date: 'Janvier 2026',
  },
]

// ============================================
// HERO SECTION
// ============================================

function TestimonialsHero() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F4A024]/5 via-white to-[#4B4F1E]/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4A024]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4B4F1E]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4A024]/10 rounded-full mb-6 border border-[#F4A024]/20">
            <Quote className="w-5 h-5 text-[#F4A024]" />
            <span className="text-sm font-medium text-[#F4A024]">
              Témoignages
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Ce Que Disent Nos Clients
          </h1>
        </FadeIn>
        <FadeIn delay={0.3} direction="up">
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed text-justify">
            Découvrez les expériences de nos clients et pourquoi ils nous font confiance pour leurs moments importants.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ============================================
// TESTIMONIAL CARD
// ============================================

interface TestimonialCardProps {
  testimonial: typeof testimonials[0]
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card variant="site" padding="lg" className="h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="64px"
            quality={85}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {testimonial.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {testimonial.role}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#F4A024] text-[#F4A024]" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <Quote className="w-8 h-8 text-[#F4A024]/20 absolute -top-2 -left-2" />
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify relative z-10 pl-6">
          {testimonial.text}
        </p>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {testimonial.date}
      </p>
    </Card>
  )
}

// ============================================
// STATS SECTION
// ============================================

const stats = [
  { value: '4.9/5', label: 'Note moyenne' },
  { value: '500+', label: 'Avis clients' },
  { value: '98%', label: 'Clients satisfaits' },
]

function StatsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#F4A024]/10 to-[#4B4F1E]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.1}>
              <div className="text-center bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4A024] mb-3">
                  {stat.value}
                </div>
                <p className="text-base sm:text-lg text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function TestimonialsPage() {
  return (
    <>
      <TestimonialsHero />
      <StatsSection />
      
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </Stagger>
        </div>
      </section>
    </>
  )
}
