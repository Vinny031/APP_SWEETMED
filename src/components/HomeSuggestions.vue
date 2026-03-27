<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import SuggestionCard from '@/components/SuggestionCard.vue'
import type { SuggestionDuJour } from '@/types'

const router = useRouter()
const store  = useMedecineStore()

function voir(s: SuggestionDuJour) { router.push(`/remede/${s.remedeId}`) }
</script>

<template>
  <section aria-labelledby="h-suggestions">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="eyebrow mb-1">Pour vous aujourd'hui</p>
        <h2 id="h-suggestions" class="section-title">Suggestions ✨</h2>
      </div>
    </div>
    <div class="flex gap-3.5 overflow-x-auto scroll-snap-x scroll-hide py-2">
      <SuggestionCard
        v-for="s in store.suggestionsEnrichies" :key="s.id"
        :suggestion="s" :remede="s.remede"
        @click="voir(s)"
      />
    </div>
  </section>
</template>
