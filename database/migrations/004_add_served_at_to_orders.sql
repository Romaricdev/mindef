-- Migration: Ajouter served_at dans la table orders
-- Date: 2026-01-26
-- Description: Heure de remise au client (kitchen_status = served). Le timer cuisine s'arrête à cette date.

ALTER TABLE orders
  ADD COLUMN served_at TIMESTAMPTZ;

COMMENT ON COLUMN orders.served_at IS 'Heure de remise au client (kitchen_status = served). Le timer cuisine s''arrête à cette date.';
