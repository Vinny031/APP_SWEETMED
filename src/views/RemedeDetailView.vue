<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import CatIcon from '@/components/CatIcon.vue'

interface Props { id: string }
const props  = defineProps<Props>()
const router = useRouter()
const store  = useMedecineStore()

const remede    = computed(() => store.getRemede(props.id))
const categorie = computed(() => remede.value ? store.getCategorieById(remede.value.categorieId) : undefined)
const isFavori  = computed(() => remede.value ? store.estFavori(remede.value.id) : false)

function retour() {
  const hasPrev = window.history.state?.back != null
  if (hasPrev) { router.back() } else { router.replace('/') }
}
function toggleFavori() { if (remede.value) store.toggleFavori(remede.value.id) }
</script>

<template>
  <!-- Remède introuvable -->
  <div v-if="!remede" class="flex flex-col items-center justify-center min-h-screen p-8 text-center gap-4">
    <span class="text-6xl">🌿</span>
    <p class="font-display text-xl font-bold text-ink-800 tracking-tight">Remède introuvable</p>
    <button class="btn-ghost mt-2" @click="retour">Retour</button>
  </div>

  <!-- ══ Fiche détail ══════════════════════════════════════════ -->
  <div v-else class="min-h-screen bg-white">

    <!-- ── Hero image ──────────────────────────────────────── -->
    <div class="relative h-72 overflow-hidden"
      :class="categorie?.image ? 'bg-ink-200' : (categorie?.couleur ?? 'bg-mint-50')"
    >
      <!-- Photo cover -->
      <img
        v-if="categorie?.image"
        :src="categorie.image"
        :alt="categorie?.nom"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- Icône/emoji si pas d'image -->
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <CatIcon :categorie="categorie" size="xl" class="animate-float text-6xl" />
      </div>

      <!-- Overlay gradient bas -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <!-- Barre nav en overlay -->
      <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-safe-header-sm pb-2 z-10">
        <button
          class="w-11 h-11 flex items-center justify-center rounded-2xl bg-black/25 backdrop-blur-sm transition-all active:scale-90"
          aria-label="Retour"
          @click="retour"
        >
          <fa :icon="['fas','chevron-left']" class="text-white text-sm" />
        </button>
        <button
          class="w-11 h-11 flex items-center justify-center rounded-2xl backdrop-blur-sm transition-all active:scale-90"
          :class="isFavori ? 'bg-peche-500' : 'bg-black/25'"
          :aria-label="isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          :aria-pressed="isFavori"
          @click="toggleFavori"
        >
          <fa :icon="['fas','heart']" class="text-white transition-all duration-200 text-base" />
        </button>
      </div>

      <!-- Badges catégorie + durée en overlay bas-gauche -->
      <div class="absolute bottom-9 left-4 z-10 flex items-center gap-2">
        <span
          class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm"
          :class="categorie?.couleurTexte"
        >{{ categorie?.nom }}</span>
        <span v-if="remede.duree" class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-ink-500 flex items-center gap-1">
          <fa :icon="['fas','clock']" class="text-[10px]" />
          {{ remede.duree }}
        </span>
      </div>
    </div>

    <!-- ── Carte blanche qui remonte sur l'image ──── -->
    <div class="relative z-10 -mt-5 bg-white px-5 pt-5 pb-2">
      <h1 class="font-display text-2xl font-bold text-ink-800 leading-tight tracking-tight">
        {{ remede.titre }}
      </h1>
    </div>

    <!-- ── Corps de la fiche ─────────────────────────────── -->
    <div class="px-5 pt-3 pb-8 space-y-4 bg-white">

      <!-- Description -->
      <p class="text-sm text-ink-500 leading-relaxed">{{ remede.description }}</p>

      <!-- Bienfaits -->
      <section class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm" aria-labelledby="titre-benefices">
        <h2 id="titre-benefices" class="font-bold text-ink-800 mb-3 flex items-center gap-2 text-sm">
          <div class="w-7 h-7 rounded-xl bg-mint-50 flex items-center justify-center">
            <fa :icon="['fas','circle-check']" class="text-mint-600 text-xs" />
          </div>
          Bienfaits
        </h2>
        <ul class="space-y-2">
          <li v-for="b in remede.benefices" :key="b" class="flex items-start gap-2.5 text-sm text-ink-600 leading-relaxed">
            <span class="w-1.5 h-1.5 rounded-full bg-mint-400 shrink-0 mt-1.5" aria-hidden="true" />
            {{ b }}
          </li>
        </ul>
      </section>

      <!-- Ingrédients -->
      <section v-if="remede.ingredients?.length" class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm" aria-labelledby="titre-ingredients">
        <h2 id="titre-ingredients" class="font-bold text-ink-800 mb-3 flex items-center gap-2 text-sm">
          <div class="w-7 h-7 rounded-xl bg-soleil-50 flex items-center justify-center">
            <span class="text-sm">🧴</span>
          </div>
          Ingrédients
        </h2>
        <ul class="space-y-2">
          <li v-for="ing in remede.ingredients" :key="ing" class="flex items-center gap-3 py-2 px-3 rounded-xl text-sm text-ink-700 bg-ink-50">
            <span class="w-1.5 h-1.5 rounded-full bg-soleil-400 shrink-0" aria-hidden="true" />
            {{ ing }}
          </li>
        </ul>
      </section>

      <!-- Étapes -->
      <section v-if="remede.etapes?.length" class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm" aria-labelledby="titre-etapes">
        <h2 id="titre-etapes" class="font-bold text-ink-800 mb-4 flex items-center gap-2 text-sm">
          <div class="w-7 h-7 rounded-xl bg-lavande-100 flex items-center justify-center">
            <fa :icon="['fas','list-ol']" class="text-lavande-500 text-xs" />
          </div>
          Étapes
        </h2>
        <ol class="space-y-4">
          <li v-for="(etape, idx) in remede.etapes" :key="idx" class="flex items-start gap-3">
            <span
              class="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-mint-500"
              aria-hidden="true"
            >
              {{ idx + 1 }}
            </span>
            <p class="text-sm text-ink-600 leading-relaxed pt-0.5">{{ etape }}</p>
          </li>
        </ol>
      </section>

      <!-- Précautions -->
      <section v-if="remede.precautions?.length" class="rounded-3xl p-5 bg-peche-50 border border-peche-100" aria-labelledby="titre-precautions">
        <h2 id="titre-precautions" class="font-bold text-peche-700 mb-3 flex items-center gap-2 text-sm">
          <fa :icon="['fas','triangle-exclamation']" class="text-peche-500" />
          Précautions
        </h2>
        <ul class="space-y-2">
          <li v-for="p in remede.precautions" :key="p" class="text-xs text-peche-600 flex items-start gap-2 leading-relaxed">
            <fa :icon="['fas','bolt']" class="text-[11px] text-peche-400 shrink-0 mt-0.5" />
            {{ p }}
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>
