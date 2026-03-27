<script setup lang="ts">
import { computed } from 'vue'
import CatIcon from '@/components/CatIcon.vue'
import { useMedecineStore } from '@/stores/useMedecineStore'
import type { SuggestionDuJour, Remede } from '@/types'

const store = useMedecineStore()

interface Props {
  suggestion: SuggestionDuJour
  remede?:    Remede
}

const props = defineProps<Props>()
const emit  = defineEmits<{ (e: 'click', s: SuggestionDuJour): void }>()

const categorie = computed(() =>
  props.remede ? store.getCategorieById(props.remede.categorieId) : undefined
)
</script>

<template>
  <button
    class="snap-start shrink-0 w-56 rounded-3xl overflow-hidden flex flex-col text-left
           transition-all duration-200 active:scale-[0.96] shadow-suggestion bg-white"
    :aria-label="suggestion.titre"
    @click="emit('click', suggestion)"
  >
    <!-- Image 3/4 de la card -->
    <div class="relative w-full h-36 shrink-0 overflow-hidden">
      <img
        v-if="categorie?.image"
        :src="categorie.image"
        :alt="categorie.nom"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        :class="categorie?.couleur ?? 'bg-mint-50'"
      >
        <CatIcon :categorie="categorie" size="xl" />
      </div>

      <!-- Badges en overlay bas -->
      <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
        <span
          v-if="categorie"
          class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm"
          :class="categorie.couleurTexte"
        >{{ categorie.nom }}</span>
        <span v-else />
        <div
          v-if="suggestion.heure"
          class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-sm"
        >
          <fa :icon="['fas','clock']" class="text-[11px] text-white/80" />
          <span class="text-xs text-white font-bold">{{ suggestion.heure }}</span>
        </div>
      </div>
    </div>

    <!-- Partie texte fond blanc -->
    <div class="flex flex-col gap-1.5 p-3.5 flex-1">
      <h3 class="font-display font-bold text-sm text-ink-800 leading-snug tracking-tight line-clamp-2">
        {{ suggestion.titre }}
      </h3>
      <p class="text-xs text-ink-400 leading-relaxed line-clamp-2 flex-1">
        {{ suggestion.message }}
      </p>
      <div class="flex items-center gap-1.5 mt-1">
        <span class="text-xs font-bold text-ink-700">Découvrir</span>
        <div class="w-5 h-5 rounded-full flex items-center justify-center bg-ink-100">
          <fa :icon="['fas','arrow-right']" class="text-[10px] text-ink-500" />
        </div>
      </div>
    </div>
  </button>
</template>
