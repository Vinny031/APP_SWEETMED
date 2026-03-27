<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMedecineStore } from '@/stores/useMedecineStore'
import type { CategorieId, NiveauDifficulte } from '@/types'

interface Props { id?: string }
const props = defineProps<Props>()

const router = useRouter()
const store  = useMedecineStore()

const estModification = computed(() => !!props.id)
const chargement      = ref(false)
const erreur          = ref<string | null>(null)

// ── Champs du formulaire ───────────────────────────────────────
const titre       = ref('')
const description = ref('')
const contenu     = ref('')
const categorieId = ref<CategorieId>('phytotherapie')
const difficulte  = ref<NiveauDifficulte>('debutant')
const duree       = ref('')
// Champs multi-valeurs (saisis en texte, séparés par une nouvelle ligne)
const benefices   = ref('')
const etapes      = ref('')
const precautions = ref('')
const ingredients = ref('')
const tags        = ref('')

const categories  = computed(() => store.categories)

// ── Préremplissage en mode édition ────────────────────────────
onMounted(() => {
  if (!props.id) return
  const remede = store.getRemede(props.id)
  if (!remede) return
  titre.value       = remede.titre
  description.value = remede.description
  contenu.value     = remede.contenu
  categorieId.value = remede.categorieId
  difficulte.value  = remede.difficulte
  duree.value       = remede.duree ?? ''
  benefices.value   = remede.benefices.join('\n')
  etapes.value      = remede.etapes?.join('\n') ?? ''
  precautions.value = remede.precautions?.join('\n') ?? ''
  ingredients.value = remede.ingredients?.join('\n') ?? ''
  tags.value        = remede.tags.join(', ')
})

// ── Utilitaire : convertit un textarea en tableau ──────────────
function lignesNonVides(val: string): string[] {
  return val.split('\n').map(l => l.trim()).filter(Boolean)
}

// ── Validation ────────────────────────────────────────────────
function valider(): boolean {
  if (!titre.value.trim()) { erreur.value = 'Le titre est obligatoire.'; return false }
  if (!description.value.trim()) { erreur.value = 'La description est obligatoire.'; return false }
  if (!contenu.value.trim()) { erreur.value = 'Le contenu est obligatoire.'; return false }
  if (lignesNonVides(benefices.value).length === 0) { erreur.value = 'Indiquez au moins un bienfait.'; return false }
  erreur.value = null
  return true
}

// ── Sauvegarde ────────────────────────────────────────────────
async function sauvegarder() {
  if (!valider()) return
  chargement.value = true

  const payload = {
    titre:       titre.value.trim(),
    description: description.value.trim(),
    contenu:     contenu.value.trim(),
    categorieId: categorieId.value,
    difficulte:  difficulte.value,
    duree:       duree.value.trim() || undefined,
    benefices:   lignesNonVides(benefices.value),
    etapes:      lignesNonVides(etapes.value).length ? lignesNonVides(etapes.value) : undefined,
    precautions: lignesNonVides(precautions.value).length ? lignesNonVides(precautions.value) : undefined,
    ingredients: lignesNonVides(ingredients.value).length ? lignesNonVides(ingredients.value) : undefined,
    tags:        tags.value.split(',').map(t => t.trim()).filter(Boolean),
    suggestion:  false,
  }

  if (estModification.value && props.id) {
    await store.modifierRemede(props.id, payload)
  } else {
    await store.creerRemede(payload)
  }

  chargement.value = false
  router.push('/admin/remedes')
}
</script>

<template>
  <div class="min-h-screen bg-white pb-8">

    <!-- ══ Header ══════════════════════════════════════════════════ -->
    <header class="px-5 pb-5 bg-soleil-50 pt-safe-header-lg">
      <button
        class="flex items-center gap-2 text-sm font-semibold text-soleil-700 mb-4 min-h-[44px]"
        @click="router.push('/admin/remedes')"
      >
        <fa :icon="['fas','chevron-left']" class="text-xs" />
        Retour
      </button>
      <h1 class="font-display text-2xl font-bold text-ink-900 tracking-tight">
        {{ estModification ? 'Modifier le remède' : 'Nouveau remède' }}
      </h1>
      <p class="text-ink-500 text-sm mt-0.5">
        {{ estModification ? 'Modifiez les informations ci-dessous.' : 'Remplissez les informations du remède.' }}
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

      <!-- Infos principales -->
      <section class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm space-y-4">
        <h2 class="font-bold text-ink-700 text-sm">Informations principales</h2>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-titre">Titre *</label>
          <input id="f-titre" v-model="titre" type="text" placeholder="Nom du remède" class="input" />
        </div>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-description">Description courte *</label>
          <textarea
            id="f-description"
            v-model="description"
            rows="2"
            placeholder="Résumé affiché dans les cartes (1-2 phrases)"
            class="input resize-none"
          />
        </div>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-contenu">Contenu complet *</label>
          <textarea
            id="f-contenu"
            v-model="contenu"
            rows="5"
            placeholder="Description détaillée du remède…"
            class="input resize-none"
          />
        </div>
      </section>

      <!-- Classification -->
      <section class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm space-y-4">
        <h2 class="font-bold text-ink-700 text-sm">Classification</h2>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-categorie">Catégorie</label>
          <select id="f-categorie" v-model="categorieId" class="input">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.emoji }} {{ cat.nom }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="eyebrow mb-1.5 block" for="f-difficulte">Difficulté</label>
            <select id="f-difficulte" v-model="difficulte" class="input">
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
            </select>
          </div>
          <div>
            <label class="eyebrow mb-1.5 block" for="f-duree">Durée</label>
            <input id="f-duree" v-model="duree" type="text" placeholder="ex: 10 min" class="input" />
          </div>
        </div>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-tags">Tags (séparés par des virgules)</label>
          <input id="f-tags" v-model="tags" type="text" placeholder="stress, sommeil, relaxation" class="input" />
        </div>
      </section>

      <!-- Contenu éditorial -->
      <section class="rounded-3xl p-5 bg-white border border-ink-100 shadow-sm space-y-4">
        <h2 class="font-bold text-ink-700 text-sm">Contenu éditorial</h2>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-benefices">
            Bienfaits * <span class="normal-case font-normal text-ink-400">(un par ligne)</span>
          </label>
          <textarea
            id="f-benefices"
            v-model="benefices"
            rows="3"
            placeholder="Réduit le stress&#10;Améliore le sommeil&#10;…"
            class="input resize-none"
          />
        </div>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-ingredients">
            Ingrédients <span class="normal-case font-normal text-ink-400">(un par ligne)</span>
          </label>
          <textarea
            id="f-ingredients"
            v-model="ingredients"
            rows="3"
            placeholder="Lavande vraie&#10;Huile de jojoba&#10;…"
            class="input resize-none"
          />
        </div>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-etapes">
            Étapes <span class="normal-case font-normal text-ink-400">(une par ligne)</span>
          </label>
          <textarea
            id="f-etapes"
            v-model="etapes"
            rows="4"
            placeholder="Verser 3 gouttes dans le diffuseur&#10;Diffuser 20 min&#10;…"
            class="input resize-none"
          />
        </div>

        <div>
          <label class="eyebrow mb-1.5 block" for="f-precautions">
            Précautions <span class="normal-case font-normal text-ink-400">(une par ligne)</span>
          </label>
          <textarea
            id="f-precautions"
            v-model="precautions"
            rows="3"
            placeholder="Déconseillé aux femmes enceintes&#10;…"
            class="input resize-none"
          />
        </div>
      </section>

      <!-- Bouton sauvegarder -->
      <button
        class="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm text-white
               bg-mint-500 transition-all duration-200 active:scale-[0.97] min-h-[52px] shadow-btn-mint
               disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="chargement"
        @click="sauvegarder"
      >
        <fa v-if="chargement" :icon="['fas','bolt']" class="animate-pulse" />
        <fa v-else :icon="['fas','floppy-disk']" />
        {{ chargement ? 'Sauvegarde…' : estModification ? 'Enregistrer les modifications' : 'Créer le remède' }}
      </button>

    </div>
  </div>
</template>
