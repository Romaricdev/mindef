DOCUMENT FONDATEUR TECHNIQUE
Système de gestion digitale de restaurant
(UI-FIRST · Responsive · Next.js · Supabase)
1. CONTEXTE GÉNÉRAL DU PROJET

Le projet consiste à concevoir un système digital complet de gestion de restaurant, intégrant à la fois :

un site web public

un système de commande sur place via QR Code par table

un dashboard administrateur

un système de gestion des menus et repas

un système de gestion des commandes et paiements

un système de réservation de tables

un CMS pour la gestion dynamique des contenus du site

Le système doit permettre :

de différencier clairement les commandes effectuées en ligne et celles effectuées sur place

de gérer les tables physiques du restaurant

de permettre le paiement en ligne (Carte bancaire, Mobile Money, Orange Money)

de fournir des outils d’analyse et de suivi précis pour l’exploitation du restaurant

2. STRATÉGIE GLOBALE D’IMPLÉMENTATION (PRINCIPE DIRECTEUR)
🔑 Principe fondamental (validé)

L’implémentation du projet suit une approche UI-FIRST et RESPONSIVE-FIRST.
Aucune implémentation backend (base de données, API, Supabase, Auth, paiements réels) n’est autorisée tant que l’interface utilisateur n’est pas entièrement conçue, responsive et validée.

Ce principe s’applique :

au site web

au parcours QR Code

au dashboard administrateur

Le backend interviendra uniquement après validation complète de l’UI.

3. JUSTIFICATION DU CHOIX UI-FIRST

Cette approche est stratégique pour plusieurs raisons :

Permet une visualisation immédiate du produit final

Facilite la validation métier (restaurant, commandes, parcours client)

Réduit drastiquement les refontes backend

Permet à Cursor de comprendre parfaitement les intentions fonctionnelles

Accélère fortement le développement dans un contexte de délais serrés

👉 Le backend devient une traduction fidèle de l’UI, et non une hypothèse.

4. STACK TECHNIQUE (VISION GLOBALE)
4.1 Frontend (Phase UI)

Next.js (App Router)

TypeScript

Tailwind CSS

Composants réutilisables

Données simulées (mock data)

Responsive Design (Mobile First)

4.2 Backend (Phase ultérieure)

Supabase

PostgreSQL

Supabase Auth

Supabase Storage

Edge Functions

Paiements (Stripe / Mobile Money / Orange Money)

⚠️ Le backend est explicitement exclu des premières phases.

5. TYPOLOGIE DES UTILISATEURS
Type d’utilisateur	Description
Client	Consulte le menu, commande, paie
Client sur place	Commande via QR Code
Serveur	Suit les commandes
Caissier	Supervise les paiements
Manager	Gère le restaurant
Administrateur	Paramétrage global
6. ARBORESCENCE GLOBALE DES PAGES
6.1 Site Web Public
/
├── accueil
├── menu
│   ├── catégories
│   ├── repas
├── détail-repas
├── panier
├── commande
├── paiement
├── réservation
├── à-propos
└── contact

6.2 Parcours QR Code (Sur place)

Chaque table dispose d’un QRCode unique.

Exemple :

https://site.com/table/TBL-12


Arborescence :

/table/[table_code]
├── menu
├── panier
├── confirmation
├── paiement


📌 Une commande QR Code est toujours liée à une table.

6.3 Dashboard Administrateur
/dashboard
├── overview
├── commandes
│   ├── sur-place
│   ├── en-ligne
├── tables
├── menus
│   ├── catégories
│   ├── repas
├── paiements
├── réservations
├── utilisateurs
├── cms
│   ├── pages
│   ├── sections
│   ├── bannières
├── statistiques
└── paramètres

7. DESCRIPTION DES MODULES UI (PHASE UI-FIRST)
7.1 Dashboard – Overview

Indicateurs clés :

Commandes du jour

Revenus

Tables occupées

Commandes en attente

Graphiques (jour / semaine / mois)

7.2 Gestion des Tables

Liste des tables

Capacité

Statut :

Libre

Occupée

Réservée

QR Code généré visuellement

7.3 Gestion des Menus
Catégories

Nom

Description

Ordre d’affichage

Actif / Inactif

Repas

Nom

Description

Prix

Image

Catégorie

Disponibilité

Temps de préparation estimé

7.4 Gestion des Commandes

Numéro de commande

Type :

Sur place

En ligne

Table (si applicable)

Détails des repas

Statut :

En attente

En préparation

Servie

Annulée

Paiement :

Payé / Non payé

7.5 Paiements

Méthode

Montant

Statut

Référence transaction

Historique

7.6 Réservations

Nom client

Contact

Table

Date & heure

Nombre de personnes

Statut :

Confirmée

Annulée

7.7 CMS (Site Web)

Pages dynamiques

Sections éditables

Textes

Images

Paramètres SEO

8. MODÉLISATION DE LA BASE DE DONNÉES (PHASE FUTURE)

⚠️ Ces tables sont décrites à titre de référence.
Elles ne doivent PAS être implémentées avant validation UI.

Tables principales :

users

tables

categories

meals

orders

order_items

payments

reservations

cms_pages

cms_sections

👉 Chaque table est directement issue d’un écran UI validé.

9. RÈGLES MÉTIER IMPORTANTES

Une commande sur place est liée à une table

Une commande en ligne n’est pas liée à une table

Une table ne peut avoir qu’une commande active

Le paiement est requis avant validation

Une réservation peut être :

effectuée en ligne

créée manuellement via le dashboard

10. PHASAGE OFFICIEL DU PROJET
PHASE 1 — UI SITE WEB (RESPONSIVE)

Mobile first

Mock data

Parcours client complet

PHASE 2 — UI QR CODE

Commande fluide en salle

Table contextuelle

PHASE 3 — UI DASHBOARD ADMIN

Exploitation complète

Navigation fonctionnelle

PHASE 4 — BACKEND

Supabase

DB

Auth

Paiements

PHASE 5 — CONNEXION & TESTS
11. STRUCTURE PROJET (PHASE UI)
src/
├── app/
│   ├── (public)
│   ├── (table)
│   ├── dashboard
│
├── components/
│   ├── ui
│   ├── layout
│   ├── cards
│   ├── tables
│
├── mocks/
│   ├── categories.ts
│   ├── meals.ts
│   ├── orders.ts
│
├── lib
└── styles

DESCRIPTION DÉTAILLÉE DES MODULES
Système de gestion digitale de restaurant
1. MODULE SITE WEB PUBLIC
🎯 Rôle

C’est la vitrine digitale du restaurant et le principal point d’entrée des commandes en ligne.

1.1 Page Accueil

Objectif

Présenter le restaurant

Mettre en avant les plats phares

Inciter à commander ou réserver

Contenus

Bannière principale (image + slogan)

Boutons CTA :

Commander

Voir le menu

Réserver une table

Sections dynamiques (via CMS) :

Plats populaires

Promotions

Avis clients

Contraintes UI

Mobile first

Chargement rapide

CTA toujours visibles

1.2 Module Menu Public

Objectif
Permettre au client de consulter clairement les repas disponibles.

Fonctionnalités

Liste des catégories

Liste des repas par catégorie

Fiche repas :

Image

Description

Prix

Disponibilité

Ajout au panier

Contraintes

Navigation fluide

Filtres simples

Scroll optimisé mobile

1.3 Panier & Commande en ligne

Objectif
Permettre au client de constituer et valider sa commande.

Fonctionnalités

Liste des repas sélectionnés

Quantité modifiable

Total dynamique

Passage à la commande

Choix :

À emporter

Livraison (si activé)

1.4 Module Paiement (UI)

Objectif
Simuler et préparer l’intégration future du paiement.

Méthodes prévues

Carte bancaire

Mobile Money

Orange Money

UI

Sélection du moyen de paiement

Récapitulatif commande

État paiement :

En attente

Réussi

Échoué (UI)

1.5 Module Réservation de table (Public)

Objectif
Permettre aux clients de réserver une table à l’avance.

Fonctionnalités

Sélection date / heure

Nombre de personnes

Informations client

Confirmation visuelle

2. MODULE COMMANDE SUR PLACE (QR CODE)
🎯 Rôle

Fluidifier la commande en salle sans intervention humaine directe.

2.1 Accès par QR Code

Chaque table dispose d’un QR Code unique.

Résultat du scan

Accès direct au menu

Contexte table automatiquement pris en compte

2.2 Menu Contextualisé (Table)

Différences avec menu public

Mention de la table

Commande associée à la table

Priorité service sur place

2.3 Panier & Validation

Fonctionnalités

Ajout / retrait repas

Confirmation commande

Paiement ou validation sans paiement immédiat (selon règles futures)

3. MODULE DASHBOARD ADMINISTRATEUR
🎯 Rôle

C’est le cœur opérationnel du système.

3.1 Dashboard – Overview

Objectif
Vue synthétique de l’activité.

Indicateurs

Nombre de commandes

Revenus

Tables occupées

Réservations du jour

UI

Cartes KPI

Graphiques (mock)

3.2 Module Gestion des Tables

Objectif
Gérer les tables physiques du restaurant.

Fonctionnalités

Création / édition / suppression

Capacité

Statut :

Libre

Occupée

Réservée

Visualisation QR Code

3.3 Module Menus & Repas
Catégories

Création / modification

Activation / désactivation

Ordre d’affichage

Repas

Gestion complète des plats

Prix

Images

Disponibilité

Lien avec catégories

3.4 Module Commandes

Objectif
Suivi précis de toutes les commandes.

Fonctionnalités

Distinction :

Sur place

En ligne

Détails commande

Statut préparation

Suivi paiement

3.5 Module Paiements

Objectif
Centraliser les transactions.

Fonctionnalités

Historique paiements

Méthode

Montant

Statut

Référence transaction

3.6 Module Réservations

Objectif
Optimiser l’occupation des tables.

Fonctionnalités

Vue calendrier

Création manuelle

Modification / annulation

Liaison avec tables

3.7 Module CMS

Objectif
Permettre une gestion autonome du contenu du site.

Fonctionnalités

Pages dynamiques

Sections éditables

Images

SEO basique

3.8 Module Utilisateurs & Rôles

Objectif
Sécuriser l’accès au système.

Rôles

Admin

Manager

Serveur

Caissier

Fonctionnalités

Attribution rôles

Accès par module

3.9 Module Statistiques & Analyse

Objectif
Aider à la prise de décision.

Données analysées

Meilleures ventes

Heures de pointe

Taux d’occupation tables

Revenus par période

3.10 Module Paramètres

Objectif
Configurer le système.

Fonctionnalités

Informations restaurant

Méthodes de paiement activées

Horaires

Paramètres généraux

4. MODULE BACKEND (PHASE FUTURE)

⚠️ Non implémenté en phase UI, mais anticipé :

Base de données PostgreSQL

Supabase Auth

Policies de sécurité

Paiements réels

Notifications

5. LOGIQUE TRANSVERSALE (IMPORTANT)

Tous les modules sont pensés UI d’abord

Chaque écran correspond à une future table ou relation backend

Aucune fonctionnalité backend ne doit exister sans UI validée

Le responsive est une obligation, pas une option

6. CONCLUSION (VISION MAÎTRE D’OUVRAGE)

Ce projet n’est pas une simple app :

c’est un outil d’exploitation métier

pensé pour la réalité terrain d’un restaurant

scalable

structuré

et livré vite grâce à l’UI-FIRST


1. MODULE SITE WEB PUBLIC (COMMANDE EN LIGNE)
1.1 Pages

Accueil

Menu

Détail repas

Panier

Commande

Paiement

Réservation

Pages CMS (À propos, Contact…)

1.2 Interactions

Cliquer sur “Commander”

Parcourir les catégories

Voir le détail d’un repas

Ajouter / retirer du panier

Modifier quantités

Passer à la commande

Choisir un mode de paiement

Réserver une table

1.3 Workflow

L’utilisateur arrive sur Accueil

Il clique sur Menu

Il sélectionne une catégorie

Il consulte un repas

Il ajoute le repas au panier

Il accède au panier

Il valide la commande

Il choisit un mode de paiement

Il voit un écran de confirmation

📌 À ce stade :

Toutes les données sont mockées

Le workflow est linéaire et fluide

Chaque étape correspondra plus tard à une table backend

2. MODULE MENU PUBLIC
2.1 Pages

Menu (liste catégories)

Liste repas par catégorie

Détail repas (modal ou page)

2.2 Interactions

Scroll catégories

Sélection catégorie

Ajout rapide au panier

Accès au détail d’un repas

2.3 Workflow

Chargement des catégories

Sélection d’une catégorie

Affichage dynamique des repas

Interaction directe avec le panier (sans quitter la page)

🎯 Objectif UX : zéro friction

3. MODULE PANIER
3.1 Pages

Panier

3.2 Interactions

Augmenter / réduire quantités

Supprimer un repas

Voir le total

Passer à la commande

3.3 Workflow

Le panier récupère les repas sélectionnés

L’utilisateur ajuste les quantités

Le total se met à jour dynamiquement

L’utilisateur clique sur Commander

📌 Le panier est central :
il sera partagé entre commande en ligne et QR Code

4. MODULE PAIEMENT (UI)
4.1 Pages

Paiement

Confirmation paiement

4.2 Interactions

Sélection méthode :

Carte bancaire

Mobile Money

Orange Money

Validation paiement

Visualisation du statut

4.3 Workflow

L’utilisateur arrive sur la page paiement

Il choisit une méthode

Il valide

Le système affiche :

Paiement en cours

Paiement réussi (UI)

Paiement échoué (UI)

⚠️ Aucun vrai paiement à ce stade

5. MODULE RÉSERVATION DE TABLE (PUBLIC)
5.1 Pages

Réservation

Confirmation réservation

5.2 Interactions

Sélection date

Sélection heure

Nombre de personnes

Saisie infos client

Confirmation

5.3 Workflow

Le client accède à la page réservation

Il choisit date / heure

Il indique le nombre de personnes

Il valide

Il reçoit une confirmation visuelle

6. MODULE COMMANDE SUR PLACE (QR CODE)
6.1 Pages

Menu table

Panier table

Confirmation commande

Paiement (si requis)

6.2 Interactions

Scan QR Code

Ajout repas au panier

Validation commande

Paiement ou simple validation

6.3 Workflow

Le client scanne le QR Code

Il arrive sur /table/[code]

Le menu s’affiche avec le contexte table

Il compose sa commande

Il valide

La commande est associée à la table

📌 Différence clé :

Ici, pas de livraison

Tout est lié à une table

7. MODULE DASHBOARD ADMIN – OVERVIEW
7.1 Pages

Dashboard (Overview)

7.2 Interactions

Consultation KPIs

Filtrage par période

Navigation vers modules

7.3 Workflow

L’admin arrive sur le dashboard

Il voit l’état global :

Commandes

Tables

Revenus

Il clique vers un module précis

8. MODULE GESTION DES TABLES
8.1 Pages

Liste des tables

Détail table

Création / édition table

8.2 Interactions

Ajouter une table

Modifier capacité

Voir QR Code

Changer statut

8.3 Workflow

L’admin crée une table

Le système génère un QR Code

La table devient disponible

Son statut évolue selon l’usage

9. MODULE MENUS & REPAS (ADMIN)
9.1 Pages

Catégories

Repas

Formulaire création / édition

9.2 Interactions

Créer une catégorie

Créer un repas

Associer repas ↔ catégorie

Activer / désactiver

9.3 Workflow

L’admin crée les catégories

Il ajoute les repas

Les repas apparaissent sur le site public

10. MODULE COMMANDES (ADMIN)
10.1 Pages

Liste commandes

Détail commande

10.2 Interactions

Filtrer par type (en ligne / sur place)

Changer statut commande

Voir détails repas

10.3 Workflow

Une commande est créée (UI)

Elle apparaît dans la liste

Son statut évolue :

En attente

En préparation

Servie

11. MODULE PAIEMENTS (ADMIN)
11.1 Pages

Historique paiements

Détail paiement

11.2 Interactions

Filtrer paiements

Voir méthode

Vérifier statut

11.3 Workflow

Une commande payée génère un paiement

Le paiement est visible dans l’historique

L’admin peut l’auditer

12. MODULE RÉSERVATIONS (ADMIN)
12.1 Pages

Liste réservations

Calendrier

Création manuelle

12.2 Interactions

Créer réservation

Modifier

Annuler

12.3 Workflow

Une réservation est créée

Elle bloque une table

La table passe en statut “réservée”

13. MODULE CMS
13.1 Pages

Pages

Sections

Édition contenu

13.2 Interactions

Modifier texte

Modifier images

Réordonner sections

13.3 Workflow

L’admin édite une page

Les changements impactent le site public

Aucun déploiement requis (plus tard)

14. MODULE UTILISATEURS & RÔLES
14.1 Pages

Liste utilisateurs

Création utilisateur

Attribution rôles

14.2 Interactions

Créer un utilisateur

Assigner un rôle

Restreindre accès

14.3 Workflow

L’admin crée un utilisateur

Il lui attribue un rôle

L’utilisateur accède aux modules autorisés

15. VISION TRANSVERSALE (IMPORTANT)

Chaque page UI = future API

Chaque interaction = future action backend

Chaque workflow = future logique métier

Rien n’est improvisé côté backend