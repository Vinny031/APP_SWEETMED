/**
 * categorieService — SWEET MED
 * CRUD catégories : fusionne les données mock (JSON public/) avec les catégories
 * créées/modifiées par l'admin (localStorage sweetmed_categories_custom).
 *
 * Chargement des mocks :
 *  1. fetch('/data/categories.json') — CDN Netlify en prod, Vite en dev
 *  2. Fallback sur l'import TS local — mode offline / Capacitor
 *
 * Le champ `image` du JSON stocke un chemin relatif (ex: "icons/icon_arom.webp").
 * BASE_URL est préfixé au chargement pour garantir la compatibilité dev/prod/Capacitor.
 *
 * Migration Netlify : remplacer _loadCustom/_saveCustom par des fetch() vers
 * une Netlify Function + DB.
 */
import type { Categorie } from '@/types'
import { categories as categoriesFallback } from '@/data/categories'

const CUSTOM_KEY  = 'sweetmed_categories_custom'
const DELETED_KEY = 'sweetmed_categories_deleted'

// ── Chargement des données mock ──────────────────────────────────

/** Cache en mémoire pour éviter de re-fetcher à chaque appel. */
let _mockCache: Categorie[] | null = null

async function _loadMock(): Promise<Categorie[]> {
  if (_mockCache) return _mockCache

  try {
    const base = import.meta.env.BASE_URL
    const res = await fetch(`${base}data/categories.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const raw = (await res.json()) as Categorie[]
    // Réinjecter BASE_URL sur les chemins d'images relatifs
    _mockCache = raw.map(cat =>
      cat.image ? { ...cat, image: `${base}${cat.image}` } : cat
    )
    return _mockCache
  } catch {
    // Fallback offline / Capacitor
    _mockCache = categoriesFallback
    return _mockCache
  }
}

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

function _loadDeleted(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch { return [] }
}

function _addDeleted(id: string): void {
  const deleted = _loadDeleted()
  if (!deleted.includes(id)) {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted, id]))
  }
}

// ── API publique ─────────────────────────────────────────────────

/** Retourne toutes les catégories (mock filtrées + custom fusionnées). */
async function getAll(): Promise<Categorie[]> {
  const [mock, custom, deleted] = await Promise.all([
    _loadMock(),
    Promise.resolve(_loadCustom()),
    Promise.resolve(_loadDeleted()),
  ])
  // Les catégories custom écrasent les mocks du même id (édition d'un mock)
  // Les mocks supprimés par l'admin sont exclus
  const mockFiltres = mock.filter(m =>
    !custom.some(c => c.id === m.id) && !deleted.includes(m.id)
  )
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
  const mock = await _loadMock()
  const mockItem = mock.find(c => c.id === id)
  if (!mockItem) return null
  const updated: Categorie = { ...mockItem, ...patch }
  _saveCustom([...custom, updated])
  return updated
}

/**
 * Supprime une catégorie.
 * - Custom : retirée du localStorage custom.
 * - Mock : ajoutée à la liste noire pour être exclue de getAll().
 */
async function remove(id: string): Promise<boolean> {
  const custom  = _loadCustom()
  const filtres = custom.filter(c => c.id !== id)

  if (filtres.length < custom.length) {
    _saveCustom(filtres)
    return true
  }

  // Catégorie mock : vérifier qu'elle existe avant de la blacklister
  const mock = await _loadMock()
  const estUnMock = mock.some(c => c.id === id)
  if (!estUnMock) return false
  _addDeleted(id)
  return true
}

/** Indique si une catégorie est custom (créée par l'admin). */
function estCustom(id: string): boolean {
  return id.startsWith('cat-')
}

export const categorieService = { getAll, getById, create, update, remove, estCustom }
