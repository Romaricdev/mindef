-- Nombre de personnes actuellement à la table (saisi à l'ouverture, avant toute commande validée).
-- Utilisé pour afficher "X personne(s) actuellement" quand la table est occupée mais qu'aucune commande n'a encore été envoyée en cuisine.
ALTER TABLE restaurant_tables
  ADD COLUMN IF NOT EXISTS current_party_size INTEGER CHECK (current_party_size IS NULL OR current_party_size > 0);

COMMENT ON COLUMN restaurant_tables.current_party_size IS 'Nombre de convives à la table (saisi à l''ouverture POS). Réinitialisé à NULL à la libération de la table.';
