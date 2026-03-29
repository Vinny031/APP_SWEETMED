/**
 * remedeService — SWEET MED
 * CRUD remèdes : fusionne les données mock (JSON public/) avec les remèdes
 * créés/modifiés par l'admin (localStorage sweetmed_remedes_custom).
 *
 * Chargement des mocks :
 *  1. fetch('/data/remedes.json') — CDN Netlify en prod, Vite en dev
 *  2. Fallback sur l'import TS local — mode offline / Capacitor
 *
 * Migration Netlify : remplacer _loadCustom/_saveCustom par des fetch() vers
 * une Netlify Function + DB.
 */
import type { Remede } from '@/types'
import { remedes as remedesFallback } from '@/data/remedes'

const CUSTOM_KEY = 'sweetmed_remedes_custom'

// ── Chargement des données mock ──────────────────────────────────

/** Cache en mémoire pour éviter de re-fetcher à chaque appel. */
let _mockCache: Remede[] | null = null

async function _loadMock(): Promise<Remede[]> {
  if (_mockCache) return _mockCache

  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/remedes.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    _mockCache = (await res.json()) as Remede[]
    return _mockCache
  } catch {
    // Fallback offline / Capacitor
    _mockCache = remedesFallback
    return _mockCache
  }
}

// ── Helpers localStorage (privés) ────────────────────────────────

function _loadCustom(): Remede[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    return raw ? (JSON.parse(raw) as Remede[]) : []
  } catch { return [] }
}

function _saveCustom(remedes: Remede[]): void {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(remedes))
}

// ── API publique — toutes async pour refléter la forme future fetch() ──

/** Retourne tous les remèdes (mock filtrés + custom fusionnés). */
async function getAll(): Promise<Remede[]> {
  const [mock, custom] = await Promise.all([_loadMock(), Promise.resolve(_loadCustom())])
  // Les remèdes custom écrasent les mocks du même id (édition d'un mock)
  const mockFiltres = mock.filter(m => !custom.some(c => c.id === m.id))
  return [...mockFiltres, ...custom]
}

/** Retourne un remède par son ID. */
async function getById(id: string): Promise<Remede | undefined> {
  const tous = await getAll()
  return tous.find(r => r.id === id)
}

/** Crée un nouveau remède (admin uniquement). */
async function create(payload: Omit<Remede, 'id' | 'dateCreation'>): Promise<Remede> {
  const custom = _loadCustom()
  const nouveau: Remede = {
    ...payload,
    id: `custom-${crypto.randomUUID()}`,
    dateCreation: new Date().toISOString(),
  }
  _saveCustom([...custom, nouveau])
  return nouveau
}

/**
 * Met à jour un remède existant.
 * Si c'est un remède mock, il est cloné en custom (les mocks restent intacts).
 */
async function update(id: string, patch: Partial<Remede>): Promise<Remede | null> {
  const custom = _loadCustom()
  const index = custom.findIndex(r => r.id === id)

  if (index >= 0) {
    custom[index] = { ...custom[index], ...patch }
    _saveCustom(custom)
    return custom[index]
  }

  // Édition d'un remède mock : cloner dans custom
  const mock = await _loadMock()
  const mockItem = mock.find(r => r.id === id)
  if (!mockItem) return null
  const updated: Remede = { ...mockItem, ...patch }
  _saveCustom([...custom, updated])
  return updated
}

/**
 * Supprime un remède custom.
 * Les remèdes mock ne peuvent pas être supprimés (retourne false).
 */
async function remove(id: string): Promise<boolean> {
  const custom = _loadCustom()
  const filtres = custom.filter(r => r.id !== id)
  if (filtres.length === custom.length) return false
  _saveCustom(filtres)
  return true
}

/** Indique si un remède est un custom (créé par l'admin). */
function estCustom(id: string): boolean {
  return id.startsWith('custom-')
}

export const remedeService = { getAll, getById, create, update, remove, estCustom }
