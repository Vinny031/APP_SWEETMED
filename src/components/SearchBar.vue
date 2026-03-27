<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

interface Props {
  modelValue:   string
  placeholder?: string
  debounce?:    number
  autofocus?:   boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Plante, remède, symptôme…',
  debounce:    300,
  autofocus:   false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'clear'): void
}>()

const val = ref(props.modelValue)
watch(() => props.modelValue, v => { val.value = v })

const { debounced: emitDebounced, cancel } = useDebounce(
  (v: string) => emit('update:modelValue', v),
  props.debounce,
)

function onInput(e: Event) {
  val.value = (e.target as HTMLInputElement).value
  emitDebounced(val.value)
}

function clear() {
  val.value = ''
  cancel()
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="relative flex items-center">
    <!-- Icône loupe -->
    <fa
      :icon="['fas','magnifying-glass']"
      class="absolute left-4 z-10 pointer-events-none text-sm transition-colors duration-200"
      :class="val.length ? 'text-mint-600' : 'text-ink-300'"
      aria-hidden="true"
    />

    <input
      v-model="val"
      type="search"
      :placeholder="placeholder"
      :autofocus="autofocus"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      class="input w-full pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
      aria-label="Recherche"
      @input="onInput"
    />

    <Transition name="fade">
      <button
        v-if="val.length > 0"
        class="absolute right-3 w-7 h-7 flex items-center justify-center rounded-full
               bg-ink-100 text-ink-500 transition-all active:scale-90"
        aria-label="Effacer"
        type="button"
        @click="clear"
      >
        <fa :icon="['fas','xmark']" class="text-xs" />
      </button>
    </Transition>
  </div>
</template>
