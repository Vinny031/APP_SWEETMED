<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import HomeHero        from '@/components/HomeHero.vue'
import HomeSuggestions from '@/components/HomeSuggestions.vue'
import HomeThematiques from '@/components/HomeThematiques.vue'
import RemèdeCard      from '@/components/RemèdeCard.vue'
import type { Remede } from '@/types'

const router  = useRouter()
const store   = useMedecineStore()
const remedes6 = computed(() => store.remedes.slice(0, 6))

function voirRemede(r: Remede) { router.push(`/remede/${r.id}`) }
</script>

<template>
  <div class="min-h-screen bg-ink-50">

    <HomeHero />

    <div class="px-5 pt-6 space-y-9 pb-6">

      <HomeSuggestions />

      <HomeThematiques />

      <!-- ── À découvrir ───────────────────────────────────────── -->
      <section aria-labelledby="h-discover">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="eyebrow mb-1">Catalogue</p>
            <h2 id="h-discover" class="section-title">À découvrir</h2>
          </div>
          <button
            class="flex items-center gap-1.5 text-xs font-bold text-mint-600 bg-mint-50 px-3 py-2
                   rounded-full min-h-[44px] active:scale-95 transition-all"
            @click="router.push('/explorer')"
          >
            Tout voir <fa :icon="['fas','arrow-right']" class="text-[11px]" />
          </button>
        </div>
        <div class="space-y-3">
          <RemèdeCard
            v-for="(r, i) in remedes6" :key="r.id"
            :remede="r" compact
            class="animate-in" :style="{ animationDelay: `${i * 45}ms` }"
            @click="voirRemede"
          />
        </div>
      </section>

    </div>
  </div>
</template>
