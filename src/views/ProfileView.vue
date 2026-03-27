<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import { useAuthStore } from '@/stores/useAuthStore'

const store     = useMedecineStore()
const authStore = useAuthStore()
const router    = useRouter()

const prenom          = ref(store.profil?.prenom ?? authStore.prenom)
const sauvegardeOk    = ref(false)
const confirmerReinit = ref(false)


let _feedbackTimer: ReturnType<typeof setTimeout> | null = null

function sauvegarder() {
  store.sauvegarderProfil({ prenom: prenom.value.trim(), rappelActif: false, heureRappel: '08:00' })
  sauvegardeOk.value = true
  if (_feedbackTimer) clearTimeout(_feedbackTimer)
  _feedbackTimer = setTimeout(() => { sauvegardeOk.value = false }, 2200)
}

onUnmounted(() => { if (_feedbackTimer) clearTimeout(_feedbackTimer) })

function confirmerReinitialisation() {
  store.reinitialiserDonnees()
  prenom.value = ''
  confirmerReinit.value = false
}

function seDeconnecter() {
  authStore.deconnexion()
  router.replace('/auth')
}
</script>

<template>
  <div class="min-h-screen bg-ink-50">

    <!-- ══ Header ═══════════════════════════════════════════════ -->
    <header class="px-5 pb-5 bg-white border-b border-ink-100 pt-safe-header-md">
      <div class="flex items-center gap-3">
        <fa :icon="['fas','user']" class="text-ink-800 text-4xl shrink-0" />
        <div>
          <p class="eyebrow mb-0">{{ authStore.estAdmin ? 'Administrateur' : 'Membre' }}</p>
          <h1 class="font-display text-2xl font-bold text-ink-800 leading-tight tracking-tight">
            {{ store.profil?.prenom || authStore.prenom || 'Mon profil' }}
          </h1>
        </div>
      </div>
    </header>

    <!-- ══ Formulaire ═══════════════════════════════════════════ -->
    <div class="px-4 pt-3 space-y-3 pb-6">

      <!-- Prénom -->
      <section class="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
        <div class="px-5 py-3.5 border-b border-ink-100">
          <h2 class="font-bold text-sm text-ink-800">Mon prénom</h2>
        </div>
        <div class="px-5 py-4">
          <input v-model="prenom" type="text" placeholder="Comment vous appeler ?" maxlength="30" class="input" />
        </div>
      </section>

      <!-- Sauvegarder -->
      <button
        class="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm text-white
               transition-all duration-300 active:scale-[0.97] min-h-[52px]"
        :class="sauvegardeOk ? 'bg-mint-600' : 'bg-mint-500'"
        @click="sauvegarder"
      >
        <fa v-if="sauvegardeOk" :icon="['fas','circle-check']" />
        <fa v-else :icon="['fas','floppy-disk']" />
        {{ sauvegardeOk ? 'Profil sauvegardé !' : 'Sauvegarder le profil' }}
      </button>

      <!-- À propos -->
      <section class="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
        <div class="px-5 py-3.5 border-b border-ink-100">
          <h2 class="font-bold text-sm text-ink-800">À propos</h2>
        </div>
        <div class="divide-y divide-ink-100">
          <div class="flex items-center justify-between px-5 py-3.5">
            <span class="text-sm text-ink-700">Version</span>
            <span class="text-xs font-bold text-ink-400">1.0.0</span>
          </div>
          <div class="flex items-center justify-between px-5 py-3.5 min-h-[44px]">
            <span class="text-sm text-ink-400">Politique de confidentialité</span>
            <span class="text-xs text-ink-300">Bientôt</span>
          </div>
          <div class="flex items-center justify-between px-5 py-3.5 min-h-[44px]">
            <span class="text-sm text-ink-400">Mentions légales</span>
            <span class="text-xs text-ink-300">Bientôt</span>
          </div>
        </div>
      </section>

      <!-- Actions compte -->
      <div class="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
        <button
          class="w-full flex items-center justify-between px-5 py-4 min-h-[48px] border-b border-ink-100
                 text-sm font-semibold text-ink-700 transition-all active:scale-[0.98]"
          @click="seDeconnecter"
        >
          <span>Se déconnecter</span>
          <fa :icon="['fas','right-from-bracket']" class="text-ink-300 text-sm" />
        </button>
        <button
          class="w-full flex items-center justify-between px-5 py-4 min-h-[48px]
                 text-sm font-semibold text-peche-500 transition-all active:scale-[0.98]"
          @click="confirmerReinit = true"
        >
          <span>Supprimer les données</span>
          <fa :icon="['fas','trash']" class="text-peche-300 text-sm" />
        </button>
      </div>

      <!-- Dialog confirmation -->
      <Transition name="fade">
        <div
          v-if="confirmerReinit"
          class="fixed inset-0 z-[200] flex items-end justify-center px-5 pb-24 bg-black/35"
          @click.self="confirmerReinit = false"
        >
          <div
            class="w-full max-w-md rounded-3xl bg-white p-6 animate-in-scale shadow-dialog"
            role="dialog"
            aria-labelledby="dialog-reinit-titre"
          >
            <div class="w-14 h-14 rounded-2xl bg-peche-100 flex items-center justify-center mx-auto mb-4">
              <fa :icon="['fas','triangle-exclamation']" class="text-peche-500 text-xl" />
            </div>
            <h3 id="dialog-reinit-titre" class="font-display text-lg font-bold text-ink-800 text-center mb-2 tracking-tight">
              Réinitialiser les données ?
            </h3>
            <p class="text-sm text-ink-400 text-center leading-relaxed mb-6">
              Vos favoris et votre profil seront effacés. Cette action est irréversible.
            </p>
            <div class="flex gap-3">
              <button
                class="flex-1 py-3.5 rounded-2xl text-sm font-bold text-ink-600 bg-ink-50 min-h-[48px] active:scale-95 transition-all"
                @click="confirmerReinit = false"
              >Annuler</button>
              <button
                class="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-peche-500 min-h-[48px] active:scale-95 transition-all"
                @click="confirmerReinitialisation"
              >Réinitialiser</button>
            </div>
          </div>
        </div>
      </Transition>

      <p class="text-xs text-ink-400 leading-relaxed text-center px-4">
        ⚠️ SWEET MED est une application d'information. Elle ne remplace pas l'avis d'un professionnel de santé.
      </p>

    </div>
  </div>
</template>
