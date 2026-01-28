'use client'

import Link from 'next/link'
import { 
  ChefHat, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react'
import { useAppSettings } from '@/hooks'

const quickLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Notre Menu', href: '/menu' },
  { label: 'Réservations', href: '/reservation' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Galerie', href: '/gallery' },
]

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
]

export function PublicFooter() {
  const currentYear = new Date().getFullYear()
  const { restaurantInfo } = useAppSettings()

  // Convertir les horaires en format pour l'affichage
  const openingHours = [
    { day: 'Lundi - Vendredi', hours: restaurantInfo.openingHours.weekdays },
    { day: 'Samedi - Dimanche', hours: restaurantInfo.openingHours.weekends },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-x-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#F4A024] flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-xl sm:text-2xl text-white">
                {restaurantInfo.name}
              </span>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 text-justify break-words">
              Une expérience culinaire raffinée au cœur de Yaoundé, offrant une cuisine d'exception et un service de qualité.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-[#F4A024] rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 sm:mb-8">
              Contactez-nous
            </h3>
            <ul className="space-y-4 sm:space-y-5">
              <li>
                <a 
                  href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-[#F4A024] transition-colors group"
                >
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 text-[#F4A024]" />
                  <span className="text-sm sm:text-base">{restaurantInfo.phone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${restaurantInfo.email}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-[#F4A024] transition-colors group"
                >
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 text-[#F4A024]" />
                  <span className="text-sm sm:text-base break-all">{restaurantInfo.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 text-[#F4A024]" />
                <span className="text-sm sm:text-base">{restaurantInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours Column */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 sm:mb-8">
              Horaires d&apos;ouverture
            </h3>
            <ul className="space-y-4 sm:space-y-5">
              {openingHours.map((schedule, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 text-[#F4A024]" />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-white">{schedule.day}</p>
                    <p className="text-sm sm:text-base text-gray-400">{schedule.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 sm:mb-8">
              Liens rapides
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-gray-400 hover:text-[#F4A024] transition-colors inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-[#F4A024] rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <p className="text-sm sm:text-base text-gray-500 text-center sm:text-left">
              © {currentYear} {restaurantInfo.name}. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 sm:gap-8">
              <Link 
                href="/privacy" 
                className="text-sm sm:text-base text-gray-500 hover:text-[#F4A024] transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link 
                href="/terms" 
                className="text-sm sm:text-base text-gray-500 hover:text-[#F4A024] transition-colors"
              >
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
