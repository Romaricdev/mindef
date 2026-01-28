'use client'

import { Shield, Lock, Eye, FileText } from 'lucide-react'
import { FadeIn } from '@/components/animations'
import { Card, CardContent } from '@/components/ui'

// ============================================
// HERO SECTION
// ============================================

function PrivacyHero() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F4A024]/5 via-white to-[#4B4F1E]/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4A024]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4B4F1E]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4A024]/10 rounded-full mb-6 border border-[#F4A024]/20">
            <Shield className="w-5 h-5 text-[#F4A024]" />
            <span className="text-sm font-medium text-[#F4A024]">
              Confidentialité
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Politique de Confidentialité
          </h1>
        </FadeIn>
        <FadeIn delay={0.3} direction="up">
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed text-justify">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ============================================
// CONTENT SECTIONS
// ============================================

const sections = [
  {
    icon: Eye,
    title: 'Collecte des Données',
    content: `Nous collectons les informations que vous nous fournissez directement lorsque vous :
- Créez un compte sur notre site
- Effectuez une réservation
- Passez une commande
- Nous contactez via notre formulaire de contact
- Vous abonnez à notre newsletter

Les informations collectées incluent : nom, adresse email, numéro de téléphone, adresse postale (pour les livraisons), et préférences alimentaires.`,
  },
  {
    icon: Lock,
    title: 'Utilisation des Données',
    content: `Nous utilisons vos données personnelles pour :
- Traiter vos réservations et commandes
- Vous contacter concernant vos réservations ou commandes
- Améliorer nos services et votre expérience
- Vous envoyer des communications marketing (avec votre consentement)
- Respecter nos obligations légales

Nous ne vendons jamais vos données personnelles à des tiers.`,
  },
  {
    icon: Shield,
    title: 'Protection des Données',
    content: `Nous mettons en place des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès non autorisé, altération, divulgation ou destruction. Cela inclut :
- Chiffrement des données sensibles
- Accès restreint aux données personnelles
- Surveillance régulière de nos systèmes
- Formation de notre personnel sur la protection des données`,
  },
  {
    icon: FileText,
    title: 'Vos Droits',
    content: `Conformément à la réglementation en vigueur, vous disposez des droits suivants :
- Droit d'accès : Vous pouvez demander une copie de vos données personnelles
- Droit de rectification : Vous pouvez corriger vos données inexactes
- Droit à l'effacement : Vous pouvez demander la suppression de vos données
- Droit d'opposition : Vous pouvez vous opposer au traitement de vos données
- Droit à la portabilité : Vous pouvez récupérer vos données dans un format structuré

Pour exercer ces droits, contactez-nous à l'adresse indiquée dans la section "Contact".`,
  },
]

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function PrivacyPage() {
  return (
    <>
      <PrivacyHero />

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-12">
            {sections.map((section, index) => (
              <FadeIn key={section.title} delay={index * 0.1}>
                <Card variant="site" padding="lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#F4A024]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-[#F4A024]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                    {section.content}
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>

          {/* Contact Section */}
          <FadeIn delay={0.5}>
            <Card variant="site" padding="lg" className="mt-12 sm:mt-16 bg-gray-50">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Contact
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify mb-4">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                veuillez nous contacter :
              </p>
              <div className="space-y-2 text-base sm:text-lg text-gray-700">
                <p><strong>Email :</strong> contact@messofficiers.cm</p>
                <p><strong>Téléphone :</strong> +237 6XX XXX XXX</p>
                <p><strong>Adresse :</strong> Quartier Général, Yaoundé</p>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
