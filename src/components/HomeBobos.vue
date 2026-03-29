<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'

const router = useRouter()
const store  = useMedecineStore()

// Remèdes de la catégorie premiers-secours, dans l'ordre d'insertion
const bobos = computed(() =>
  store.remedes.filter(r => r.categorieId === 'premiers-secours')
)

// Emoji par ID pour l'affichage visuel des chips
const emojiMap: Record<string, string> = {
  'secours-piqure-insecte': '🦟',
  'secours-coupure-petite': '🩹',
  'secours-brulure-legere': '🔥',
  'secours-mal-de-tete':    '🤕',
  'secours-nausee':          '🤢',
  'secours-hematome':        '🫐',
  'secours-gorge-irritee':   '🤒',
  'secours-crampe':          '⚡',
}
</script>

<template>
  <!-- ── Bobos du quotidien ─────────────────────────────────── -->
  <section aria-labelledby="h-bobos">

    <!-- En-tête -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="eyebrow mb-1">Remèdes de grand-mère</p>
        <h2 id="h-bobos" class="section-title">Bobos du quotidien</h2>
      </div>
      <button
        class="flex items-center gap-1.5 text-xs font-bold text-peche-600 bg-peche-50 px-3 py-2
               rounded-full min-h-[44px] active:scale-95 transition-all"
        @click="router.push('/explorer')"
      >
        Tout voir <fa :icon="['fas','arrow-right']" class="text-[11px]" />
      </button>
    </div>

    <!-- Chips scrollables horizontalement -->
    <div class="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
      <button
        v-for="bobo in bobos"
        :key="bobo.id"
        class="shrink-0 snap-start flex flex-col items-center gap-1.5 w-[76px]
               active:scale-95 transition-transform duration-150"
        :aria-label="bobo.titre"
        @click="router.push(`/remede/${bobo.id}`)"
      >
        <!-- Bulle emoji -->
        <span class="w-14 h-14 flex items-center justify-center rounded-2xl text-2xl
                     bg-peche-50 shadow-card">
          {{ emojiMap[bobo.id] ?? '🩹' }}
        </span>
        <!-- Label -->
        <span class="text-[10px] font-semibold text-ink-600 text-center leading-tight
                     line-clamp-2 w-full">
          {{ bobo.titre }}
        </span>
      </button>
    </div>

  </section>
</template>
