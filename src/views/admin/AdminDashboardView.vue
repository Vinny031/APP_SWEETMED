<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { remedeService } from '@/services/remedeService'
import { categorieService } from '@/services/categorieService'

const router = useRouter()
const store  = useMedecineStore()
const auth   = useAuthStore()

const stats = computed(() => store.statistiques)

const totalCustomRemedes = computed(() =>
  store.remedes.filter(r => remedeService.estCustom(r.id)).length
)
const totalCustomCategories = computed(() =>
  store.categories.filter(c => categorieService.estCustom(c.id)).length
)
</script>

<template>
  <div class="min-h-screen bg-ink-50">

    <!-- ══ Header ══════════════════════════════════════════════════ -->
    <header class="px-5 pb-5 bg-white border-b border-ink-100 pt-safe-header-md flex items-center gap-3">
      <fa :icon="['fas','gear']" class="text-ink-800 text-4xl shrink-0" />
      <div class="flex-1 min-w-0">
        <p class="eyebrow mb-0 truncate">{{ auth.prenom || auth.session?.email }}</p>
        <h1 class="font-display text-2xl font-bold text-ink-800 leading-tight tracking-tight">
          Espace admin
        </h1>
      </div>
      <button
        class="w-9 h-9 flex items-center justify-center rounded-xl text-ink-400 active:bg-ink-100 transition-colors shrink-0"
        @click="router.push('/')"
      >
        <fa :icon="['fas','xmark']" class="text-lg" />
      </button>
    </header>

    <!-- ══ Contenu ═════════════════════════════════════════════════ -->
    <div class="px-5 pt-5 pb-8 space-y-6">

      <!-- ── KPIs ─────────────────────────────────────────────────── -->
      <section>
        <p class="eyebrow mb-3">Vue d'ensemble</p>
        <div class="grid grid-cols-2 gap-2.5">

          <div class="rounded-2xl bg-mint-50 border border-mint-100 p-4">
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-3">
              <fa :icon="['fas','book-open']" class="text-mint-600 text-xs" />
            </div>
            <p class="font-display font-bold text-3xl text-ink-900 leading-none">{{ stats.totalRemedes }}</p>
            <p class="text-xs text-ink-400 mt-1 font-medium">Remèdes</p>
            <p v-if="totalCustomRemedes > 0" class="text-xs text-mint-600 font-semibold mt-0.5">
              +{{ totalCustomRemedes }} ajoutés
            </p>
          </div>

          <div class="rounded-2xl bg-lavande-50 border border-lavande-100 p-4">
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-3">
              <fa :icon="['fas','tags']" class="text-lavande-500 text-xs" />
            </div>
            <p class="font-display font-bold text-3xl text-ink-900 leading-none">{{ stats.totalCategories }}</p>
            <p class="text-xs text-ink-400 mt-1 font-medium">Catégories</p>
            <p v-if="totalCustomCategories > 0" class="text-xs text-lavande-500 font-semibold mt-0.5">
              +{{ totalCustomCategories }} ajoutées
            </p>
          </div>

        </div>
      </section>

      <!-- ── Gérer ─────────────────────────────────────────────────── -->
      <section>
        <p class="eyebrow mb-3">Gérer</p>
        <div class="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden divide-y divide-ink-50">

          <!-- Remèdes -->
          <button
            class="w-full flex items-center gap-3.5 px-4 py-3.5 min-h-[56px] active:bg-ink-50 transition-colors text-left"
            @click="router.push('/admin/remedes')"
          >
            <div class="w-9 h-9 rounded-xl bg-mint-50 flex items-center justify-center flex-shrink-0">
              <fa :icon="['fas','book-open']" class="text-mint-600 text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-ink-800">Remèdes</p>
              <p class="text-xs text-ink-400">Ajouter, modifier, supprimer</p>
            </div>
            <fa :icon="['fas','chevron-right']" class="text-ink-300 text-xs flex-shrink-0" />
          </button>

          <!-- Catégories -->
          <button
            class="w-full flex items-center gap-3.5 px-4 py-3.5 min-h-[56px] active:bg-ink-50 transition-colors text-left"
            @click="router.push('/admin/categories')"
          >
            <div class="w-9 h-9 rounded-xl bg-lavande-100 flex items-center justify-center flex-shrink-0">
              <fa :icon="['fas','tags']" class="text-lavande-500 text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-ink-800">Catégories</p>
              <p class="text-xs text-ink-400">Organiser le contenu</p>
            </div>
            <fa :icon="['fas','chevron-right']" class="text-ink-300 text-xs flex-shrink-0" />
          </button>

          <!-- Nouveau remède -->
          <button
            class="w-full flex items-center gap-3.5 px-4 py-3.5 min-h-[56px] active:bg-ink-50 transition-colors text-left"
            @click="router.push('/admin/remedes/nouveau')"
          >
            <div class="w-9 h-9 rounded-xl bg-peche-50 flex items-center justify-center flex-shrink-0">
              <fa :icon="['fas','plus']" class="text-peche-500 text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-ink-800">Nouveau remède</p>
              <p class="text-xs text-ink-400">Créer une nouvelle fiche</p>
            </div>
            <fa :icon="['fas','chevron-right']" class="text-ink-300 text-xs flex-shrink-0" />
          </button>

          <!-- Nouvelle catégorie -->
          <button
            class="w-full flex items-center gap-3.5 px-4 py-3.5 min-h-[56px] active:bg-ink-50 transition-colors text-left"
            @click="router.push('/admin/categories/nouvelle')"
          >
            <div class="w-9 h-9 rounded-xl bg-soleil-100 flex items-center justify-center flex-shrink-0">
              <fa :icon="['fas','tags']" class="text-soleil-600 text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-ink-800">Nouvelle catégorie</p>
              <p class="text-xs text-ink-400">Créer une catégorie</p>
            </div>
            <fa :icon="['fas','chevron-right']" class="text-ink-300 text-xs flex-shrink-0" />
          </button>

        </div>
      </section>

      <!-- ── Répartition ───────────────────────────────────────────── -->
      <section>
        <p class="eyebrow mb-3">Répartition</p>
        <div class="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden divide-y divide-ink-50">
          <div
            v-for="item in stats.remederParCategorie"
            :key="item.categorie.id"
            class="flex items-center gap-3 px-4 py-3 min-h-[44px]"
          >
            <div
              class="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
              :class="item.categorie.image ? '' : [item.categorie.couleur, item.categorie.couleurTexte]"
            >
              <img
                v-if="item.categorie.image"
                :src="item.categorie.image"
                :alt="item.categorie.nom"
                class="w-full h-full object-cover"
              />
              <span v-else class="font-display font-bold text-xs">{{ item.categorie.nom[0].toUpperCase() }}</span>
            </div>
            <span class="flex-1 text-sm font-medium text-ink-700 truncate">{{ item.categorie.nom }}</span>
            <span
              class="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              :class="item.categorie.couleur + ' ' + item.categorie.couleurTexte"
            >{{ item.count }}</span>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
