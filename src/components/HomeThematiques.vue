<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import CatIcon from '@/components/CatIcon.vue'

const router = useRouter()
const store  = useMedecineStore()

const cats4 = computed(() => store.categories.slice(0, 4))
const catCount = (id: string) => store.remedes.filter(r => r.categorieId === id).length

function voirCat(id: string) {
  store.setCategorie(id as Parameters<typeof store.setCategorie>[0])
  router.push('/explorer')
}
</script>

<template>
  <section aria-labelledby="h-cats">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="eyebrow mb-1">Parcourir</p>
        <h2 id="h-cats" class="section-title">Thématiques</h2>
      </div>
      <button
        class="flex items-center gap-1.5 text-xs font-bold text-mint-600 bg-mint-50 px-3 py-2
               rounded-full min-h-[44px] active:scale-95 transition-all"
        @click="router.push('/explorer')"
      >
        Tout voir <fa :icon="['fas','arrow-right']" class="text-[11px]" />
      </button>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="(cat, i) in cats4" :key="cat.id"
        class="relative overflow-hidden rounded-3xl flex flex-col justify-end min-h-[130px]
               text-left transition-all duration-200 active:scale-[0.96] shadow-cat animate-in"
        :style="{ animationDelay: `${i * 60}ms` }"
        :class="cat.image ? 'bg-ink-200' : cat.couleur"
        @click="voirCat(cat.id)"
      >
        <!-- Photo cover -->
        <img
          v-if="cat.image"
          :src="cat.image"
          :alt="cat.nom"
          class="absolute inset-0 w-full h-full object-cover"
        />

        <!-- Icône/emoji si pas d'image -->
        <div v-else class="absolute inset-0 flex items-start justify-end p-4" aria-hidden="true">
          <CatIcon :categorie="cat" size="lg" />
        </div>

        <!-- Overlay gradient bas -->
        <div
          :class="cat.image
            ? 'absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none'
            : 'absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-20 pointer-events-none bg-current'"
          aria-hidden="true"
        />

        <!-- Texte -->
        <div class="relative z-10 p-4">
          <p
            class="font-bold text-sm leading-snug"
            :class="[cat.image ? 'text-white text-shadow' : cat.couleurTexte]"
          >{{ cat.nom }}</p>
          <p
            class="text-[11px] mt-0.5 font-medium"
            :class="cat.image ? 'text-white/70 text-shadow' : `${cat.couleurTexte} opacity-60`"
          >{{ catCount(cat.id) }} fiches</p>
        </div>
      </button>
    </div>
  </section>
</template>
