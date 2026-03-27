/**
 * authService — SWEET MED
 * Couche service pour l'authentification.
 * Implémentation locale via localStorage.
 * Migration Netlify : remplacer les fonctions _load/_save par des fetch().
 */
import type { Compte, Session, LoginPayload, RegisterPayload, AuthResult, Role } from '@/types'

const KEYS = {
  COMPTES: 'sweetmed_comptes',
  SESSION: 'sweetmed_session',
} as const

// Compte admin pré-défini — créé au premier démarrage
const ADMIN_SEED = {
  email: 'admin',
  password: 'admin',
  prenom: 'Admin',
  role: 'admin' as Role,
}

// ── Web Crypto SHA-256 ────────────────────────────────────────────
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// ── Helpers localStorage (privés) ────────────────────────────────
function _loadComptes(): Compte[] {
  try {
    const raw = localStorage.getItem(KEYS.COMPTES)
    return raw ? (JSON.parse(raw) as Compte[]) : []
  } catch { return [] }
}

function _saveComptes(comptes: Compte[]): void {
  localStorage.setItem(KEYS.COMPTES, JSON.stringify(comptes))
}

function _loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEYS.SESSION)
    if (!raw) return null
    const session = JSON.parse(raw) as Session
    if (new Date(session.expiry) < new Date()) {
      localStorage.removeItem(KEYS.SESSION)
      return null
    }
    return session
  } catch { return null }
}

function _saveSession(session: Session): void {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(session))
}

// ── Initialisation au démarrage ──────────────────────────────────
async function seedAdminIfNeeded(): Promise<void> {
  const comptes = _loadComptes()
  const hash = await hashPassword(ADMIN_SEED.password)
  const comptesFiltered = comptes.filter(c => c.role !== 'admin')
  const admin: Compte = {
    id: crypto.randomUUID(),
    email: ADMIN_SEED.email,
    prenom: ADMIN_SEED.prenom,
    passwordHash: hash,
    role: 'admin',
    dateCreation: new Date().toISOString(),
  }
  _saveComptes([...comptesFiltered, admin])
}

// ── API publique ─────────────────────────────────────────────────
async function login(payload: LoginPayload): Promise<AuthResult<Session>> {
  const comptes = _loadComptes()
  const compte = comptes.find(c => c.email === payload.email.toLowerCase().trim())
  if (!compte) return { ok: false, error: 'Aucun compte trouvé pour cet email.' }

  const hash = await hashPassword(payload.password)
  if (hash !== compte.passwordHash) return { ok: false, error: 'Mot de passe incorrect.' }

  const session: Session = {
    userId: compte.id,
    role: compte.role,
    email: compte.email,
    prenom: compte.prenom,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
  _saveSession(session)
  return { ok: true, data: session }
}

async function register(payload: RegisterPayload): Promise<AuthResult<Session>> {
  const comptes = _loadComptes()
  const existe = comptes.some(c => c.email === payload.email.toLowerCase().trim())
  if (existe) return { ok: false, error: 'Un compte existe déjà pour cet email.' }

  const hash = await hashPassword(payload.password)
  const nouveau: Compte = {
    id: crypto.randomUUID(),
    email: payload.email.toLowerCase().trim(),
    prenom: payload.prenom.trim(),
    passwordHash: hash,
    role: 'user',
    dateCreation: new Date().toISOString(),
  }
  _saveComptes([...comptes, nouveau])

  const session: Session = {
    userId: nouveau.id,
    role: nouveau.role,
    email: nouveau.email,
    prenom: nouveau.prenom,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
  _saveSession(session)
  return { ok: true, data: session }
}

function logout(): void {
  localStorage.removeItem(KEYS.SESSION)
}

function getCurrentSession(): Session | null {
  return _loadSession()
}

export const authService = {
  seedAdminIfNeeded,
  login,
  register,
  logout,
  getCurrentSession,
  hashPassword,
}
