<script setup lang="ts">
import RemèdeCardCompact from '@/components/RemèdeCardCompact.vue'
import RemèdeCardGrid from '@/components/RemèdeCardGrid.vue'
import type { Remede } from '@/types'

interface Props {
  remede:   Remede
  compact?: boolean
}

withDefaults(defineProps<Props>(), { compact: false })
defineEmits<{ (e: 'click', r: Remede): void }>()
</script>

<template>
  <RemèdeCardCompact v-if="compact" :remede="remede" @click="$emit('click', $event)" />
  <RemèdeCardGrid    v-else         :remede="remede" @click="$emit('click', $event)" />
</template>
