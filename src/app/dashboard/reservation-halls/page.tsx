'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui'
import {
  useReservationSlotTypes,
  useHallPacks,
  useHalls,
  useReservationContact,
} from '@/hooks'
import {
  updateSlotType,
  updateHallPack,
  updateReservationContact,
} from '@/lib/data/reservation-config'
import { useUIStore } from '@/store'
import {
  Clock,
  Building2,
  Phone,
  Mail,
  Save,
  Loader2,
  Edit,
  Receipt,
} from 'lucide-react'
import type {
  ReservationSlotType,
  HallPack,
  ReservationContact,
  Hall,
} from '@/types'

// ============================================
// SLOT TYPE ROW (inline edit)
// ============================================

function SlotTypeRow({
  slot,
  onSave,
}: {
  slot: ReservationSlotType
  onSave: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(slot.name)
  const [horaires, setHoraires] = useState(slot.horaires)
  const [saving, setSaving] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSlotType(slot.id, { name, horaires })
      addToast({ type: 'success', message: 'Créneau mis à jour' })
      setEditing(false)
      onSave()
    } catch (e) {
      addToast({
        type: 'error',
        message: e instanceof Error ? e.message : 'Erreur',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="border-b border-dashboard-border last:border-0">
      <td className="py-3 px-4">
        {editing ? (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            className="max-w-[200px]"
          />
        ) : (
          <span className="font-medium text-dashboard-text-primary">{slot.name}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {editing ? (
          <Input
            value={horaires}
            onChange={(e) => setHoraires(e.target.value)}
            placeholder="Horaires"
            className="max-w-[280px]"
          />
        ) : (
          <span className="text-dashboard-text-secondary">{slot.horaires}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        {editing ? (
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-1"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)} title="Modifier">
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </td>
    </tr>
  )
}

// ============================================
// HALL PACK ROW (inline edit) — rend une ligne complète avec nom salle
// ============================================

function HallPackRow({
  pack,
  hallName,
  onSave,
}: {
  pack: HallPack
  hallName: string
  onSave: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(pack.name ?? '')
  const [description, setDescription] = useState(pack.description ?? '')
  const [costLabel, setCostLabel] = useState(pack.costLabel)
  const [observations, setObservations] = useState(pack.observations ?? '')
  const [saving, setSaving] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateHallPack(pack.id, {
        name: name.trim() || null,
        description: description.trim() || null,
        costLabel: costLabel.trim(),
        observations: observations.trim() || null,
      })
      addToast({ type: 'success', message: 'Pack mis à jour' })
      setEditing(false)
      onSave()
    } catch (e) {
      addToast({
        type: 'error',
        message: e instanceof Error ? e.message : 'Erreur',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="border-b border-dashboard-border/50 last:border-0">
      <td className="py-3 px-4 text-sm font-medium text-dashboard-text-primary">
        {hallName}
      </td>
      <td className="py-3 px-4">
        {editing ? (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom (optionnel)"
            className="max-w-[160px]"
          />
        ) : (
          <span className="font-medium text-dashboard-text-primary">
            {pack.name ?? '—'}
          </span>
        )}
      </td>
      <td className="py-3 px-4 max-w-[200px]">
        {editing ? (
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        ) : (
          <span className="text-sm text-dashboard-text-secondary line-clamp-2">
            {pack.description ?? '—'}
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        {editing ? (
          <Input
            value={costLabel}
            onChange={(e) => setCostLabel(e.target.value)}
            placeholder="Coût (ex: 300 000 FCFA)"
            className="max-w-[160px]"
          />
        ) : (
          <span className="text-dashboard-primary font-semibold">{pack.costLabel}</span>
        )}
      </td>
      <td className="py-3 px-4 max-w-[200px]">
        {editing ? (
          <Input
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Observations"
          />
        ) : (
          <span className="text-xs text-dashboard-text-muted line-clamp-2">
            {pack.observations ?? '—'}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        {editing ? (
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-1"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)} title="Modifier">
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </td>
    </tr>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function ReservationHallsPage() {
  const addToast = useUIStore((s) => s.addToast)
  const { data: slotTypes, loading: loadingSlots, refetch: refetchSlots } = useReservationSlotTypes()
  const { data: packs, loading: loadingPacks, refetch: refetchPacks } = useHallPacks()
  const { data: halls } = useHalls()
  const { data: contact, loading: loadingContact, refetch: refetchContact } = useReservationContact()

  const [contactForm, setContactForm] = useState<ReservationContact>({
    telephoneReservation: [],
    telephonePaiement: [],
    email: '',
  })
  const [contactDirty, setContactDirty] = useState(false)
  const [savingContact, setSavingContact] = useState(false)

  useEffect(() => {
    if (contact && !contactDirty) {
      setContactForm({
        telephoneReservation: contact.telephoneReservation ?? [],
        telephonePaiement: contact.telephonePaiement ?? [],
        email: contact.email ?? '',
      })
    }
  }, [contact, contactDirty])

  const hallById = useMemo(() => {
    const map = new Map<number, Hall>()
    for (const h of halls ?? []) map.set(Number(h.id), h)
    return map
  }, [halls])

  const packsByHallAndSlot = useMemo(() => {
    const map = new Map<string, HallPack[]>()
    for (const p of packs ?? []) {
      const key = `${p.hallId}-${p.slotTypeSlug}`
      const arr = map.get(key) ?? []
      arr.push(p)
      map.set(key, arr)
    }
    for (const arr of map.values()) arr.sort((a, b) => a.displayOrder - b.displayOrder)
    return map
  }, [packs])

  const handleSaveContact = async () => {
    setSavingContact(true)
    try {
      await updateReservationContact(contactForm)
      addToast({ type: 'success', message: 'Contact réservation enregistré' })
      setContactDirty(false)
      refetchContact()
    } catch (e) {
      addToast({
        type: 'error',
        message: e instanceof Error ? e.message : 'Erreur',
      })
    } finally {
      setSavingContact(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dashboard-text-primary">
          Réservation des salles
        </h1>
        <p className="text-dashboard-text-secondary mt-1">
          Types de créneaux, packs tarifaires et contact affichés sur le site
        </p>
      </div>

      {/* Types de créneaux */}
      <Card variant="dashboard" padding="none">
        <CardHeader className="border-b border-dashboard-border">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-dashboard-primary" />
            Types de créneaux
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingSlots ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-dashboard-primary animate-spin" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-dashboard-surface-muted text-left text-sm text-dashboard-text-secondary">
                  <th className="py-3 px-4 font-medium">Nom</th>
                  <th className="py-3 px-4 font-medium">Horaires</th>
                  <th className="py-3 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(slotTypes ?? []).map((slot) => (
                  <SlotTypeRow key={slot.id} slot={slot} onSave={refetchSlots} />
                ))}
              </tbody>
            </table>
          )}
          {slotTypes?.length === 0 && !loadingSlots && (
            <p className="py-8 text-center text-dashboard-text-muted">
              Aucun type de créneau. Exécutez le seed des réservations salles.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Packs par salle */}
      <Card variant="dashboard" padding="none">
        <CardHeader className="border-b border-dashboard-border">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="w-5 h-5 text-dashboard-primary" />
            Packs par salle et créneau
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingPacks ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-dashboard-primary animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-dashboard-border">
              {(slotTypes ?? []).map((slot) => (
                <div key={slot.slug} className="p-4">
                  <h3 className="text-sm font-semibold text-dashboard-text-primary mb-3">
                    {slot.name}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="text-left text-xs text-dashboard-text-secondary border-b border-dashboard-border">
                          <th className="py-2 px-4 font-medium">Salle</th>
                          <th className="py-2 px-4 font-medium">Nom pack</th>
                          <th className="py-2 px-4 font-medium">Description</th>
                          <th className="py-2 px-4 font-medium">Coût</th>
                          <th className="py-2 px-4 font-medium">Observations</th>
                          <th className="py-2 px-4 w-24 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(halls ?? []).flatMap((h) =>
                          (packsByHallAndSlot.get(`${Number(h.id)}-${slot.slug}`) ?? []).map(
                            (pack) => (
                              <HallPackRow
                                key={pack.id}
                                pack={pack}
                                hallName={hallById.get(Number(pack.hallId))?.name ?? `Salle #${pack.hallId}`}
                                onSave={refetchPacks}
                              />
                            )
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
          {packs?.length === 0 && !loadingPacks && (
            <p className="py-8 text-center text-dashboard-text-muted">
              Aucun pack. Exécutez le seed des réservations salles.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Contact réservation */}
      <Card variant="dashboard" padding="lg">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5 text-dashboard-primary" />
            Contact réservation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingContact ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-dashboard-primary animate-spin" />
            </div>
          ) : (
            <div className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-2">
                  Téléphones réservation (un par ligne)
                </label>
                <textarea
                  className="w-full rounded-lg border border-dashboard-border px-3 py-2 text-sm"
                  rows={2}
                  value={(contactForm.telephoneReservation ?? []).join('\n')}
                  onChange={(e) => {
                    setContactForm((prev) => ({
                      ...prev,
                      telephoneReservation: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                    }))
                    setContactDirty(true)
                  }}
                  placeholder="222 22 22 22&#10;+237 651 19 19 19"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-2">
                  Téléphones paiement (un par ligne)
                </label>
                <textarea
                  className="w-full rounded-lg border border-dashboard-border px-3 py-2 text-sm"
                  rows={2}
                  value={(contactForm.telephonePaiement ?? []).join('\n')}
                  onChange={(e) => {
                    setContactForm((prev) => ({
                      ...prev,
                      telephonePaiement: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                    }))
                    setContactDirty(true)
                  }}
                  placeholder="+237 678 98 78 90"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={contactForm.email ?? ''}
                  onChange={(e) => {
                    setContactForm((prev) => ({ ...prev, email: e.target.value }))
                    setContactDirty(true)
                  }}
                  placeholder="contact@mess-officiers.cm"
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSaveContact}
                disabled={savingContact || !contactDirty}
                className="gap-2"
              >
                {savingContact ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Enregistrer le contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
