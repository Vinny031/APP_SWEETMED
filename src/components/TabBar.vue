<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'

const route  = useRoute()
const router = useRouter()
const store  = useMedecineStore()

const tabs = [
  { id: 'home',    label: 'Accueil',  icon: ['fas','house'],   route: '/'         },
  { id: 'explore', label: 'Explorer', icon: ['fas','compass'], route: '/explorer' },
  { id: 'favoris', label: 'Favoris',  icon: ['fas','heart'],   route: '/favoris'  },
  { id: 'profil',  label: 'Profil',   icon: ['fas','user'],    route: '/profil'   },
] as const

const isActive = computed(() => (r: string) =>
  r === '/' ? route.path === '/' : route.path.startsWith(r)
)
const nbFav = computed(() => store.nombreFavoris)

function go(r: string) { if (route.path !== r) router.push(r) }
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-5 pb-[calc(1rem+env(safe-area-inset-bottom))]"
    role="navigation"
    aria-label="Navigation principale"
  >
    <div
      class="w-full max-w-md flex items-center justify-around px-3 py-2.5 rounded-[2rem] bg-white shadow-tab"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="relative flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[52px] px-3
               rounded-[1.5rem] transition-all duration-200 active:scale-[0.88] select-none"
        :aria-label="tab.label"
        :aria-current="isActive(tab.route) ? 'page' : undefined"
        @click="go(tab.route)"
      >
        <!-- Pill active -->
        <span
          v-if="isActive(tab.route)"
          class="absolute inset-0 rounded-[1.5rem] bg-mint-500"
          aria-hidden="true"
        />

        <!-- Icône + badge -->
        <span class="relative z-10">
          <fa
            :icon="tab.icon"
            class="transition-all duration-200"
            :class="[
              isActive(tab.route) ? 'text-white text-[1.05rem]' : 'text-ink-400 text-[0.95rem]',
            ]"
          />
          <!-- Badge favoris -->
          <span
            v-if="tab.id === 'favoris' && nbFav > 0"
            class="absolute -top-2 -right-2 min-w-[16px] h-4 flex items-center justify-center
                   rounded-full px-1 text-[11px] font-bold text-white leading-none bg-peche-500"
            aria-hidden="true"
          >{{ nbFav > 9 ? '9+' : nbFav }}</span>
        </span>

        <!-- Label -->
        <span
          class="relative z-10 text-[11px] font-semibold leading-none transition-colors duration-200"
          :class="isActive(tab.route) ? 'text-white' : 'text-ink-400'"
        >{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>
