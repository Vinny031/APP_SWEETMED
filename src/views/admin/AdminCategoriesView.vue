<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import { categorieService } from '@/services/categorieService'
import type { Categorie } from '@/types'

const router = useRouter()
const store  = useMedecineStore()

const categories            = computed(() => store.categories)
const confirmerSuppression  = ref<string | null>(null)
const erreurSupp            = ref<string | null>(null)
const recherche             = ref('')

const categoriesFiltrees = computed(() => {
  const terme = recherche.value.toLowerCase().trim()
  if (!terme) return categories.value
  return categories.value.filter(c =>
    c.nom.toLowerCase().includes(terme) ||
    c.description.toLowerCase().includes(terme)
  )
})

function editer(cat: Categorie) {
  router.push(`/admin/categories/${cat.id}/modifier`)
}

function demanderSuppression(id: string) {
  erreurSupp.value = null
  confirmerSuppression.value = id
}

async function confirmerSuppr() {
  if (!confirmerSuppression.value) return
  const ok = await store.supprimerCategorie(confirmerSuppression.value)
  if (!ok) {
    erreurSupp.value = 'Les catégories de base ne peuvent pas être supprimées. Vous pouvez seulement les modifier.'
  }
  confirmerSuppression.value = null
}

const categorie_a_supprimer = computed(() =>
  categories.value.find(c => c.id === confirmerSuppression.value)
)

const nbRemedes = (catId: string) =>
  store.remedes.filter(r => r.categorieId === catId).length
</script>

<template>
  <div class="min-h-screen bg-white">

    <!-- ══ Header ══════════════════════════════════════════════════ -->
    <header class="px-5 pb-5 bg-lavande-50 pt-safe-header-lg">
      <button
        class="flex items-center gap-2 text-sm font-semibold text-lavande-600 mb-4 min-h-[44px]"
        @click="router.push('/admin')"
      >
        <fa :icon="['fas','chevron-left']" class="text-xs" />
        Dashboard
      </button>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold text-ink-900 tracking-tight">Les catégories</h1>
          <p class="text-ink-500 text-sm mt-0.5">{{ categories.length }} catégorie{{ categories.length > 1 ? 's' : '' }}</p>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-lavande-400 text-white font-bold text-sm
                 shadow-sm active:scale-[0.97] transition-all min-h-[44px]"
          @click="router.push('/admin/categories/nouvelle')"
        >
          <fa :icon="['fas','plus']" />
          Nouvelle
        </button>
      </div>

      <!-- Recherche rapide -->
      <div class="relative mt-4">
        <fa :icon="['fas','magnifying-glass']" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 text-sm" />
        <input
          v-model="recherche"
          type="search"
          placeholder="Rechercher une catégorie…"
          class="input pl-10"
        />
      </div>
    </header>

    <!-- ══ Liste ════════════════════════════════════════════════════ -->
    <div class="px-4 py-4 space-y-2">

      <!-- Erreur suppression -->
      <Transition name="fade">
        <div
          v-if="erreurSupp"
          class="flex items-start gap-3 px-4 py-3 rounded-2xl bg-peche-50 border border-peche-100"
        >
          <fa :icon="['fas','triangle-exclamation']" class="text-peche-500 text-sm mt-0.5 flex-shrink-0" />
          <p class="text-sm text-peche-700 leading-snug flex-1">{{ erreurSupp }}</p>
          <button class="text-ink-300 hover:text-ink-500 min-w-[24px]" @click="erreurSupp = null">
            <fa :icon="['fas','xmark']" />
          </button>
        </div>
      </Transition>

      <!-- État vide -->
      <div v-if="categoriesFiltrees.length === 0" class="text-center py-12 text-ink-400">
        <p class="text-3xl mb-3">🌿</p>
        <p class="font-semibold text-ink-600">Aucune catégorie trouvée</p>
      </div>

      <!-- Cartes catégories -->
      <div
        v-for="cat in categoriesFiltrees"
        :key="cat.id"
        class="rounded-2xl bg-white border border-ink-100 shadow-sm overflow-hidden"
      >
        <div class="flex items-center gap-3 px-4 py-3.5">
          <!-- Emoji + badge couleur -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            :class="cat.couleur"
          >
            {{ cat.emoji }}
          </div>

          <!-- Infos -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-sm font-semibold text-ink-800 truncate">{{ cat.nom }}</p>
              <!-- Badge custom -->
              <span
                v-if="categorieService.estCustom(cat.id)"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lavande-100 text-lavande-600 flex-shrink-0"
              >
                CUSTOM
              </span>
            </div>
            <p class="text-xs text-ink-400 mt-0.5">{{ nbRemedes(cat.id) }} remède{{ nbRemedes(cat.id) > 1 ? 's' : '' }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 flex-shrink-0">
            <button
              class="w-9 h-9 rounded-xl bg-lavande-50 flex items-center justify-center text-lavande-500
                     active:scale-95 transition-all"
              aria-label="Modifier"
              @click="editer(cat)"
            >
              <fa :icon="['fas','pen']" class="text-xs" />
            </button>
            <button
              class="w-9 h-9 rounded-xl bg-peche-50 flex items-center justify-center text-peche-500
                     active:scale-95 transition-all"
              aria-label="Supprimer"
              @click="demanderSuppression(cat.id)"
            >
              <fa :icon="['fas','trash']" class="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Dialog confirmation suppression ════════════════════════ -->
    <Transition name="fade">
      <div
        v-if="confirmerSuppression"
        class="fixed inset-0 z-50 flex items-end justify-center px-5 pb-8 bg-black/35"
        @click.self="confirmerSuppression = null"
      >
        <div
          class="w-full max-w-md rounded-3xl bg-white p-6 animate-in-scale shadow-dialog"
          role="dialog"
          aria-labelledby="dialog-suppr-cat-titre"
        >
          <div class="w-14 h-14 rounded-2xl bg-peche-100 flex items-center justify-center mx-auto mb-4">
            <fa :icon="['fas','trash']" class="text-peche-500 text-xl" />
          </div>
          <h3 id="dialog-suppr-cat-titre" class="font-display text-lg font-bold text-ink-800 text-center mb-2 tracking-tight">
            Supprimer cette catégorie ?
          </h3>
          <p class="text-sm text-ink-400 text-center leading-relaxed mb-1">
            <strong class="text-ink-700">{{ categorie_a_supprimer?.nom }}</strong>
          </p>
          <p class="text-sm text-ink-400 text-center leading-relaxed mb-6">
            Cette action est irréversible.
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-3.5 rounded-2xl text-sm font-bold text-ink-600 bg-ink-50 min-h-[48px] active:scale-95 transition-all"
              @click="confirmerSuppression = null"
            >Annuler</button>
            <button
              class="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-peche-500 min-h-[48px] active:scale-95 transition-all"
              @click="confirmerSuppr"
            >Supprimer</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>
