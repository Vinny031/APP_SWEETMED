<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import RemèdeCard from '@/components/RemèdeCard.vue'
import type { Remede } from '@/types'

const router = useRouter()
const store  = useMedecineStore()

const confirmerSuppression = ref<string | null>(null)

const remedesFavoris = computed(() => store.remedesFavoris)
const nombreFavoris  = computed(() => store.nombreFavoris)

function voirRemede(r: Remede)           { router.push(`/remede/${r.id}`) }
function demanderSuppression(id: string) { confirmerSuppression.value = id }
function confirmerRetrait(id: string)    { store.toggleFavori(id); confirmerSuppression.value = null }
function annulerSuppression()            { confirmerSuppression.value = null }
function voirExplorer()                  { router.push('/explorer') }
</script>

<template>
  <div class="min-h-screen bg-white">

    <!-- ══ En-tête ══════════════════════════════════════════════ -->
    <header class="px-5 pb-5 bg-white border-b border-ink-100 pt-safe-header-md">
      <div class="flex items-center gap-3">
        <fa :icon="['fas','heart']" class="text-ink-800 text-4xl shrink-0" />
        <div>
          <p class="eyebrow mb-0">Collection</p>
          <h1 class="font-display text-2xl font-bold text-ink-800 leading-tight tracking-tight">Mes Favoris</h1>
        </div>
      </div>
    </header>

    <!-- ══ Contenu ══════════════════════════════════════════════ -->
    <div class="px-5 pt-4 pb-4">

      <!-- État vide -->
      <div
        v-if="nombreFavoris === 0"
        class="flex flex-col gap-4 animate-in pt-4"
        role="status"
        aria-live="polite"
      >
        <!-- Card vide -->
        <div class="rounded-2xl bg-white border border-ink-100 shadow-card p-8 flex flex-col items-center gap-3 text-center">
          <fa :icon="['fas','heart']" class="text-4xl text-ink-100" />
          <div>
            <p class="font-display font-bold text-ink-800 tracking-tight mb-1">Aucun favori</p>
            <p class="text-sm text-ink-400 leading-relaxed">Appuyez sur le ♥ d'un remède pour le retrouver ici.</p>
          </div>
        </div>

        <!-- CTA -->
        <button class="btn-primary" @click="voirExplorer">
          <fa :icon="['fas','compass']" />
          Explorer les remèdes
        </button>
      </div>

      <!-- Liste des favoris -->
      <div v-else class="space-y-2.5" role="list" aria-label="Mes remèdes favoris">
        <div
          v-for="(remede, idx) in remedesFavoris"
          :key="remede.id"
          class="relative animate-in"
          :style="{ animationDelay: `${idx * 55}ms` }"
          role="listitem"
        >
          <RemèdeCard :remede="remede" compact @click="voirRemede" />

          <!-- Overlay confirmation suppression -->
          <Transition name="fade">
            <div
              v-if="confirmerSuppression === remede.id"
              class="absolute inset-0 rounded-2xl flex items-center justify-center gap-3 p-4
                     bg-white border border-black/[0.08] shadow-overlay"
              role="dialog"
              :aria-label="`Supprimer ${remede.titre} des favoris ?`"
            >
              <p class="text-sm text-ink-700 font-semibold flex-1">Retirer ce favori ?</p>
              <button
                class="px-3.5 py-2.5 rounded-xl text-sm font-bold text-ink-500 min-h-[44px]
                       active:scale-95 transition-all bg-ink-50"
                @click="annulerSuppression"
              >Annuler</button>
              <button
                class="px-3.5 py-2.5 rounded-xl text-sm font-bold text-white min-h-[44px]
                       active:scale-95 transition-all bg-peche-500"
                @click="confirmerRetrait(remede.id)"
              >Retirer</button>
            </div>
          </Transition>

          <!-- Bouton suppression rapide -->
          <button
            v-if="confirmerSuppression !== remede.id"
            class="absolute top-1.5 right-1.5 w-11 h-11 flex items-center justify-center
                   rounded-xl transition-all active:scale-90 bg-peche-50 text-peche-400"
            :aria-label="`Retirer ${remede.titre}`"
            @click="demanderSuppression(remede.id)"
          >
            <fa :icon="['fas','trash']" class="text-xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
