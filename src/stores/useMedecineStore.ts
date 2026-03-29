/**
 * Store Pinia — useMedecineStore
 * Gestion centralisée de l'état de l'application SWEET MED.
 * Persistance via localStorage, aucun backend requis.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Remede,
  Categorie,
  Favori,
  SuggestionDuJour,
  ProfilUtilisateur,
  CategorieId,
  ResultatRecherche,
} from '@/types'
import { suggestions as suggestionsFallback } from '@/data/suggestions'
import { citations } from '@/data/citations'
import { remedeService } from '@/services/remedeService'
import { categorieService } from '@/services/categorieService'

// Clés de stockage localStorage
const STORAGE_KEYS = {
  FAVORIS: 'sweetmed_favoris',
  PROFIL: 'sweetmed_profil',
} as const

export const useMedecineStore = defineStore('medecine', () => {
  // ─── État réactif ──────────────────────────────────────────

  /** Liste complète des remèdes (mock + custom fusionnés via remedeService) */
  const remedes = ref<Remede[]>([])

  /** Liste des catégories disponibles (mock + custom fusionnées via categorieService) */
  const categories = ref<Categorie[]>([])

  /** Suggestions du jour */
  const suggestions = ref<SuggestionDuJour[]>(suggestionsFallback)

  /** Favoris de l'utilisateur (persistés en localStorage) */
  const favoris = ref<Favori[]>(_chargerFavoris())

  /** Profil utilisateur (persisté en localStorage) */
  const profil = ref<ProfilUtilisateur | null>(_chargerProfil())

  /** Terme de recherche actif */
  const termeRecherche = ref<string>('')

  /** Catégorie sélectionnée dans l'explorateur */
  const categorieActive = ref<CategorieId | null>(null)

  /** Indicateur de chargement */
  const chargement = ref<boolean>(false)

  /** Message d'erreur éventuel */
  const erreur = ref<string | null>(null)

  // ─── Getters (computed) ────────────────────────────────────

  /**
   * Remèdes filtrés selon la recherche et la catégorie active.
   * Recherche dans : titre, description, tags, ingrédients.
   */
  const remedesFiltres = computed<ResultatRecherche>(() => {
    let resultats = [...remedes.value]
    const terme = termeRecherche.value.toLowerCase().trim()

    // Filtre par catégorie
    if (categorieActive.value) {
      resultats = resultats.filter(r => r.categorieId === categorieActive.value)
    }

    // Filtre par terme de recherche
    if (terme.length > 0) {
      resultats = resultats.filter(remede => {
        const dansLeTitre = remede.titre.toLowerCase().includes(terme)
        const dansDescript = remede.description.toLowerCase().includes(terme)
        const dansLesTags = remede.tags.some(t => t.toLowerCase().includes(terme))
        const dansIngredients = remede.ingredients?.some(i => i.toLowerCase().includes(terme)) ?? false
        return dansLeTitre || dansDescript || dansLesTags || dansIngredients
      })
    }

    return {
      remedes: resultats,
      total: resultats.length,
      terme: termeRecherche.value,
    }
  })

  /**
   * Suggestions enrichies avec les données des remèdes associés.
   */
  const suggestionsEnrichies = computed(() => {
    return suggestions.value.map(suggestion => {
      const remede = remedes.value.find(r => r.id === suggestion.remedeId)
      return { ...suggestion, remede }
    })
  })

  /**
   * Remèdes marqués comme favoris, avec le détail complet.
   */
  const remedesFavoris = computed<Remede[]>(() => {
    const idsFavoris = new Set(favoris.value.map(f => f.remedeId))
    return remedes.value.filter(r => idsFavoris.has(r.id))
  })

  /**
   * Vérifie si un remède est en favori.
   */
  const estFavori = computed(() => {
    return (remedeId: string): boolean => {
      return favoris.value.some(f => f.remedeId === remedeId)
    }
  })

  /**
   * Nombre de favoris (pour le badge TabBar).
   */
  const nombreFavoris = computed<number>(() => favoris.value.length)

  /**
   * Remèdes suggérés du jour (marqués suggestion: true).
   */
  const remedesSuggestions = computed<Remede[]>(() => {
    return remedes.value.filter(r => r.suggestion === true)
  })

  /**
   * Catégorie par son ID.
   */
  const getCategorieById = computed(() => {
    return (id: CategorieId): Categorie | undefined => {
      return categories.value.find(c => c.id === id)
    }
  })

  /**
   * Suggestion du jour selon le jour de la semaine (0 = Dimanche).
   */
  const suggestionDuJour = computed(() => {
    const enrichies = suggestionsEnrichies.value
    return enrichies[new Date().getDay() % enrichies.length]
  })

  /**
   * Citation du jour selon le jour de la semaine (0 = Dimanche).
   */
  const citationDuJour = computed(() => citations[new Date().getDay()])

  /**
   * Statistiques pour le profil.
   */
  const statistiques = computed(() => ({
    totalRemedes: remedes.value.length,
    totalFavoris: favoris.value.length,
    totalCategories: categories.value.length,
    remederParCategorie: categories.value.map(cat => ({
      categorie: cat,
      count: remedes.value.filter(r => r.categorieId === cat.id).length,
    })),
  }))

  // ─── Actions ───────────────────────────────────────────────

  /**
   * Bascule l'état favori d'un remède.
   */
  function toggleFavori(remedeId: string): void {
    const index = favoris.value.findIndex(f => f.remedeId === remedeId)

    if (index >= 0) {
      // Retirer des favoris
      favoris.value.splice(index, 1)
    } else {
      // Ajouter aux favoris
      const nouveauFavori: Favori = {
        remedeId,
        dateAjout: new Date().toISOString(),
      }
      favoris.value.push(nouveauFavori)
    }

    _sauvegarderFavoris()
  }

  /**
   * Ajouter une note personnelle à un favori.
   */
  function ajouterNoteFavori(remedeId: string, note: string): void {
    const favori = favoris.value.find(f => f.remedeId === remedeId)
    if (favori) {
      favori.note = note
      _sauvegarderFavoris()
    }
  }

  /**
   * Met à jour le terme de recherche.
   */
  function setRecherche(terme: string): void {
    termeRecherche.value = terme
  }

  /**
   * Efface la recherche.
   */
  function effacerRecherche(): void {
    termeRecherche.value = ''
  }

  /**
   * Sélectionne ou désélectionne une catégorie.
   */
  function setCategorie(id: CategorieId | null): void {
    categorieActive.value = categorieActive.value === id ? null : id
  }

  /**
   * Obtient un remède par son ID.
   */
  function getRemede(id: string): Remede | undefined {
    return remedes.value.find(r => r.id === id)
  }

  /**
   * Sauvegarde ou met à jour le profil utilisateur.
   */
  function sauvegarderProfil(donnesProfil: Partial<ProfilUtilisateur>): void {
    if (profil.value) {
      profil.value = { ...profil.value, ...donnesProfil }
    } else {
      profil.value = {
        prenom: '',
        objectifs: [],
        rappelActif: false,
        heureRappel: '08:00',
        themePreference: 'clair',
        dateCreation: new Date().toISOString(),
        ...donnesProfil,
      }
    }
    _sauvegarderProfil()
  }

  // ─── Actions admin (CRUD remèdes) ──────────────────────────────

  /**
   * Charge la liste fusionnée mock + custom depuis remedeService.
   * Appelé au démarrage dans App.vue.
   */
  async function initialiser(): Promise<void> {
    chargement.value = true
    const [r, c, s] = await Promise.all([
      remedeService.getAll(),
      categorieService.getAll(),
      _chargerSuggestions(),
    ])
    remedes.value    = r
    categories.value = c
    suggestions.value = s
    chargement.value = false
  }

  /** Charge les suggestions depuis public/data, fallback sur l'import TS. */
  async function _chargerSuggestions(): Promise<SuggestionDuJour[]> {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/suggestions.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as SuggestionDuJour[]
    } catch {
      return suggestionsFallback
    }
  }

  /** Crée un nouveau remède (admin uniquement). */
  async function creerRemede(payload: Omit<Remede, 'id' | 'dateCreation'>): Promise<Remede> {
    const nouveau = await remedeService.create(payload)
    remedes.value = await remedeService.getAll()
    return nouveau
  }

  /** Modifie un remède existant (admin uniquement). */
  async function modifierRemede(id: string, patch: Partial<Remede>): Promise<void> {
    await remedeService.update(id, patch)
    remedes.value = await remedeService.getAll()
  }

  /**
   * Supprime un remède custom (admin uniquement).
   * Retourne false si c'est un remède mock (non supprimable).
   */
  async function supprimerRemede(id: string): Promise<boolean> {
    const ok = await remedeService.remove(id)
    if (ok) remedes.value = await remedeService.getAll()
    return ok
  }

  /** Crée une nouvelle catégorie (admin uniquement). */
  async function creerCategorie(payload: Omit<Categorie, 'id'>): Promise<Categorie> {
    const nouvelle = await categorieService.create(payload)
    categories.value = await categorieService.getAll()
    return nouvelle
  }

  /** Modifie une catégorie existante (admin uniquement). */
  async function modifierCategorie(id: string, patch: Partial<Categorie>): Promise<void> {
    await categorieService.update(id, patch)
    categories.value = await categorieService.getAll()
  }

  /**
   * Supprime une catégorie custom (admin uniquement).
   * Retourne false si c'est une catégorie mock (non supprimable).
   */
  async function supprimerCategorie(id: string): Promise<boolean> {
    const ok = await categorieService.remove(id)
    if (ok) categories.value = await categorieService.getAll()
    return ok
  }

  /**
   * Réinitialise toutes les données utilisateur.
   */
  function reinitialiserDonnees(): void {
    favoris.value = []
    profil.value = null
    termeRecherche.value = ''
    categorieActive.value = null
    localStorage.removeItem(STORAGE_KEYS.FAVORIS)
    localStorage.removeItem(STORAGE_KEYS.PROFIL)
  }

  // ─── Helpers privés ────────────────────────────────────────

  /** Charge les favoris depuis localStorage */
  function _chargerFavoris(): Favori[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORIS)
      return data ? (JSON.parse(data) as Favori[]) : []
    } catch {
      return []
    }
  }

  /** Persiste les favoris en localStorage */
  function _sauvegarderFavoris(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORIS, JSON.stringify(favoris.value))
    } catch (e) {
      console.error('[SWEET MED] Erreur sauvegarde favoris:', e)
    }
  }

  /** Charge le profil depuis localStorage */
  function _chargerProfil(): ProfilUtilisateur | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFIL)
      return data ? (JSON.parse(data) as ProfilUtilisateur) : null
    } catch {
      return null
    }
  }

  /** Persiste le profil en localStorage */
  function _sauvegarderProfil(): void {
    try {
      if (profil.value) {
        localStorage.setItem(STORAGE_KEYS.PROFIL, JSON.stringify(profil.value))
      }
    } catch (e) {
      console.error('[SWEET MED] Erreur sauvegarde profil:', e)
    }
  }

  // ─── Expose publique ───────────────────────────────────────
  return {
    // État
    remedes,
    categories,
    suggestions,
    favoris,
    profil,
    termeRecherche,
    categorieActive,
    chargement,
    erreur,
    // Getters
    remedesFiltres,
    suggestionsEnrichies,
    suggestionDuJour,
    citationDuJour,
    remedesFavoris,
    estFavori,
    nombreFavoris,
    remedesSuggestions,
    getCategorieById,
    statistiques,
    // Actions
    initialiser,
    toggleFavori,
    ajouterNoteFavori,
    setRecherche,
    effacerRecherche,
    setCategorie,
    getRemede,
    sauvegarderProfil,
    reinitialiserDonnees,
    // Actions admin — remèdes
    creerRemede,
    modifierRemede,
    supprimerRemede,
    // Actions admin — catégories
    creerCategorie,
    modifierCategorie,
    supprimerCategorie,
  }
})
