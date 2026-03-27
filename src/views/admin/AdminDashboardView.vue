<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import { remedeService } from '@/services/remedeService'
import { categorieService } from '@/services/categorieService'

const router = useRouter()
const store  = useMedecineStore()

const stats = computed(() => store.statistiques)

const totalCustomRemedes = computed(() =>
  store.remedes.filter(r => remedeService.estCustom(r.id)).length
)
const totalCustomCategories = computed(() =>
  store.categories.filter(c => categorieService.estCustom(c.id)).length
)

const maxCount = computed(() =>
  Math.max(...stats.value.remederParCategorie.map(i => i.count), 1)
)
</script>

<template>
  <div class="min-h-screen bg-ink-50">

    <!-- ══ Header ══════════════════════════════════════════════════ -->
    <header class="px-5 pb-5 bg-white border-b border-ink-100 pt-safe-header-md flex items-center gap-3">
      <fa :icon="['fas','gear']" class="text-ink-800 text-4xl shrink-0" />
      <div class="flex-1">
        <p class="eyebrow mb-0">Administrateur</p>
        <h1 class="font-display text-2xl font-bold text-ink-800 leading-tight tracking-tight">
          Administration
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
    <div class="px-5 pt-5 pb-6 space-y-6">

      <!-- ── Actions rapides ───────────────────────────────────── -->
      <section>
        <p class="eyebrow mb-3">Actions rapides</p>
        <div class="grid grid-cols-2 gap-2.5">
          <button
            class="rounded-2xl bg-white border border-ink-100 shadow-card flex flex-col items-center gap-2.5 px-4 py-5 active:bg-ink-50 transition-colors"
            @click="router.push('/admin/remedes/nouveau')"
          >
            <div class="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center">
              <fa :icon="['fas','plus']" class="text-mint-600" />
            </div>
            <span class="text-xs font-semibold text-ink-700 text-center leading-tight">Nouveau remède</span>
          </button>
          <button
            class="rounded-2xl bg-white border border-ink-100 shadow-card flex flex-col items-center gap-2.5 px-4 py-5 active:bg-ink-50 transition-colors"
            @click="router.push('/admin/categories/nouvelle')"
          >
            <div class="w-10 h-10 rounded-xl bg-lavande-100 flex items-center justify-center">
              <fa :icon="['fas','plus']" class="text-lavande-500" />
            </div>
            <span class="text-xs font-semibold text-ink-700 text-center leading-tight">Nouvelle catégorie</span>
          </button>
        </div>
      </section>

      <!-- ── KPIs principaux ────────────────────────────────────── -->
      <section>
        <p class="eyebrow mb-3">Vue d'ensemble</p>
        <div class="grid grid-cols-2 gap-2.5">

          <!-- Remèdes -->
          <button
            class="rounded-2xl bg-white border border-ink-100 shadow-card p-4 text-left active:bg-ink-50 transition-colors"
            @click="router.push('/admin/remedes')"
          >
            <div class="w-8 h-8 rounded-lg bg-mint-50 flex items-center justify-center mb-3">
              <fa :icon="['fas','book-open']" class="text-mint-600 text-xs" />
            </div>
            <p class="font-display font-bold text-3xl text-ink-900 leading-none">{{ stats.totalRemedes }}</p>
            <p class="text-xs text-ink-400 mt-1 font-medium">Remèdes</p>
            <p v-if="totalCustomRemedes > 0" class="text-xs text-mint-600 font-semibold mt-0.5">
              +{{ totalCustomRemedes }} ajoutés
            </p>
          </button>

          <!-- Catégories -->
          <button
            class="rounded-2xl bg-white border border-ink-100 shadow-card p-4 text-left active:bg-ink-50 transition-colors"
            @click="router.push('/admin/categories')"
          >
            <div class="w-8 h-8 rounded-lg bg-lavande-100 flex items-center justify-center mb-3">
              <fa :icon="['fas','tags']" class="text-lavande-500 text-xs" />
            </div>
            <p class="font-display font-bold text-3xl text-ink-900 leading-none">{{ stats.totalCategories }}</p>
            <p class="text-xs text-ink-400 mt-1 font-medium">Catégories</p>
            <p v-if="totalCustomCategories > 0" class="text-xs text-lavande-500 font-semibold mt-0.5">
              +{{ totalCustomCategories }} ajoutées
            </p>
          </button>

        </div>
      </section>

      <!-- ── Répartition par catégorie ──────────────────────────── -->
      <section>
        <p class="eyebrow mb-3">Répartition</p>
        <div class="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden divide-y divide-ink-50">
          <button
            v-for="item in stats.remederParCategorie"
            :key="item.categorie.id"
            class="w-full px-5 py-3.5 min-h-[44px] text-left active:bg-ink-50 transition-colors"
            @click="router.push(`/admin/remedes?categorie=${item.categorie.id}`)"
          >
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2">
                <span class="text-sm leading-none">{{ item.categorie.emoji }}</span>
                <span class="text-sm font-medium text-ink-700">{{ item.categorie.nom }}</span>
              </div>
              <span
                class="text-xs font-bold px-2 py-0.5 rounded-full"
                :class="item.categorie.couleur + ' ' + item.categorie.couleurTexte"
              >{{ item.count }}</span>
            </div>
            <!-- Barre de progression -->
            <div class="h-1.5 rounded-full bg-ink-100 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="item.categorie.couleur.replace('bg-', 'bg-').replace('-100', '-300').replace('-50', '-200')"
                :style="{ width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%' }"
              />
            </div>
          </button>
        </div>
      </section>


    </div>
  </div>
</template>
