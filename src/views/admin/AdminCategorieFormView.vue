<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'

interface Props { id?: string }
const props = defineProps<Props>()

const router = useRouter()
const store  = useMedecineStore()

const estModification = computed(() => !!props.id)
const chargement      = ref(false)
const erreur          = ref<string | null>(null)

// ── Champs du formulaire ───────────────────────────────────────
const nom          = ref('')
const description  = ref('')
const emoji        = ref('🌿')
const couleur      = ref('bg-mint-100')
const couleurTexte = ref('text-mint-800')
const icone        = ref('leaf')

// Options de couleurs Tailwind disponibles (palette Sweet Med)
const optionsCouleurs = [
  { bg: 'bg-mint-100',    texte: 'text-mint-800',    label: 'Menthe',  apercu: '#dcfce7' },
  { bg: 'bg-lavande-100', texte: 'text-lavande-700', label: 'Lavande', apercu: '#e9e7ff' },
  { bg: 'bg-soleil-100',  texte: 'text-soleil-700',  label: 'Soleil',  apercu: '#fef9c3' },
  { bg: 'bg-peche-100',   texte: 'text-peche-700',   label: 'Pêche',   apercu: '#ffe4d6' },
  { bg: 'bg-peche-50',    texte: 'text-peche-600',   label: 'Rosé',    apercu: '#fff1ec' },
  { bg: 'bg-mint-50',     texte: 'text-mint-700',    label: 'Menthe claire', apercu: '#f0fdf4' },
]

function selectionnerCouleur(opt: typeof optionsCouleurs[0]) {
  couleur.value      = opt.bg
  couleurTexte.value = opt.texte
}

// ── Préremplissage en mode édition ────────────────────────────
onMounted(() => {
  if (!props.id) return
  const cat = store.categories.find(c => c.id === props.id)
  if (!cat) return
  nom.value          = cat.nom
  description.value  = cat.description
  emoji.value        = cat.emoji
  couleur.value      = cat.couleur
  couleurTexte.value = cat.couleurTexte
  icone.value        = cat.icone ?? 'leaf'
})

// ── Validation ────────────────────────────────────────────────
function valider(): boolean {
  if (!nom.value.trim())         { erreur.value = 'Le nom est obligatoire.';         return false }
  if (!description.value.trim()) { erreur.value = 'La description est obligatoire.'; return false }
  if (!emoji.value.trim())       { erreur.value = 'L\'emoji est obligatoire.';       return false }
  erreur.value = null
  return true
}

// ── Sauvegarde ────────────────────────────────────────────────
async function sauvegarder() {
  if (!valider()) return
  chargement.value = true

  const payload = {
    nom:          nom.value.trim(),
    description:  description.value.trim(),
    emoji:        emoji.value.trim(),
    couleur:      couleur.value,
    couleurTexte: couleurTexte.value,
    icone:        icone.value.trim() || 'leaf',
  }

  if (estModification.value && props.id) {
    await store.modifierCategorie(props.id, payload)
  } else {
    await store.creerCategorie(payload)
  }

  chargement.value = false
  router.push('/admin/categories')
}
</script>

<template>
  <div class="min-h-screen bg-white pb-8">

    <!-- ══ Header ══════════════════════════════════════════════════ -->
    <header class="px-5 pb-5 bg-lavande-50 pt-safe-header-lg">
      <button
        class="flex items-center gap-2 text-sm font-semibold text-lavande-600 mb-4 min-h-[44px]"
        @click="router.push('/admin/categories')"
      >
        <fa :icon="['fas','chevron-left']" class="text-xs" />
        Retour
      </button>
      <h1 class="font-display text-2xl font-bold text-ink-900 tracking-tight">
        {{ estModification ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
      </h1>
      <p class="text-ink-500 text-sm mt-0.5">
        {{ estModification ? 'Modifiez les informations ci-dessous.' : 'Remplissez les informations de la catégorie.' }}
      </p>
    </header>

    <!-- ══ Formulaire ═══════════════════════════════════════════════ -->
    <div class="px-4 py-4 space-y-3">

      <!-- Erreur -->
      <Transition name="fade">
        <div
          v-if="erreur"
          class="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-peche-50 border border-peche-100"
        >
          <fa :icon="['fas','triangle-exclamation']" class="text-peche-500 text-sm flex-shrink-0" />
          <p class="text-sm text-peche-700">{{ erreur }}</p>
        </div>
      </Transition>

      <!-- Aperçu -->
      <div class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm">
        <h2 class="font-bold text-ink-700 text-sm mb-3">Aperçu</h2>
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            :class="couleur"
          >
            {{ emoji || '?' }}
          </div>
          <div>
            <p class="font-semibold text-ink-800 text-sm">{{ nom || 'Nom de la catégorie' }}</p>
            <p class="text-xs text-ink-400 mt-0.5">{{ description || 'Description…' }}</p>
          </div>
        </div>
      </div>

      <!-- Infos principales -->
      <section class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm space-y-4">
        <h2 class="font-bold text-ink-700 text-sm">Informations</h2>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-nom">Nom *</label>
          <input id="f-nom" v-model="nom" type="text" placeholder="Aromathérapie" class="input" />
        </div>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-description">Description *</label>
          <textarea
            id="f-description"
            v-model="description"
            rows="2"
            placeholder="Bienfaits des huiles essentielles pour le corps et l'esprit"
            class="input resize-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="eyebrow mb-1.5 block" for="f-emoji">Emoji *</label>
            <input id="f-emoji" v-model="emoji" type="text" placeholder="🌿" class="input text-2xl" />
          </div>
          <div>
            <label class="eyebrow mb-1.5 block" for="f-icone">Icône (Font Awesome)</label>
            <input id="f-icone" v-model="icone" type="text" placeholder="leaf" class="input" />
          </div>
        </div>
      </section>

      <!-- Couleur -->
      <section class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm space-y-3">
        <h2 class="font-bold text-ink-700 text-sm">Couleur du badge</h2>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="opt in optionsCouleurs"
            :key="opt.bg"
            class="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all"
            :class="couleur === opt.bg
              ? 'border-ink-400 shadow-sm'
              : 'border-ink-100 active:scale-95'"
            @click="selectionnerCouleur(opt)"
          >
            <div
              class="w-8 h-8 rounded-lg"
              :style="{ backgroundColor: opt.apercu }"
            />
            <span class="text-[11px] font-medium text-ink-600">{{ opt.label }}</span>
          </button>
        </div>
      </section>

      <!-- Bouton sauvegarder -->
      <button
        class="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm text-white
               bg-lavande-400 transition-all duration-200 active:scale-[0.97] min-h-[52px] shadow-sm
               disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="chargement"
        @click="sauvegarder"
      >
        <fa v-if="chargement" :icon="['fas','bolt']" class="animate-pulse" />
        <fa v-else :icon="['fas','floppy-disk']" />
        {{ chargement ? 'Sauvegarde…' : estModification ? 'Enregistrer les modifications' : 'Créer la catégorie' }}
      </button>

    </div>
  </div>
</template>
