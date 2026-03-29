<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'

const router = useRouter()
const store  = useMedecineStore()

function voirTout() {
  store.setCategorie('premiers-secours')
  router.push('/explorer')
}

// 4 remèdes en échantillon — le reste est accessible via "Tout voir"
const bobos = computed(() =>
  store.remedes.filter(r => r.categorieId === 'premiers-secours').slice(0, 4)
)
</script>

<template>
  <!-- ── Bobologie ──────────────────────────────────────────── -->
  <section aria-labelledby="h-bobos">

    <!-- En-tête -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="eyebrow mb-1">Premiers secours</p>
        <h2 id="h-bobos" class="section-title">Bobologie</h2>
      </div>
      <button
        class="flex items-center gap-1.5 text-xs font-bold text-peche-600 bg-peche-50 px-3 py-2
               rounded-full min-h-[44px] active:scale-95 transition-all"
        @click="voirTout"
      >
        Tout voir <fa :icon="['fas','arrow-right']" class="text-[11px]" />
      </button>
    </div>

    <!-- Pills texte scrollables -->
    <div class="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
      <button
        v-for="bobo in bobos"
        :key="bobo.id"
        class="shrink-0 bg-white border border-ink-100 rounded-full px-4 py-2
               text-sm font-semibold text-ink-700 whitespace-nowrap
               active:scale-95 active:bg-peche-50 transition-all duration-150"
        @click="router.push(`/remede/${bobo.id}`)"
      >
        {{ bobo.titre }}
      </button>
    </div>

  </section>
</template>
