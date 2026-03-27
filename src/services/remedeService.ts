/**
 * remedeService — SWEET MED
 * CRUD remèdes : fusionne les données mock (statiques) avec les remèdes
 * créés/modifiés par l'admin (localStorage sweetmed_remedes_custom).
 * Migration Netlify : remplacer _loadCustom/_saveCustom par des fetch().
 */
import type { Remede } from '@/types'
import { remedes as remedesMock } from '@/data/remedes'

const CUSTOM_KEY = 'sweetmed_remedes_custom'

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
  const custom = _loadCustom()
  // Les remèdes custom écrasent les mocks du même id (édition d'un mock)
  const mockFiltres = remedesMock.filter(m => !custom.some(c => c.id === m.id))
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
  const mock = remedesMock.find(r => r.id === id)
  if (!mock) return null
  const updated: Remede = { ...mock, ...patch }
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
