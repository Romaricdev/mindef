-- Lier les réservations de salles au type de créneau et au pack choisi (aligné sur le parcours site public).
ALTER TABLE hall_reservations
  ADD COLUMN IF NOT EXISTS slot_type_slug TEXT REFERENCES reservation_slot_types(slug) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS hall_pack_id INTEGER REFERENCES hall_packs(id) ON DELETE SET NULL;

COMMENT ON COLUMN hall_reservations.slot_type_slug IS 'Type de créneau (ex. journee_pleine, demi_journee) choisi lors de la réservation.';
COMMENT ON COLUMN hall_reservations.hall_pack_id IS 'Pack tarifaire choisi (référence hall_packs).';
