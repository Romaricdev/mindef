-- ============================================
-- RLS : autoriser le rôle "authenticated" sur reservation_slot_types et hall_packs
-- À exécuter si le dashboard (utilisateur connecté) ne voit pas les créneaux/packs
-- ============================================

-- reservation_slot_types
DROP POLICY IF EXISTS "authenticated_select_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "authenticated_select_reservation_slot_types" ON reservation_slot_types FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "authenticated_insert_reservation_slot_types" ON reservation_slot_types FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "authenticated_update_reservation_slot_types" ON reservation_slot_types FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_delete_reservation_slot_types" ON reservation_slot_types;
CREATE POLICY "authenticated_delete_reservation_slot_types" ON reservation_slot_types FOR DELETE TO authenticated USING (true);

-- hall_packs
DROP POLICY IF EXISTS "authenticated_select_hall_packs" ON hall_packs;
CREATE POLICY "authenticated_select_hall_packs" ON hall_packs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_hall_packs" ON hall_packs;
CREATE POLICY "authenticated_insert_hall_packs" ON hall_packs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_hall_packs" ON hall_packs;
CREATE POLICY "authenticated_update_hall_packs" ON hall_packs FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_delete_hall_packs" ON hall_packs;
CREATE POLICY "authenticated_delete_hall_packs" ON hall_packs FOR DELETE TO authenticated USING (true);
