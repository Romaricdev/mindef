-- Mode maintenance : clé app_settings pour bloquer réservations, commandes, dashboard et POS
INSERT INTO app_settings (key, value)
VALUES ('maintenance_mode', to_jsonb(false))
ON CONFLICT (key) DO NOTHING;
