-- ============================================
-- Réservation salles : types de créneaux + packs par salle
-- Aligné sur reservation_mess_officiers.json
-- ============================================

-- Types de créneaux (journée pleine, demi-journée)
CREATE TABLE IF NOT EXISTS reservation_slot_types (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  horaires TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservation_slot_types_slug ON reservation_slot_types(slug);

-- Packs / offres par salle et par type de créneau
CREATE TABLE IF NOT EXISTS hall_packs (
  id SERIAL PRIMARY KEY,
  hall_id INTEGER NOT NULL REFERENCES halls(id) ON DELETE CASCADE,
  slot_type_slug TEXT NOT NULL,
  name TEXT,
  description TEXT,
  cost_label TEXT NOT NULL,
  cost_amount NUMERIC(12, 2),
  observations TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hall_packs_hall_slot ON hall_packs(hall_id, slot_type_slug);
ALTER TABLE hall_packs ADD CONSTRAINT uq_hall_packs_hall_slot_order UNIQUE (hall_id, slot_type_slug, display_order);

COMMENT ON TABLE reservation_slot_types IS 'Types de créneaux pour réservation de salles (ex: journée pleine, demi-journée)';
COMMENT ON TABLE hall_packs IS 'Packs et offres par salle et par type de créneau (nom, description, coût, observations)';

-- Trigger updated_at
CREATE TRIGGER tr_reservation_slot_types_updated_at
  BEFORE UPDATE ON reservation_slot_types FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER tr_hall_packs_updated_at
  BEFORE UPDATE ON hall_packs FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- RLS (lecture publique, écriture admin via policies existantes ou anon pour dashboard)
ALTER TABLE reservation_slot_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_packs ENABLE ROW LEVEL SECURITY;

-- Lecture : anon (site public) + authenticated (dashboard connecté)
DROP POLICY IF EXISTS "anon_select_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "anon_select_reservation_slot_types" ON reservation_slot_types FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "authenticated_select_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "authenticated_select_reservation_slot_types" ON reservation_slot_types FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_hall_packs" ON hall_packs;
CREATE POLICY "anon_select_hall_packs" ON hall_packs FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "authenticated_select_hall_packs" ON hall_packs;
CREATE POLICY "authenticated_select_hall_packs" ON hall_packs FOR SELECT TO authenticated USING (true);

-- Écriture : anon + authenticated (dashboard)
DROP POLICY IF EXISTS "anon_insert_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "anon_insert_reservation_slot_types" ON reservation_slot_types FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "anon_update_reservation_slot_types" ON reservation_slot_types FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "anon_delete_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "anon_delete_reservation_slot_types" ON reservation_slot_types FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "authenticated_insert_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "authenticated_insert_reservation_slot_types" ON reservation_slot_types FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "authenticated_update_reservation_slot_types" ON reservation_slot_types FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_delete_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "authenticated_delete_reservation_slot_types" ON reservation_slot_types FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hall_packs" ON hall_packs;
CREATE POLICY "anon_insert_hall_packs" ON hall_packs FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_hall_packs" ON hall_packs;
CREATE POLICY "anon_update_hall_packs" ON hall_packs FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "anon_delete_hall_packs" ON hall_packs;
CREATE POLICY "anon_delete_hall_packs" ON hall_packs FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "authenticated_insert_hall_packs" ON hall_packs;
CREATE POLICY "authenticated_insert_hall_packs" ON hall_packs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_hall_packs" ON hall_packs;
CREATE POLICY "authenticated_update_hall_packs" ON hall_packs FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_delete_hall_packs" ON hall_packs;
CREATE POLICY "authenticated_delete_hall_packs" ON hall_packs FOR DELETE TO authenticated USING (true);
