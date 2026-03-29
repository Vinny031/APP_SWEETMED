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
const couleur      = ref('bg-mint-100')
const couleurTexte = ref('text-mint-800')
const image        = ref<string | undefined>(undefined)

// ── Upload image ───────────────────────────────────────────────
const inputFichier  = ref<HTMLInputElement | null>(null)
const FORMATS_ACCEPTES = ['image/jpeg', 'image/png', 'image/webp']

function ouvrirSelecteur() {
  inputFichier.value?.click()
}

function convertirEnWebp(fichier: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width  = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas non supporté')); return }
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/webp', 0.85))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(fichier)
  })
}

async function onFichierSelectionne(e: Event) {
  const fichier = (e.target as HTMLInputElement).files?.[0]
  if (!fichier) return
  if (!FORMATS_ACCEPTES.includes(fichier.type)) {
    erreur.value = 'Format non supporté. Utilisez JPG, JPEG, PNG ou WebP.'
    if (inputFichier.value) inputFichier.value.value = ''
    return
  }
  try {
    image.value = await convertirEnWebp(fichier)
  } catch {
    erreur.value = 'Impossible de traiter l\'image, veuillez réessayer.'
  }
}

function supprimerImage() {
  image.value = undefined
  if (inputFichier.value) inputFichier.value.value = ''
}

// Options de couleurs Tailwind disponibles (palette Sweet Med)
const optionsCouleurs = [
  { bg: 'bg-mint-100',    texte: 'text-mint-800',    label: 'Menthe',        apercu: '#dcfce7' },
  { bg: 'bg-lavande-100', texte: 'text-lavande-700', label: 'Lavande',       apercu: '#e9e7ff' },
  { bg: 'bg-soleil-100',  texte: 'text-soleil-700',  label: 'Soleil',        apercu: '#fef9c3' },
  { bg: 'bg-peche-100',   texte: 'text-peche-700',   label: 'Pêche',         apercu: '#ffe4d6' },
  { bg: 'bg-peche-50',    texte: 'text-peche-600',   label: 'Rosé',          apercu: '#fff1ec' },
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
  couleur.value      = cat.couleur
  couleurTexte.value = cat.couleurTexte
  image.value        = cat.image
})

// ── Validation ────────────────────────────────────────────────
function valider(): boolean {
  if (!nom.value.trim())         { erreur.value = 'Le nom est obligatoire.';         return false }
  if (!description.value.trim()) { erreur.value = 'La description est obligatoire.'; return false }
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
    emoji:        '',
    couleur:      couleur.value,
    couleurTexte: couleurTexte.value,
    icone:        '',
    image:        image.value,
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
  <div class="min-h-screen bg-ink-50 pb-8">

    <!-- ══ Header ══════════════════════════════════════════════════ -->
    <header class="px-5 pb-6 bg-lavande-50 pt-safe-header-lg">
      <button
        class="flex items-center gap-2 text-sm font-semibold text-lavande-600 mb-4 min-h-[44px]"
        @click="router.push('/admin/categories')"
      >
        <fa :icon="['fas','chevron-left']" class="text-xs" />
        Les catégories
      </button>
      <h1 class="font-display text-2xl font-bold text-ink-900 tracking-tight">
        {{ estModification ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
      </h1>
      <p class="text-ink-500 text-sm mt-0.5">
        {{ estModification ? 'Modifiez les informations ci-dessous.' : 'Remplissez les informations de la catégorie.' }}
      </p>
    </header>

    <!-- ══ Formulaire ═══════════════════════════════════════════════ -->
    <div class="px-4 pt-4 space-y-3">

      <!-- Erreur -->
      <Transition name="fade">
        <div
          v-if="erreur"
          class="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-peche-50 border border-peche-100"
        >
          <fa :icon="['fas','triangle-exclamation']" class="text-peche-500 text-sm flex-shrink-0" />
          <p class="text-sm text-peche-700 flex-1">{{ erreur }}</p>
          <button class="text-ink-300 min-w-[24px]" @click="erreur = null">
            <fa :icon="['fas','xmark']" />
          </button>
        </div>
      </Transition>

      <!-- ── Aperçu ──────────────────────────────────────────────── -->
      <section class="rounded-3xl bg-white border border-ink-100 shadow-sm overflow-hidden">
        <!-- Bannière image -->
        <div
          v-if="image"
          class="relative h-28 w-full overflow-hidden"
        >
          <img :src="image" alt="Image de la catégorie" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/20" />
        </div>

        <div class="flex items-center gap-3 p-4">
          <div
            class="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center font-display font-bold text-lg flex-shrink-0"
            :class="image ? '' : [couleur, couleurTexte]"
          >
            <img v-if="image" :src="image" alt="aperçu" class="w-full h-full object-cover" />
            <span v-else>{{ nom ? nom[0].toUpperCase() : '?' }}</span>
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-ink-800 text-sm truncate">{{ nom || 'Nom de la catégorie' }}</p>
            <p class="text-xs text-ink-400 mt-0.5 line-clamp-2">{{ description || 'Description…' }}</p>
          </div>
        </div>
      </section>

      <!-- ── Informations ────────────────────────────────────────── -->
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

      </section>

      <!-- ── Image ───────────────────────────────────────────────── -->
      <section class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm space-y-3">
        <h2 class="font-bold text-ink-700 text-sm">Image de couverture</h2>
        <p class="text-xs text-ink-400 -mt-1">Optionnelle — affichée en bannière sur la catégorie.</p>

        <!-- Zone upload -->
        <input
          ref="inputFichier"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onFichierSelectionne"
        />

        <div v-if="!image">
          <button
            class="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-2xl
                   border-2 border-dashed border-ink-200 bg-ink-50
                   active:bg-ink-100 transition-colors text-ink-400"
            @click="ouvrirSelecteur"
          >
            <div class="w-10 h-10 rounded-xl bg-white border border-ink-100 flex items-center justify-center shadow-sm">
              <fa :icon="['fas','image']" class="text-ink-400 text-sm" />
            </div>
            <span class="text-xs font-semibold text-ink-500">Choisir une image</span>
            <span class="text-[11px] text-ink-300">JPG, JPEG, PNG, WebP → converti en WebP</span>
          </button>
        </div>

        <!-- Prévisualisation -->
        <div v-else class="space-y-2">
          <div class="relative rounded-2xl overflow-hidden h-36 bg-ink-100">
            <img :src="image" alt="Aperçu" class="w-full h-full object-cover" />
          </div>
          <div class="flex gap-2">
            <button
              class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ink-50
                     border border-ink-100 text-xs font-semibold text-ink-600
                     active:bg-ink-100 transition-colors min-h-[44px]"
              @click="ouvrirSelecteur"
            >
              <fa :icon="['fas','arrow-up-from-bracket']" class="text-xs" />
              Changer
            </button>
            <button
              class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-peche-50
                     border border-peche-100 text-xs font-semibold text-peche-600
                     active:bg-peche-100 transition-colors min-h-[44px]"
              @click="supprimerImage"
            >
              <fa :icon="['fas','trash']" class="text-xs" />
              Supprimer
            </button>
          </div>
        </div>
      </section>

      <!-- ── Couleur du badge ────────────────────────────────────── -->
      <section class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm space-y-3">
        <h2 class="font-bold text-ink-700 text-sm">Couleur du badge</h2>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="opt in optionsCouleurs"
            :key="opt.bg"
            class="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all"
            :class="couleur === opt.bg
              ? 'border-ink-400 shadow-sm'
              : 'border-transparent bg-ink-50 active:scale-95'"
            @click="selectionnerCouleur(opt)"
          >
            <div class="w-8 h-8 rounded-lg" :style="{ backgroundColor: opt.apercu }" />
            <span class="text-[11px] font-medium text-ink-600">{{ opt.label }}</span>
          </button>
        </div>
      </section>

      <!-- ── Bouton sauvegarder ──────────────────────────────────── -->
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
