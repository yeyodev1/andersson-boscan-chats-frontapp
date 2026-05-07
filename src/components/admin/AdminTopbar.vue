<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ section?: string; modelValue?: string }>()
const emit = defineEmits<{
  'update:modelValue': [v: string]
  'submit-search': [v: string]
}>()

const local = ref(props.modelValue ?? '')

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  local.value = v
  emit('update:modelValue', v)
}
function onSubmit(e: Event) {
  e.preventDefault()
  emit('submit-search', local.value)
}
</script>

<template>
  <header class="topbar">
    <div class="topbar__section">{{ section || 'HEMEROTECA' }}</div>

    <form class="topbar__search" @submit="onSubmit">
      <span class="search-icon">⌕</span>
      <input
        type="text"
        :value="local"
        @input="onInput"
        placeholder="Buscar en toda la hemeroteca..."
      />
      <span class="search-kbd">⌘K</span>
    </form>

    <div class="topbar__actions">
      <button class="icon-btn" title="Notificaciones">⏷</button>
      <button class="avatar-btn">A&amp;M</button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.topbar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 18px 32px;
  border-bottom: 1px solid var(--ad-border);
  background: var(--ad-bg);
  position: sticky;
  top: 0;
  z-index: 5;
}
.topbar__section {
  font-size: 11px;
  letter-spacing: 0.22em;
  font-weight: 700;
  color: var(--ad-accent);
}
.topbar__search {
  flex: 1;
  max-width: 540px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 10px;
  padding: 8px 14px;
  transition: border-color 0.15s;
}
.topbar__search:focus-within { border-color: var(--ad-border-strong); }
.search-icon { color: var(--ad-text-faint); }
.topbar__search input {
  all: unset;
  flex: 1;
  font-size: 13px;
  color: var(--ad-text);
}
.topbar__search input::placeholder { color: var(--ad-text-faint); }
.search-kbd {
  font-size: 10px;
  border: 1px solid var(--ad-border-strong);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--ad-text-dim);
}
.topbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon-btn, .avatar-btn {
  all: unset;
  cursor: pointer;
  width: 36px; height: 36px;
  border-radius: 50%;
  display: grid; place-items: center;
  border: 1px solid var(--ad-border);
  background: var(--ad-panel);
  font-size: 13px;
  color: var(--ad-text);
}
.icon-btn:hover, .avatar-btn:hover { border-color: var(--ad-border-strong); }
.avatar-btn {
  font-family: 'Times New Roman', serif;
  font-size: 11px;
}
</style>
