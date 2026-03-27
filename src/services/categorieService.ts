/**
 * categorieService — SWEET MED
 * CRUD catégories : fusionne les données mock (statiques) avec les catégories
 * créées/modifiées par l'admin (localStorage sweetmed_categories_custom).
 * Migration Netlify : remplacer _loadCustom/_saveCustom par des fetch().
 */
import type { Categorie } from '@/types'
import { categories as categoriesMock } from '@/data/categories'

const CUSTOM_KEY = 'sweetmed_categories_custom'

// ── Helpers localStorage (privés) ────────────────────────────────
function _loadCustom(): Categorie[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    return raw ? (JSON.parse(raw) as Categorie[]) : []
  } catch { return [] }
}

function _saveCustom(cats: Categorie[]): void {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(cats))
}

// ── API publique ─────────────────────────────────────────────────

/** Retourne toutes les catégories (mock filtrées + custom fusionnées). */
async function getAll(): Promise<Categorie[]> {
  const custom = _loadCustom()
  // Les catégories custom écrasent les mocks du même id (édition d'un mock)
  const mockFiltres = categoriesMock.filter(m => !custom.some(c => c.id === m.id))
  return [...mockFiltres, ...custom]
}

/** Retourne une catégorie par son ID. */
async function getById(id: string): Promise<Categorie | undefined> {
  const toutes = await getAll()
  return toutes.find(c => c.id === id)
}

/** Crée une nouvelle catégorie (admin uniquement). */
async function create(payload: Omit<Categorie, 'id'>): Promise<Categorie> {
  const custom = _loadCustom()
  const slug = payload.nom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  const id = `cat-${slug}-${Date.now()}`
  const nouvelle: Categorie = { ...payload, id }
  _saveCustom([...custom, nouvelle])
  return nouvelle
}

/**
 * Met à jour une catégorie existante.
 * Si c'est une catégorie mock, elle est clonée en custom (les mocks restent intacts).
 */
async function update(id: string, patch: Partial<Categorie>): Promise<Categorie | null> {
  const custom = _loadCustom()
  const index = custom.findIndex(c => c.id === id)

  if (index >= 0) {
    custom[index] = { ...custom[index], ...patch }
    _saveCustom(custom)
    return custom[index]
  }

  // Édition d'un mock : cloner dans custom
  const mock = categoriesMock.find(c => c.id === id)
  if (!mock) return null
  const updated: Categorie = { ...mock, ...patch }
  _saveCustom([...custom, updated])
  return updated
}

/**
 * Supprime une catégorie custom.
 * Les catégories mock ne peuvent pas être supprimées (retourne false).
 */
async function remove(id: string): Promise<boolean> {
  const custom = _loadCustom()
  const filtres = custom.filter(c => c.id !== id)
  if (filtres.length === custom.length) return false
  _saveCustom(filtres)
  return true
}

/** Indique si une catégorie est custom (créée par l'admin). */
function estCustom(id: string): boolean {
  return id.startsWith('cat-')
}

export const categorieService = { getAll, getById, create, update, remove, estCustom }
