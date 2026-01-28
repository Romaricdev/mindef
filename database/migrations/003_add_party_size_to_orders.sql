-- Migration: Ajouter party_size dans la table orders
-- Date: 2026-01-23
-- Description: Permet de stocker le nombre de personnes pour chaque commande sur place

ALTER TABLE orders
  ADD COLUMN party_size INTEGER CHECK (party_size > 0);

COMMENT ON COLUMN orders.party_size IS 'Nombre de personnes pour les commandes sur place (dine-in). NULL pour takeaway/delivery.';

-- Mettre à jour les commandes existantes avec une valeur par défaut si nécessaire
-- (optionnel, car NULL est acceptable)
UPDATE orders
SET party_size = 1
WHERE type = 'dine-in' AND party_size IS NULL;
