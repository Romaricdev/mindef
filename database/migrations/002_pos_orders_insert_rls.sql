-- Migration: RLS INSERT/DELETE pour commandes POS (orders, order_items, order_item_addons)
-- Exécuter dans SQL Editor Supabase si rls.sql a été appliqué avant ces ajouts.

-- Orders
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon WITH CHECK (true);

-- Order items
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE TO anon USING (true);

-- Order item addons
DROP POLICY IF EXISTS "anon_insert_order_item_addons" ON order_item_addons;
CREATE POLICY "anon_insert_order_item_addons" ON order_item_addons FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_order_item_addons" ON order_item_addons;
CREATE POLICY "anon_delete_order_item_addons" ON order_item_addons FOR DELETE TO anon USING (true);
