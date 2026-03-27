<script setup lang="ts">
import { computed } from 'vue'
import { useMedecineStore } from '@/stores/useMedecineStore'
import CatIcon from '@/components/CatIcon.vue'
import type { Remede } from '@/types'

const props = defineProps<{ remede: Remede }>()
const emit  = defineEmits<{ (e: 'click', r: Remede): void }>()

const store     = useMedecineStore()
const categorie = computed(() => store.getCategorieById(props.remede.categorieId))
const isFavori  = computed(() => store.estFavori(props.remede.id))

function handleFavori(e: Event) {
  e.stopPropagation()
  store.toggleFavori(props.remede.id)
}
</script>

<template>
  <article
    class="flex flex-col rounded-3xl overflow-hidden bg-white border border-ink-100
           transition-all duration-300 active:scale-[0.97] cursor-pointer
           shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    role="button"
    :aria-label="remede.titre"
    @click="emit('click', remede)"
  >
    <!-- En-tête : photo cover ou fond pastel -->
    <div
      class="relative h-36 overflow-hidden"
      :class="categorie?.image ? 'bg-ink-100' : (categorie?.couleur ?? 'bg-mint-50')"
    >
      <img
        v-if="categorie?.image"
        :src="categorie.image"
        :alt="categorie.nom"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <CatIcon :categorie="categorie" size="xl" class="animate-float" />
      </div>

      <div
        v-if="categorie?.image"
        class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <span
        class="absolute bottom-2.5 left-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-bold
               bg-white/80 backdrop-blur-sm"
        :class="categorie?.couleurTexte"
      >{{ categorie?.nom }}</span>

      <button
        class="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-xl
               transition-all active:scale-90"
        :class="categorie?.image ? 'bg-black/25 backdrop-blur-sm' : 'bg-white/70'"
        :aria-label="isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        :aria-pressed="isFavori"
        @click="handleFavori"
      >
        <fa
          :icon="['fas','heart']"
          :class="isFavori ? 'text-peche-500' : (categorie?.image ? 'text-white/70' : 'text-ink-300')"
          class="text-sm"
        />
      </button>
    </div>

    <!-- Corps -->
    <div class="p-3.5 flex flex-col gap-1.5 flex-1">
      <h3 class="font-display font-bold text-sm text-ink-800 leading-snug line-clamp-2 tracking-tight">{{ remede.titre }}</h3>
      <p class="text-xs text-ink-400 line-clamp-2 leading-relaxed flex-1">{{ remede.description }}</p>

      <div v-if="remede.duree" class="flex items-center gap-1 mt-1 pt-2 border-t border-ink-100">
        <fa :icon="['fas','clock']" class="text-[11px] text-ink-300" />
        <span class="text-[11px] text-ink-400 font-medium">{{ remede.duree }}</span>
      </div>
    </div>
  </article>
</template>
