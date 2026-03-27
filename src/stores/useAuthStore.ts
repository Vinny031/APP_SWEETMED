/**
 * useAuthStore — SWEET MED
 * Store Pinia pour la gestion de la session et des rôles.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session, LoginPayload, RegisterPayload } from '@/types'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // ─── État ───────────────────────────────────────────────────────
  const session    = ref<Session | null>(authService.getCurrentSession())
  const chargement = ref(false)
  const erreur     = ref<string | null>(null)

  // ─── Getters ────────────────────────────────────────────────────
  const estConnecte = computed(() => session.value !== null)
  const estAdmin    = computed(() => session.value?.role === 'admin')
  const prenom      = computed(() => session.value?.prenom ?? '')
  const role        = computed(() => session.value?.role ?? null)

  // ─── Actions ────────────────────────────────────────────────────
  async function connexion(payload: LoginPayload): Promise<boolean> {
    chargement.value = true
    erreur.value     = null
    const result     = await authService.login(payload)
    chargement.value = false
    if (result.ok) {
      session.value = result.data
      return true
    }
    erreur.value = result.error
    return false
  }

  async function inscription(payload: RegisterPayload): Promise<boolean> {
    chargement.value = true
    erreur.value     = null
    const result     = await authService.register(payload)
    chargement.value = false
    if (result.ok) {
      session.value = result.data
      return true
    }
    erreur.value = result.error
    return false
  }

  function deconnexion(): void {
    authService.logout()
    session.value = null
  }

  function effacerErreur(): void {
    erreur.value = null
  }

  return {
    session, chargement, erreur,
    estConnecte, estAdmin, prenom, role,
    connexion, inscription, deconnexion, effacerErreur,
  }
})
