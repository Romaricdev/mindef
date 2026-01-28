'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useAppSettings } from '@/hooks'

export function SiteFooter() {
  const { restaurantInfo } = useAppSettings()

  return (
    <footer className="bg-site-background-muted border-t border-site-border-light">
      <div className="site-container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Contact */}
          <div>
            <h3 className="font-poppins font-semibold text-lg text-site-text-primary mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-site-text-secondary">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-site-primary" />
                <span>{restaurantInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-site-primary" />
                <span>{restaurantInfo.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-site-primary mt-0.5" />
                <span>{restaurantInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="font-poppins font-semibold text-lg text-site-text-primary mb-4">
              Horaires d&apos;ouverture
            </h3>
            <ul className="space-y-3 text-sm text-site-text-secondary">
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-site-primary" />
                <div>
                  <p className="font-medium">Lundi - Vendredi</p>
                  <p>{restaurantInfo.openingHours.weekdays}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-site-primary" />
                <div>
                  <p className="font-medium">Weekend</p>
                  <p>{restaurantInfo.openingHours.weekends}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Liens */}
          <div>
            <h3 className="font-poppins font-semibold text-lg text-site-text-primary mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menu" className="text-site-text-secondary hover:text-site-primary transition-colors">
                  Notre Menu
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="text-site-text-secondary hover:text-site-primary transition-colors">
                  Réservation
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-site-text-secondary hover:text-site-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-site-text-secondary hover:text-site-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-site-border-light">
          <p className="text-sm text-site-text-secondary text-center">
            © {new Date().getFullYear()} {restaurantInfo.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
