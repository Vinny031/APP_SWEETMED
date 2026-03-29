/**
 * Types TypeScript — SWEET MED
 * Interfaces strictes pour toute la couche de données de l'application.
 */

// ─────────────────────────────────────────────
// Catégories thématiques de médecine douce
// ─────────────────────────────────────────────

export type CategorieIdMock =
  | 'aromatherapie'
  | 'phytotherapie'
  | 'sophrologie'
  | 'acupression'
  | 'nutrition'
  | 'meditation'
  | 'ayurveda'
  | 'homeopathie'
  | 'premiers-secours'

/** IDs des catégories mock + IDs dynamiques des catégories custom (préfixe "cat-") */
export type CategorieId = CategorieIdMock | (string & {})

export interface Categorie {
  id: CategorieId
  nom: string
  description: string
  couleur: string        // classe Tailwind bg-*
  couleurTexte: string   // classe Tailwind text-*
  icone: string          // nom d'icône Lucide
  emoji: string
  image?: string         // URL image custom (ex: /icons/icon_phyto.webp)
}

// ─────────────────────────────────────────────
// Niveaux de difficulté / facilité d'accès
// ─────────────────────────────────────────────

export type NiveauDifficulte = 'debutant' | 'intermediaire' | 'avance'

// ─────────────────────────────────────────────
// Remède — entité principale de l'application
// ─────────────────────────────────────────────

export interface Remede {
  id: string
  titre: string
  /** Résumé d'une à deux phrases affiché dans les cartes et listes. Toujours du texte brut. */
  description: string
  /** Corps complet de la fiche, affiché dans RemedeDetailView. Texte brut (pas de markdown/HTML). */
  contenu: string
  categorieId: CategorieId
  tags: string[]               // mots-clés pour la recherche
  duree?: string               // ex: "10 min", "3 semaines"
  difficulte: NiveauDifficulte
  ingredients?: string[]       // plantes, huiles, etc.
  etapes?: string[]            // instructions pas à pas
  precautions?: string[]       // contre-indications
  benefices: string[]          // bienfaits principaux
  imageUrl?: string            // URL relative ou base64
  suggestion?: boolean         // apparaît dans les suggestions du jour
  dateCreation: string         // ISO 8601
}

// ─────────────────────────────────────────────
// Suggestion du jour
// ─────────────────────────────────────────────

export interface SuggestionDuJour {
  id: string
  remedeId: string
  titre: string                // titre personnalisé pour la suggestion
  message: string              // message d'accroche court
  heure?: string               // heure idéale (ex: "Matin", "Soir")
  couleurFond: string          // classe Tailwind bg-*
}

// ─────────────────────────────────────────────
// Favori sauvegardé en localStorage
// ─────────────────────────────────────────────

export interface Favori {
  remedeId: string
  dateAjout: string            // ISO 8601
  note?: string                // note personnelle optionnelle
}

// ─────────────────────────────────────────────
// Profil utilisateur (stocké localement)
// ─────────────────────────────────────────────

export interface ProfilUtilisateur {
  prenom: string
  objectifs: string[]          // ex: ["sommeil", "stress", "digestion"]
  rappelActif: boolean
  heureRappel: string          // format "HH:mm"
  themePreference: 'clair' | 'sombre' | 'auto'
  dateCreation: string
}

// ─────────────────────────────────────────────
// État global du store
// ─────────────────────────────────────────────

export interface EtatMedecine {
  remedes: Remede[]
  categories: Categorie[]
  favoris: Favori[]
  suggestions: SuggestionDuJour[]
  profil: ProfilUtilisateur | null
  recherche: string
  categorieActive: CategorieId | null
  chargement: boolean
  erreur: string | null
}

// ─────────────────────────────────────────────
// Résultat de recherche
// ─────────────────────────────────────────────

export interface ResultatRecherche {
  remedes: Remede[]
  total: number
  terme: string
}

// ─────────────────────────────────────────────
// Item de navigation TabBar
// ─────────────────────────────────────────────

export interface TabItem {
  id: string
  label: string
  icone: string
  route: string
}

// ─────────────────────────────────────────────
// Auth — re-export depuis auth.ts
// ─────────────────────────────────────────────

export type { Role, Compte, Session, LoginPayload, RegisterPayload, AuthResult } from './auth'
