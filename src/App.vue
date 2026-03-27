<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import { useMedecineStore } from '@/stores/useMedecineStore'

const route = useRoute()
const store = useMedecineStore()

// Contrôlé par la méta `showTabBar` définie dans router/index.ts
const afficherTabBar = computed(() => route.meta.showTabBar === true)

// Chargement initial des remèdes (mock + custom fusionnés)
onMounted(() => { store.initialiser() })
</script>

<template>
  <div id="app" class="relative min-h-svh bg-white font-sans antialiased">
    <main
      class="w-full max-w-md mx-auto"
      :class="afficherTabBar ? 'pb-[calc(5.5rem+env(safe-area-inset-bottom))]' : ''"
    >
      <router-view />
    </main>
    <TabBar v-if="afficherTabBar" />
  </div>
</template>
