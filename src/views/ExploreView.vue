<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import SearchBar from '@/components/SearchBar.vue'
import RemèdeCard from '@/components/RemèdeCard.vue'
import type { Remede, CategorieId } from '@/types'

const router = useRouter()
const store  = useMedecineStore()

const resultats = computed(() => store.remedesFiltres)

const termeRecherche = computed({
  get: () => store.termeRecherche,
  set: (v: string) => store.setRecherche(v),
})

const categorieActive = computed(() => store.categorieActive)
const categories      = computed(() => store.categories)

const texteResultat = computed(() => {
  const n = resultats.value.total
  return store.termeRecherche || categorieActive.value
    ? `${n} résultat${n > 1 ? 's' : ''}`
    : `${n} remèdes`
})

function voirRemede(r: Remede)            { router.push(`/remede/${r.id}`) }
function toggleCategorie(id: CategorieId) { store.setCategorie(id) }
function reinitialiser()                  { store.effacerRecherche(); store.setCategorie(null) }
</script>

<template>
  <div class="min-h-screen bg-white">

    <!-- ══ En-tête sticky ══════════════════════════════════════════ -->
    <header
      class="sticky top-0 z-40 px-5 pb-3 bg-white border-b border-ink-100 pt-safe-header-md"
    >
      <!-- Titre -->
      <div class="flex items-center gap-3 mb-3">
        <fa :icon="['fas','compass']" class="text-ink-800 text-4xl shrink-0" />
        <div>
          <p class="eyebrow mb-0">Catalogue</p>
          <h1 class="font-display text-2xl font-bold text-ink-800 leading-tight tracking-tight">Explorer</h1>
        </div>
      </div>

      <!-- Barre de recherche -->
      <SearchBar v-model="termeRecherche" />

      <!-- Filtres catégories — toujours visibles -->
      <div class="mt-3 flex gap-2 overflow-x-auto scroll-hide pb-1 -mx-4 px-4">
        <button class="chip shrink-0" :class="!categorieActive ? 'chip-on' : 'chip-off'" @click="reinitialiser">
          Tous
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="chip shrink-0"
          :class="categorieActive === cat.id ? 'chip-on' : 'chip-off'"
          @click="toggleCategorie(cat.id)"
        >
          {{ cat.emoji }} {{ cat.nom }}
        </button>
      </div>
    </header>

    <!-- ══ Contenu ══════════════════════════════════════════════════ -->
    <div class="px-5 pt-4 pb-4">

      <!-- Meta ligne -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-xs font-semibold text-ink-400">{{ texteResultat }}</p>
        <button
          v-if="termeRecherche || categorieActive"
          class="flex items-center gap-1 text-xs font-bold text-peche-500 min-h-[44px] active:opacity-60"
          @click="reinitialiser"
        >
          <fa :icon="['fas','xmark']" class="text-xs" /> Réinitialiser
        </button>
      </div>

      <!-- État vide -->
      <div
        v-if="resultats.total === 0"
        class="flex flex-col items-center justify-center py-20 gap-4 text-center animate-in"
        role="status"
        aria-live="polite"
      >
        <div class="w-20 h-20 rounded-3xl bg-ink-50 flex items-center justify-center">
          <fa :icon="['fas','magnifying-glass']" class="text-3xl text-ink-200" />
        </div>
        <div>
          <p class="font-bold text-ink-700 mb-1">Aucun résultat</p>
          <p class="text-sm text-ink-400 leading-relaxed">
            Essayez d'autres mots-clés ou
            <button class="text-mint-600 font-bold underline" @click="reinitialiser">réinitialisez</button>
          </p>
        </div>
      </div>

      <!-- Grille de résultats -->
      <div v-else class="grid grid-cols-2 gap-3" role="list">
        <div
          v-for="(remede, idx) in resultats.remedes"
          :key="remede.id"
          role="listitem"
          class="animate-in"
          :style="{ animationDelay: `${Math.min(idx * 45, 400)}ms` }"
        >
          <RemèdeCard :remede="remede" @click="voirRemede" />
        </div>
      </div>
    </div>
  </div>
</template>
