<script setup lang="ts">
import { useMedecineStore } from '@/stores/useMedecineStore'
const store = useMedecineStore()
</script>

<template>
  <div class="rounded-3xl p-6 relative overflow-hidden bg-citation border border-mint-200/40">
    <div
      class="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 pointer-events-none
             bg-[radial-gradient(circle,_#6ee7b7,_transparent_70%)] translate-x-[30%] -translate-y-[30%]"
      aria-hidden="true"
    />
    <p class="eyebrow mb-3 relative z-10">Sagesse du jour</p>
    <p class="font-display text-lg font-bold text-ink-800 leading-snug tracking-tight relative z-10">
      "{{ store.citationDuJour }}"
    </p>
  </div>
</template>
