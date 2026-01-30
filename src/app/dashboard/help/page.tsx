'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import {
  LayoutDashboard,
  Monitor,
  UtensilsCrossed,
  Building2,
  Receipt,
  Calendar,
  ShoppingBag,
  ChefHat,
  Package,
  Grid3X3,
  Layers,
  Settings,
  HelpCircle,
  ArrowRight,
  ListOrdered,
  CreditCard,
  Truck,
  Wifi,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

const navSections = [
  { id: 'intro', label: 'Introduction', icon: BookOpen },
  { id: 'dashboard-overview', label: 'Vue d\'ensemble du Dashboard', icon: LayoutDashboard },
  { id: 'dashboard-pages', label: 'Pages du Dashboard', icon: ListOrdered },
  { id: 'pos-overview', label: 'Vue d\'ensemble du POS', icon: Monitor },
  { id: 'pos-workflows', label: 'Workflows POS', icon: ArrowRight },
  { id: 'pos-interfaces', label: 'Interfaces et actions POS', icon: CreditCard },
  { id: 'pos-delivery', label: 'Livraison au client et factures', icon: Truck },
  { id: 'pos-offline', label: 'Mode hors ligne', icon: Wifi },
] as const

export default function DashboardHelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-dashboard-text-primary flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-dashboard-primary" />
          Aide utilisateur
        </h1>
        <p className="mt-2 text-dashboard-text-secondary">
          Guide complet pour utiliser le dashboard et le POS du Mess des Officiers. Toutes les interfaces, actions et workflows sont expliqués de A à Z.
        </p>
      </div>

      {/* Table des matières */}
      <Card className="mb-10 border-dashboard-border">
        <CardHeader>
          <CardTitle className="text-lg">Sommaire</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="grid sm:grid-cols-2 gap-2">
            {navSections.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2 py-2 px-3 rounded-lg text-dashboard-text-secondary hover:bg-dashboard-surface-muted hover:text-dashboard-primary transition-colors"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{label}</span>
              </a>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Contenu */}
      <div className="space-y-10">
        {/* Introduction */}
        <section id="intro" className="scroll-mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-dashboard-text-secondary text-sm leading-relaxed">
              <p>
                Cette aide décrit l&apos;utilisation du <strong className="text-dashboard-text-primary">dashboard administrateur</strong> et du <strong className="text-dashboard-text-primary">POS (Point de Vente)</strong>. En la suivant, vous saurez : gérer les commandes, les produits, les menus, les tables et salles ; prendre des commandes sur place ou à emporter ; encaisser et imprimer les factures ; et utiliser l&apos;application en mode hors ligne.
              </p>
              <p>
                <strong>Dashboard</strong> : accessible via le menu latéral. Il sert à configurer l&apos;établissement (paramètres, produits, menus, tables, salles, réservations) et à consulter les commandes.
              </p>
              <p>
                <strong>POS</strong> : accessible via le lien « POS » dans le menu. C&apos;est l&apos;écran de caisse pour prendre les commandes, suivre la cuisine et encaisser le client (livraison au client = remise du bon + paiement + facture).
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Vue d'ensemble Dashboard */}
        <section id="dashboard-overview" className="scroll-mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" />
                Vue d&apos;ensemble du Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-dashboard-text-secondary text-sm leading-relaxed">
              <p>
                Le dashboard affiche une <strong>vue d&apos;ensemble</strong> (KPIs : revenus, nombre de commandes, panier moyen, clients) et des graphiques. Les commandes récentes sont listées avec un clic pour ouvrir le détail.
              </p>
              <p>
                Le <strong>menu latéral</strong> permet d&apos;accéder à : Dashboard, POS, Tables, Salles, Réservation salles, Réservations, Commandes, Menus, Produits, Catégories, Addons, Paramètres, et cette Aide.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Pages du Dashboard */}
        <section id="dashboard-pages" className="scroll-mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5" />
                Pages du Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <HelpSection
                icon={UtensilsCrossed}
                title="Tables"
                href="/dashboard/tables"
                content="Liste des tables du restaurant (numéro, capacité, statut : libre / occupée / réservée). Actions : générer le QR code pour la commande à table, modifier ou supprimer une table, ajouter une table. Le statut se met à jour depuis le POS quand une commande est ouverte ou libérée."
              />
              <HelpSection
                icon={Building2}
                title="Salles"
                href="/dashboard/halls"
                content="Gestion des salles pour événements (nom, capacité, équipements, statut). Actions : modifier, supprimer, ajouter une salle. Les salles sont utilisées pour les réservations de salles sur le site public."
              />
              <HelpSection
                icon={Receipt}
                title="Réservation salles"
                href="/dashboard/reservation-halls"
                content="Configuration des réservations de salles : (1) Types de créneaux (ex. Journée pleine, Demi-journée) avec nom et horaires ; (2) Packs par salle et créneau (nom, description, libellé tarif, observations) ; (3) Contact réservation (téléphones réservation, téléphones paiement, email). Ces infos s'affichent sur la page réservation salles du site public."
              />
              <HelpSection
                icon={Calendar}
                title="Réservations"
                href="/dashboard/reservations"
                content="Vue consolidée des réservations (tables et salles). Affichage des détails (client, date, créneau, taille). Actions : confirmer ou annuler une réservation. Filtrage par statut possible."
              />
              <HelpSection
                icon={ShoppingBag}
                title="Commandes"
                href="/dashboard/orders"
                content="Liste de toutes les commandes avec statut (En attente, Confirmée, En préparation, Prête, Livrée, Annulée) et type (Sur place, À emporter, Livraison). Clic sur une commande pour voir le détail (articles, client, total, paiement). Action possible : mettre à jour le statut."
              />
              <HelpSection
                icon={ChefHat}
                title="Menus"
                href="/dashboard/menus"
                content="Gestion des menus (ex. Prédéfini, Quotidien). Chaque menu associe des produits et peut être actif ou non. Actions : créer un menu, modifier, dupliquer, supprimer. Les menus du jour sont utilisés par le POS pour afficher les produits disponibles."
              />
              <HelpSection
                icon={Package}
                title="Produits"
                href="/dashboard/products"
                content="Catalogue des produits (nom, catégorie, prix, image, disponibilité). Actions : ajouter un produit, modifier, supprimer, activer/désactiver la disponibilité. Les produits sont regroupés par catégorie et apparaissent dans les menus."
              />
              <HelpSection
                icon={Grid3X3}
                title="Catégories"
                href="/dashboard/categories"
                content="Catégories de produits (ex. Entrées, Plats, Desserts, Boissons). Actions : ajouter une catégorie, modifier, activer/désactiver, supprimer. Les catégories servent à organiser les produits dans le POS et sur le site."
              />
              <HelpSection
                icon={Layers}
                title="Addons"
                href="/dashboard/addons"
                content="Options additionnelles pour les produits (ex. Supplément fromage, Taille XL). Un addon peut être inclus ou payant. Ils sont proposés dans le POS lors de l'ajout d'un produit à la commande."
              />
              <HelpSection
                icon={Settings}
                title="Paramètres"
                href="/dashboard/settings"
                content="Paramètres généraux : nom et coordonnées du restaurant, horaires d'ouverture, frais de livraison, taux de service, créneaux de réservation. Ces valeurs sont utilisées sur le site public et dans le POS (ex. frais de livraison pour les commandes à emporter avec livraison)."
              />
            </CardContent>
          </Card>
        </section>

        {/* Vue d'ensemble POS */}
        <section id="pos-overview" className="scroll-mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Vue d&apos;ensemble du POS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-dashboard-text-secondary text-sm leading-relaxed">
              <p>
                Le POS est composé de <strong>trois zones</strong> :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Panneau gauche</strong> : onglets Tables, En ligne, Réservations. Tables = plan des tables et bouton « Commande à emporter ». En ligne = commandes reçues en ligne ou par téléphone. Réservations = créneaux du jour pour lier une réservation à une table.</li>
                <li><strong>Panneau central</strong> : produits du menu du jour, filtrables par catégorie. Visible une fois qu&apos;une commande est en cours (table sélectionnée ou à emporter).</li>
                <li><strong>Panneau droit</strong> : commande en cours (liste des articles, quantités, sous-total, total, options livraison pour à emporter, boutons Annuler / Attente / Valider).</li>
              </ul>
              <p>
                En <strong>mobile</strong>, des onglets en haut permettent de basculer entre Tables, Produits et Commande.
              </p>
              <p>
                En-tête du POS : heure, date, bouton <strong>Commandes en cours</strong> (cuisine), bouton <strong>Factures</strong>, indicateur de synchronisation et déconnexion.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Workflows POS */}
        <section id="pos-workflows" className="scroll-mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Workflows POS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div>
                <h4 className="font-semibold text-dashboard-text-primary mb-2">Commande sur place (table)</h4>
                <ol className="list-decimal pl-6 space-y-1 text-dashboard-text-secondary">
                  <li>Ouvrir l&apos;onglet <strong>Tables</strong> dans le panneau gauche.</li>
                  <li>Cliquer sur une table (libre, occupée ou réservée). Une fenêtre s&apos;ouvre : nombre de couverts (optionnel), bouton <strong>Démarrer la commande</strong> ou <strong>Libérer la table</strong>.</li>
                  <li>Choisir « Démarrer la commande ». La table passe en occupée, le panneau Produits et le panneau Commande s&apos;affichent.</li>
                  <li>Cliquer sur les produits pour les ajouter. Si des addons existent, une fenêtre propose les options (inclus ou payant).</li>
                  <li>Dans le panneau Commande : ajuster les quantités (+ / −), supprimer un article, optionnellement mettre la commande en <strong>Attente</strong> (pause) ou <strong>Annuler</strong>.</li>
                  <li>Cliquer sur <strong>Valider</strong>. La commande part en cuisine (elle apparaît dans « Commandes en cours »).</li>
                  <li>Pour ajouter des articles à une commande déjà en cuisine : « Commandes en cours » → choisir la commande → <strong>Compléter</strong> → ajouter les lignes → <strong>Mettre à jour</strong>.</li>
                  <li>Quand le client a fini : « Commandes en cours » → sélectionner la commande → <strong>Compléter</strong> (si ajouts) puis <strong>Payer</strong>, ou directement <strong>Payer</strong>. Choisir le mode de paiement (Espèces / Carte / Mobile), valider. La table peut être libérée automatiquement après paiement.</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-dashboard-text-primary mb-2">Commande à emporter</h4>
                <ol className="list-decimal pl-6 space-y-1 text-dashboard-text-secondary">
                  <li>Dans le panneau gauche (onglet Tables), cliquer sur <strong>Commande à emporter</strong>.</li>
                  <li>Une nouvelle commande sans table s&apos;ouvre. Panneau Produits et Commande actifs.</li>
                  <li>Ajouter les produits (avec addons si proposés). Dans le panneau Commande, vous pouvez activer <strong>Frais de livraison</strong> (montant défini dans Paramètres).</li>
                  <li><strong>Valider</strong> → commande envoyée en cuisine. Puis dans « Commandes en cours » : faire évoluer le statut (En préparation → Prêt) et enfin <strong>Payer</strong> pour encaisser et imprimer la facture.</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-dashboard-text-primary mb-2">Commandes en ligne / téléphone</h4>
                <ol className="list-decimal pl-6 space-y-1 text-dashboard-text-secondary">
                  <li>Ouvrir l&apos;onglet <strong>En ligne</strong> dans le panneau gauche. Les commandes en attente ou en cours s&apos;affichent avec un badge (nombre).</li>
                  <li>Pour chaque commande : consulter le détail, puis mettre à jour le statut (En attente → Confirmée → En préparation → Prête → Livrée). Ces statuts informent le client et la cuisine.</li>
                  <li>Quand la commande est prête et remise au client, passer le statut à Livrée. Le paiement est géré en dehors du POS (déjà réglé en ligne ou à la remise).</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-dashboard-text-primary mb-2">Réservations (tables)</h4>
                <ol className="list-decimal pl-6 space-y-1 text-dashboard-text-secondary">
                  <li>Onglet <strong>Réservations</strong> : affichage des réservations du jour par créneau.</li>
                  <li>Cliquer sur une réservation ou une table associée pour ouvrir la configuration de table et démarrer une commande pour ce créneau (même workflow que « Commande sur place »).</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Interfaces et actions POS */}
        <section id="pos-interfaces" className="scroll-mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Interfaces et actions POS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-dashboard-text-secondary text-sm leading-relaxed">
              <p><strong>Configuration de table (modal)</strong> : après un clic sur une table, vous pouvez saisir le nombre de personnes (optionnel), démarrer la commande ou libérer la table. Si la table est réservée, la réservation du créneau peut être indiquée.</p>
              <p><strong>Panneau Produits</strong> : filtres par catégorie en haut ; clic sur un produit = ajout d&apos;une quantité 1 à la commande. Si le produit a des addons, une fenêtre s&apos;ouvre pour choisir les options avant d&apos;ajouter.</p>
              <p><strong>Panneau Commande</strong> : chaque ligne = produit + addons éventuels, avec boutons − / quantité / + et suppression. Sous-total, éventuellement frais de livraison, total. Boutons : Annuler (abandon de la commande), Attente (mise en pause, la commande reste en mémoire), Valider (envoi en cuisine).</p>
              <p><strong>Commandes en cours (modal)</strong> : liste des commandes en cuisine (En attente, En préparation, Prêt, Remise). Filtres par statut. Pour chaque commande : mise à jour du statut cuisine, « Remise » (marquer comme remise au client), <strong>Compléter</strong> (ajouter des lignes puis Mettre à jour), <strong>Payer</strong> (ouvre la modal de paiement).</p>
              <p><strong>Modal Paiement</strong> : choix du mode (Espèces, Carte, Mobile). En espèces : saisie du montant reçu et calcul de la monnaie à rendre. Bouton « Valider le paiement » enregistre le paiement, génère la facture et peut libérer la table pour les commandes sur place.</p>
            </CardContent>
          </Card>
        </section>

        {/* Livraison au client et factures */}
        <section id="pos-delivery" className="scroll-mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Livraison au client et factures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-dashboard-text-secondary text-sm leading-relaxed">
              <p>
                <strong>Livraison au client</strong> = remise du bon de commande / de la facture au client après paiement. Workflow typique : commande validée → cuisine prépare → statut « Prêt » ou « Remise » dans « Commandes en cours » → clic <strong>Payer</strong> → choix du mode de paiement → validation → la facture s&apos;affiche (aperçu thermal) et peut être imprimée ou téléchargée.
              </p>
              <p>
                Bouton <strong>Factures</strong> dans l&apos;en-tête du POS : ouvre la liste des commandes payées du jour (avec numéro de facture, montant, mode de paiement). Clic sur une facture pour voir le détail et réimprimer ou télécharger l&apos;aperçu. En mode hors ligne, les factures récemment payées restent visibles depuis le cache local.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Mode hors ligne */}
        <section id="pos-offline" className="scroll-mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Mode hors ligne
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-dashboard-text-secondary text-sm leading-relaxed">
              <p>
                Si la connexion est coupée, le POS continue de fonctionner : vous pouvez prendre des commandes, les valider en cuisine et enregistrer les paiements. Les opérations sont mises en file (file de synchronisation) et envoyées automatiquement lorsque la connexion revient. Un indicateur dans l&apos;en-tête affiche le nombre d&apos;opérations en attente et l&apos;état en ligne / hors ligne.
              </p>
              <p>
                Les factures payées en hors ligne sont conservées en cache et restent visibles dans l&apos;onglet Factures. Après reconnexion, les paiements sont synchronisés avec le serveur et les numéros de facture définitifs peuvent être attribués.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-dashboard-border text-center text-sm text-dashboard-text-muted">
        <p>Mess des Officiers — Dashboard & POS. Pour toute question, contactez l&apos;administrateur.</p>
      </div>
    </div>
  )
}

function HelpSection({
  icon: Icon,
  title,
  href,
  content,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  href: string
  content: string
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-dashboard-surface-muted flex items-center justify-center">
        <Icon className="w-4 h-4 text-dashboard-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-dashboard-text-primary flex items-center gap-2">
          <Link href={href} className="hover:text-dashboard-primary transition-colors">
            {title}
          </Link>
        </h4>
        <p className="mt-1 text-dashboard-text-secondary leading-relaxed">{content}</p>
      </div>
    </div>
  )
}
