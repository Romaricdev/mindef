'use client'

import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui'
import { useHalls, useHallPacks, useReservationContact } from '@/hooks'
import { Building2, ArrowRight, Check, Phone, Mail, MessageCircle } from 'lucide-react'
import { Stagger } from '@/components/animations'
import type { Hall, ID, HallPack } from '@/types'

// ============================================
// HALL SELECTION COMPONENT
// ============================================

interface HallSelectionProps {
  onSelectHall: (hall: Hall) => void
  selectedHallId?: ID
  /** Si fourni, affiche les packs pour ce type de créneau et filtre les salles ayant des packs. */
  slotTypeSlug?: string | null
  /** Si true, affiche le bloc contact réservation en bas. */
  showContact?: boolean
}

export function HallSelection({
  onSelectHall,
  selectedHallId,
  slotTypeSlug,
  showContact = true,
}: HallSelectionProps) {
  const { data: halls } = useHalls()
  const { data: packs } = useHallPacks(
    slotTypeSlug ? { slotTypeSlug } : undefined
  )
  const { data: contact } = useReservationContact()

  const availableHalls = useMemo(() => {
    const list = halls.filter((h) => h.status === 'available')
    if (!slotTypeSlug || !packs?.length) return list
    const hallIdsWithPacks = new Set(packs.map((p) => p.hallId))
    return list.filter((h) => hallIdsWithPacks.has(Number(h.id)))
  }, [halls, slotTypeSlug, packs])

  const packsByHallId = useMemo(() => {
    const map = new Map<number, HallPack[]>()
    for (const p of packs ?? []) {
      const arr = map.get(p.hallId) ?? []
      arr.push(p)
      map.set(p.hallId, arr)
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.displayOrder - b.displayOrder)
    }
    return map
  }, [packs])

  const hasContact =
    showContact &&
    contact &&
    (contact.telephoneReservation?.length > 0 ||
      contact.telephonePaiement?.length > 0 ||
      !!contact.email)

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
          Choisissez une salle
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Sélectionnez la salle qui convient le mieux à votre événement
        </p>
      </div>

      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {availableHalls.map((hall) => {
          const isSelected = selectedHallId === hall.id
          const hallImage = (hall.images && hall.images[0]) || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'

          return (
            <article
              key={hall.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectHall(hall)}
              onKeyDown={(e) => e.key === 'Enter' && onSelectHall(hall)}
              className={`
                group relative flex flex-col rounded-xl overflow-hidden
                bg-white border border-gray-200
                shadow-sm hover:shadow-md hover:border-gray-300
                transition-all duration-300 ease-out cursor-pointer
                ${isSelected ? 'ring-2 ring-gray-800 ring-offset-2 shadow-md' : ''}
              `}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] min-h-[200px] bg-gray-100 overflow-hidden">
                <img
                  src={hallImage}
                  alt={hall.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                      Sélectionnée
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h3 className="font-semibold text-lg text-white drop-shadow-md line-clamp-1">
                    {hall.name}
                  </h3>
                  <p className="text-xs text-white/90 mt-0.5 drop-shadow-sm">
                    {hall.capacity} {hall.capacity === 1 ? 'personne' : 'personnes'}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {hall.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {hall.description}
                  </p>
                )}

                {(() => {
                  const hallPacksList = packsByHallId.get(Number(hall.id)) ?? []
                  if (hallPacksList.length === 0) {
                    return hall.amenities && hall.amenities.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {hall.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200/80"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hall.amenities.length > 3 && (
                          <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-500 ring-1 ring-gray-200/80">
                            +{hall.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    ) : <div className="flex-1 min-h-[24px]" />
                  }
                  return (
                    <div className="mb-5 flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                        Packs & tarifs
                      </p>
                      <ul className="space-y-2">
                        {hallPacksList.map((pack) => (
                          <li
                            key={pack.id}
                            className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-lg bg-gray-50 px-3 py-2.5 text-sm border border-gray-100"
                          >
                            <span className="font-medium text-gray-800">
                              {pack.name ?? 'Offre'}
                            </span>
                            <span className="font-semibold text-gray-800 tabular-nums shrink-0">
                              {pack.costLabel}
                            </span>
                            {pack.description && (
                              <span className="w-full text-xs text-gray-500 leading-snug mt-0.5">
                                {pack.description}
                              </span>
                            )}
                            {pack.observations && (
                              <span className="w-full text-xs text-gray-500 italic mt-0.5">
                                {pack.observations}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })()}
                {hall.amenities && hall.amenities.length > 0 && !packsByHallId.get(Number(hall.id))?.length && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {hall.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200/80"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hall.amenities.length > 3 && (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-500 ring-1 ring-gray-200/80">
                        +{hall.amenities.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectHall(hall)
                    }}
                    className={`
                      flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 ring-1 ring-gray-200/80'
                      }
                    `}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        Sélectionnée
                      </>
                    ) : (
                      <>
                        Voir la salle
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </Stagger>

      {availableHalls.length === 0 && (
        <Card variant="site" padding="lg">
          <CardContent>
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Aucune salle disponible pour le moment
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {hasContact && contact && (
        <Card
          variant="site"
          padding="lg"
          className="mt-12 border-l-4 border-l-site-primary bg-site-background-muted/90 shadow-sm"
        >
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-site-primary/15 text-site-primary">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact réservation
                </h3>
                <p className="text-sm text-gray-500">
                  Réservation de salle, informations et paiement
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {contact.telephoneReservation?.length > 0 && (
                <div className="rounded-lg bg-white/80 p-4 ring-1 ring-gray-200/80">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <Phone className="h-3.5 w-3.5" />
                    Réservation
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {contact.telephoneReservation.map((tel, i) => (
                      <a
                        key={i}
                        href={`tel:${tel.replace(/\s/g, '')}`}
                        className="font-medium text-gray-800 underline-offset-2 hover:underline hover:text-site-primary"
                      >
                        {tel}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {contact.telephonePaiement?.length > 0 && (
                <div className="rounded-lg bg-white/80 p-4 ring-1 ring-gray-200/80">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <Phone className="h-3.5 w-3.5" />
                    Paiement
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {contact.telephonePaiement.map((tel, i) => (
                      <a
                        key={i}
                        href={`tel:${tel.replace(/\s/g, '')}`}
                        className="font-medium text-gray-800 underline-offset-2 hover:underline hover:text-site-primary"
                      >
                        {tel}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {contact.email && (
                <div className="rounded-lg bg-white/80 p-4 ring-1 ring-gray-200/80 sm:col-span-2 lg:col-span-1">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-medium text-gray-800 underline-offset-2 hover:underline hover:text-site-primary"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
