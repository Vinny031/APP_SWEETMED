<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import { useAuthStore } from '@/stores/useAuthStore'

const router    = useRouter()
const store     = useMedecineStore()
const authStore = useAuthStore()

const salut = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'
})
const prenom  = computed(() => store.profil?.prenom || null)
const dateStr = computed(() =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
)
</script>

<template>
  <header class="px-5 pb-6 bg-white border-b border-ink-100 pt-safe-header-md">

    <!-- Top bar -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2.5">
        <div class="w-12 h-12 rounded-2xl overflow-hidden shrink-0">
          <img src="/icons/favicon.webp" alt="SWEET MED" class="w-full h-full object-cover" />
        </div>
        <span class="font-display font-bold text-ink-800 text-base tracking-tight">SWEET MED</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="authStore.estAdmin"
          class="w-10 h-10 flex items-center justify-center rounded-2xl bg-ink-50 transition-all active:scale-90"
          aria-label="Administration"
          @click="router.push('/admin')"
        >
          <fa :icon="['fas','gear']" class="text-ink-400 text-sm" />
        </button>
        <button
          class="w-10 h-10 flex items-center justify-center rounded-2xl bg-ink-50 transition-all active:scale-90"
          aria-label="Profil"
          @click="router.push('/profil')"
        >
          <fa :icon="['fas','bell']" class="text-ink-400 text-sm" />
        </button>
      </div>
    </div>

    <!-- Salutation -->
    <div class="mb-5">
      <p class="text-ink-400 text-[11px] font-semibold uppercase tracking-widest mb-1.5">{{ dateStr }}</p>
      <h1 class="font-display text-3xl font-bold text-ink-800 leading-tight tracking-tight">
        {{ salut }}<template v-if="prenom">, {{ prenom }}</template> 👋
      </h1>
      <p class="text-ink-500 text-sm mt-1">Prenez soin de vous aujourd'hui.</p>
    </div>

    <!-- Citation du jour -->
    <div class="rounded-2xl bg-ink-50 px-4 py-3.5 border border-ink-100">
      <p class="eyebrow mb-1">Sagesse du jour</p>
      <p class="text-sm font-semibold text-ink-700 leading-relaxed">"{{ store.citationDuJour }}"</p>
    </div>

    <!-- Banner onboarding -->
    <div
      v-if="!prenom"
      class="flex items-center gap-3 px-4 py-3.5 rounded-2xl mt-3 bg-ink-50 border border-ink-100"
    >
      <p class="text-sm text-ink-600 flex-1 min-w-0">Personnalisez votre profil pour une expérience sur mesure.</p>
      <button
        class="shrink-0 text-xs font-bold text-mint-600 bg-white px-3 py-1.5 rounded-xl
               border border-ink-100 active:scale-95 transition-all min-h-[44px]"
        @click="router.push('/profil')"
      >
        Mon profil →
      </button>
    </div>

  </header>
</template>
