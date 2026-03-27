<script setup lang="ts">
import { computed } from 'vue'
import { useMedecineStore } from '@/stores/useMedecineStore'
import CatIcon from '@/components/CatIcon.vue'
import type { Remede } from '@/types'

const props = defineProps<{ remede: Remede }>()
const emit  = defineEmits<{ (e: 'click', r: Remede): void }>()

const store    = useMedecineStore()
const categorie = computed(() => store.getCategorieById(props.remede.categorieId))
const isFavori  = computed(() => store.estFavori(props.remede.id))

function handleFavori(e: Event) {
  e.stopPropagation()
  store.toggleFavori(props.remede.id)
}
</script>

<template>
  <article
    class="flex items-stretch rounded-2xl bg-white shadow-card overflow-hidden
           transition-all duration-200 active:scale-[0.98] cursor-pointer"
    role="button"
    :aria-label="remede.titre"
    @click="emit('click', remede)"
  >
    <!-- Image tiers gauche -->
    <div
      class="relative w-1/3 shrink-0 flex items-center justify-center"
      :class="categorie?.image ? 'bg-ink-100' : (categorie?.couleur ?? 'bg-mint-50')"
    >
      <img
        v-if="categorie?.image"
        :src="categorie.image"
        :alt="categorie.nom"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <CatIcon v-else :categorie="categorie" size="md" />

      <span
        class="absolute bottom-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm"
        :class="categorie?.couleurTexte"
      >{{ categorie?.nom }}</span>
    </div>

    <!-- Corps -->
    <div class="flex-1 min-w-0 flex items-center justify-between gap-2 px-3 py-3">
      <div class="min-w-0">
        <p class="font-bold text-sm text-ink-800 leading-snug line-clamp-2 mb-1">{{ remede.titre }}</p>
        <span v-if="remede.duree" class="text-[10px] text-ink-300 flex items-center gap-1">
          <fa :icon="['fas','clock']" class="text-[9px]" />
          {{ remede.duree }}
        </span>
      </div>

      <button
        class="w-8 h-8 shrink-0 flex items-center justify-center rounded-xl transition-all active:scale-90"
        :class="isFavori ? 'bg-peche-50' : 'bg-ink-50'"
        :aria-label="isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        @click="handleFavori"
      >
        <fa :icon="['fas','heart']" :class="isFavori ? 'text-peche-500' : 'text-ink-200'" class="text-xs" />
      </button>
    </div>
  </article>
</template>
