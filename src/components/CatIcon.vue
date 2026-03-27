<script setup lang="ts">
import type { Categorie } from '@/types'

interface Props {
  categorie?: Categorie
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
withDefaults(defineProps<Props>(), { size: 'md' })

const sizeClass: Record<string, string> = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
}

const imgSizeClass: Record<string, string> = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
}
</script>

<template>
  <img
    v-if="categorie?.image"
    :src="categorie.image"
    :alt="categorie.nom"
    class="object-contain"
    :class="imgSizeClass[size]"
  />
  <span v-else :class="sizeClass[size]" role="img" :aria-label="categorie?.nom">
    {{ categorie?.emoji ?? '✨' }}
  </span>
</template>
