<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router    = useRouter()
const authStore = useAuthStore()

type Mode = 'login' | 'register'
const mode     = ref<Mode>('login')
const email    = ref('')
const password = ref('')
const prenom   = ref('')
const showPass = ref(false)

function basculerMode(m: Mode) {
  mode.value = m
  authStore.effacerErreur()
  email.value    = ''
  password.value = ''
  prenom.value   = ''
}

async function soumettre() {
  if (mode.value === 'login') {
    const ok = await authStore.connexion({ email: email.value, password: password.value })
    if (ok) router.replace('/')
  } else {
    const ok = await authStore.inscription({ email: email.value, password: password.value, prenom: prenom.value })
    if (ok) router.replace('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">

    <!-- ══ Hero ════════════════════════════════════════════════════ -->
    <header class="px-5 pt-safe-header-lg pb-8 bg-mint-100 text-center">
      <img
        src="/icons/favicon.webp"
        alt="SWEET MED"
        class="w-20 h-20 rounded-3xl mx-auto mb-4 object-cover shadow-btn-mint"
        width="80"
        height="80"
      />
      <h1 class="font-display font-bold text-ink-800 text-2xl tracking-tight">
        SWEET MED
      </h1>
      <p class="text-ink-500 text-sm mt-1.5">Médecine douce, au quotidien</p>
    </header>

    <!-- ══ Contenu ═════════════════════════════════════════════════ -->
    <div class="flex-1 px-4 py-6 flex flex-col gap-4 max-w-md w-full mx-auto">

      <!-- Sélecteur de mode -->
      <div class="flex bg-ink-50 rounded-2xl p-1 gap-1">
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          :class="mode === 'login' ? 'bg-white text-ink-800 shadow-sm' : 'text-ink-400'"
          @click="basculerMode('login')"
        >
          Se connecter
        </button>
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          :class="mode === 'register' ? 'bg-white text-ink-800 shadow-sm' : 'text-ink-400'"
          @click="basculerMode('register')"
        >
          Créer un compte
        </button>
      </div>

      <!-- Formulaire -->
      <section class="rounded-3xl p-6 bg-white border border-ink-100 shadow-sm space-y-4">

        <!-- Prénom (inscription seulement) -->
        <Transition name="fade">
          <div v-if="mode === 'register'">
            <label class="eyebrow mb-2 block" for="auth-prenom">Prénom</label>
            <div class="relative">
              <fa :icon="['fas','user']" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 text-sm" />
              <input
                id="auth-prenom"
                v-model="prenom"
                type="text"
                placeholder="Votre prénom"
                maxlength="30"
                autocomplete="given-name"
                class="input pl-10"
                @keyup.enter="soumettre"
              />
            </div>
          </div>
        </Transition>

        <!-- Email -->
        <div>
          <label class="eyebrow mb-2 block" for="auth-email">Email</label>
          <div class="relative">
            <fa :icon="['fas','envelope']" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 text-sm" />
            <input
              id="auth-email"
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              autocomplete="email"
              class="input pl-10"
              @keyup.enter="soumettre"
            />
          </div>
        </div>

        <!-- Mot de passe -->
        <div>
          <label class="eyebrow mb-2 block" for="auth-password">Mot de passe</label>
          <div class="relative">
            <fa :icon="['fas','lock']" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 text-sm" />
            <input
              id="auth-password"
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              class="input pl-10 pr-11"
              @keyup.enter="soumettre"
            />
            <button
              type="button"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500 transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center"
              :aria-label="showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              @click="showPass = !showPass"
            >
              <fa :icon="['fas', showPass ? 'eye-slash' : 'eye']" class="text-sm" />
            </button>
          </div>
        </div>

        <!-- Erreur -->
        <Transition name="fade">
          <div
            v-if="authStore.erreur"
            class="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-peche-50 border border-peche-100"
          >
            <fa :icon="['fas','triangle-exclamation']" class="text-peche-500 text-sm flex-shrink-0" />
            <p class="text-sm text-peche-700 leading-snug">{{ authStore.erreur }}</p>
          </div>
        </Transition>
      </section>

      <!-- Bouton soumettre -->
      <button
        class="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm text-white
               bg-mint-500 transition-all duration-200 active:scale-[0.97] min-h-[52px] shadow-btn-mint
               disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="authStore.chargement"
        @click="soumettre"
      >
        <fa v-if="authStore.chargement" :icon="['fas','bolt']" class="animate-pulse" />
        <fa v-else-if="mode === 'login'" :icon="['fas','right-from-bracket']" />
        <fa v-else :icon="['fas','circle-check']" />
        {{ authStore.chargement ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte' }}
      </button>

      <!-- Disclaimer -->
      <p class="text-center text-xs text-ink-400 leading-relaxed px-4">
        SWEET MED est une application d'information sur la médecine douce.<br>
        Elle ne remplace pas l'avis d'un professionnel de santé.
      </p>
    </div>
  </div>
</template>
