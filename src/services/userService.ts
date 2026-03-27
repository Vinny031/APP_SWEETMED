/**
 * userService — SWEET MED
 * Gestion du profil utilisateur connecté.
 * Migration Netlify : remplacer localStorage par fetch('/api/profile').
 */
import type { ProfilUtilisateur } from '@/types'
import { authService } from './authService'

const PROFIL_KEY = 'sweetmed_profil'

async function getProfile(): Promise<ProfilUtilisateur | null> {
  try {
    const raw = localStorage.getItem(PROFIL_KEY)
    return raw ? (JSON.parse(raw) as ProfilUtilisateur) : null
  } catch { return null }
}

async function saveProfile(patch: Partial<ProfilUtilisateur>): Promise<ProfilUtilisateur> {
  const existing = await getProfile()
  const session = authService.getCurrentSession()
  const updated: ProfilUtilisateur = {
    prenom: session?.prenom ?? '',
    objectifs: [],
    rappelActif: false,
    heureRappel: '08:00',
    themePreference: 'clair',
    dateCreation: new Date().toISOString(),
    ...existing,
    ...patch,
  }
  localStorage.setItem(PROFIL_KEY, JSON.stringify(updated))
  return updated
}

export const userService = { getProfile, saveProfile }
