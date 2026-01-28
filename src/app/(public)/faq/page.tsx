'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { FadeIn } from '@/components/animations'
import { cn } from '@/lib/utils'

// ============================================
// FAQ DATA
// ============================================

const faqCategories = [
  {
    id: 'general',
    title: 'Général',
    questions: [
      {
        id: 1,
        question: 'Quels sont vos horaires d\'ouverture ?',
        answer: 'Nous sommes ouverts du lundi au vendredi de 11h30 à 22h00, et le weekend de 12h00 à 23h00. Nous sommes fermés les jours fériés.',
      },
      {
        id: 2,
        question: 'Acceptez-vous les réservations ?',
        answer: 'Oui, nous acceptons les réservations pour les tables et les salles. Vous pouvez réserver en ligne via notre site web ou nous appeler directement.',
      },
      {
        id: 3,
        question: 'Avez-vous un parking ?',
        answer: 'Oui, nous disposons d\'un parking gratuit pour nos clients situé à proximité du restaurant.',
      },
      {
        id: 4,
        question: 'Le restaurant est-il accessible aux personnes à mobilité réduite ?',
        answer: 'Oui, notre restaurant est entièrement accessible avec des rampes d\'accès et des toilettes adaptées.',
      },
    ],
  },
  {
    id: 'menu',
    title: 'Menu & Cuisine',
    questions: [
      {
        id: 5,
        question: 'Proposez-vous des options végétariennes ?',
        answer: 'Oui, nous avons plusieurs plats végétariens dans notre menu. N\'hésitez pas à demander à notre serveur pour des recommandations.',
      },
      {
        id: 6,
        question: 'Pouvez-vous accommoder les allergies alimentaires ?',
        answer: 'Absolument. Veuillez informer notre équipe de vos allergies lors de la réservation ou à votre arrivée, et nous adapterons votre commande en conséquence.',
      },
      {
        id: 7,
        question: 'Le menu change-t-il régulièrement ?',
        answer: 'Nous proposons un menu de base permanent ainsi qu\'un menu du jour qui change chaque jour avec des spécialités saisonnières.',
      },
      {
        id: 8,
        question: 'Proposez-vous des plats pour enfants ?',
        answer: 'Oui, nous avons un menu spécialement conçu pour les enfants avec des portions adaptées et des plats appréciés des plus jeunes.',
      },
    ],
  },
  {
    id: 'reservations',
    title: 'Réservations & Événements',
    questions: [
      {
        id: 9,
        question: 'Comment puis-je réserver une table ?',
        answer: 'Vous pouvez réserver en ligne via notre site web, par téléphone, ou directement au restaurant. Nous recommandons de réserver à l\'avance, surtout pour les weekends.',
      },
      {
        id: 10,
        question: 'Puis-je annuler ma réservation ?',
        answer: 'Oui, vous pouvez annuler votre réservation jusqu\'à 24 heures avant l\'heure prévue sans frais. Pour les annulations de dernière minute, veuillez nous contacter.',
      },
      {
        id: 11,
        question: 'Organisez-vous des événements privés ?',
        answer: 'Oui, nous proposons nos salles pour des événements privés (mariages, anniversaires, séminaires). Contactez-nous pour discuter de vos besoins.',
      },
      {
        id: 12,
        question: 'Quelle est la capacité maximale pour un événement ?',
        answer: 'Nos salles peuvent accueillir jusqu\'à 120 personnes selon la configuration choisie. Contactez-nous pour plus de détails.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Paiement & Services',
    questions: [
      {
        id: 13,
        question: 'Quels modes de paiement acceptez-vous ?',
        answer: 'Nous acceptons les paiements en espèces, par carte bancaire (Visa, Mastercard), et par mobile money (MTN, Orange Money).',
      },
      {
        id: 14,
        question: 'Proposez-vous un service de livraison ?',
        answer: 'Oui, nous proposons un service de livraison pour les commandes à emporter. Des frais de livraison s\'appliquent selon la distance.',
      },
      {
        id: 15,
        question: 'Y a-t-il des frais de service ?',
        answer: 'Oui, un frais de service de 10% (minimum 500 FCFA) est appliqué sur toutes les commandes pour couvrir le service en salle.',
      },
      {
        id: 16,
        question: 'Proposez-vous des cartes cadeaux ?',
        answer: 'Oui, nous proposons des cartes cadeaux disponibles à l\'achat au restaurant ou en ligne. Parfait pour offrir une expérience culinaire à vos proches.',
      },
    ],
  },
]

// ============================================
// HERO SECTION
// ============================================

function FAQHero() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F4A024]/5 via-white to-[#4B4F1E]/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4A024]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4B4F1E]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4A024]/10 rounded-full mb-6 border border-[#F4A024]/20">
            <HelpCircle className="w-5 h-5 text-[#F4A024]" />
            <span className="text-sm font-medium text-[#F4A024]">
              Questions Fréquentes
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            FAQ
          </h1>
        </FadeIn>
        <FadeIn delay={0.3} direction="up">
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed text-justify">
            Trouvez les réponses aux questions les plus fréquentes sur notre restaurant, nos services et nos événements.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ============================================
// FAQ ITEM
// ============================================

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <Card variant="site" padding="none" className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-base sm:text-lg text-gray-900 flex-1">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
            {answer}
          </p>
        </div>
      )}
    </Card>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function FAQPage() {
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set())

  const toggleQuestion = (questionId: number) => {
    setOpenQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  return (
    <>
      <FAQHero />

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <FadeIn key={category.id} delay={categoryIndex * 0.1}>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                    {category.title}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item) => (
                      <FAQItem
                        key={item.id}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openQuestions.has(item.id)}
                        onToggle={() => toggleQuestion(item.id)}
                      />
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Contact CTA */}
          <FadeIn delay={0.5}>
            <Card variant="site" padding="lg" className="mt-12 sm:mt-16 text-center bg-[#F4A024]/5">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Vous avez d&apos;autres questions ?
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 text-justify">
                N&apos;hésitez pas à nous contacter directement. Notre équipe est là pour vous aider.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F4A024] text-white font-semibold rounded-xl hover:bg-[#C97F16] transition-colors"
              >
                Nous Contacter
              </a>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
