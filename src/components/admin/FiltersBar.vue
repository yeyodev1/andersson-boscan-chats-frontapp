<script setup lang="ts">
import { MESSAGE_LABELS, type MessageLabel } from '@/types'

interface Props {
  search: string
  label: MessageLabel | ''
}
defineProps<Props>()
const emit = defineEmits<{
  'update:search': [v: string]
  'update:label': [v: MessageLabel | '']
  clear: []
}>()
</script>

<template>
  <div class="filters">
    <div class="filters__row">
      <label class="search-input">
        <span>⌕</span>
        <input
          type="text"
          :value="search"
          placeholder="Buscar por palabras clave, nombres, lugares..."
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <button class="filter-pill" disabled>📅 Fechas ▾</button>
      <button class="filter-pill" disabled>Tipo de denuncia ▾</button>
      <button class="filter-pill" disabled>
        Importancia
        <span class="dot dot--r" /><span class="dot dot--y" /><span class="dot dot--g" />
      </button>
      <button class="filter-pill" disabled>Estado ▾</button>
      <button class="filter-pill" disabled>⚙ Más filtros</button>
      <button class="filter-link" @click="emit('clear')">Limpiar</button>
    </div>

    <div class="filters__chips">
      <span class="chips-label">TIPOS DE DENUNCIA</span>
      <button
        class="chip-btn"
        :class="{ 'chip-btn--active': label === '' }"
        @click="emit('update:label', '')"
      >Todos</button>
      <button
        v-for="l in MESSAGE_LABELS"
        :key="l"
        class="chip-btn"
        :class="{ 'chip-btn--active': label === l }"
        @click="emit('update:label', l)"
      >{{ l.replace('_', ' ') }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 22px 0 16px;
}
.filters__row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.search-input {
  flex: 1;
  min-width: 280px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 13px;
}
.search-input span { color: var(--ad-text-faint); }
.search-input input {
  all: unset;
  flex: 1;
  color: var(--ad-text);
}
.search-input input::placeholder { color: var(--ad-text-faint); }

.filter-pill {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 10px;
  font-size: 12px;
  color: var(--ad-text-dim);
}
.filter-pill:disabled { opacity: 0.55; cursor: not-allowed; }
.dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.dot--r { background: #ef4444; }
.dot--y { background: #facc15; }
.dot--g { background: #22c55e; }

.filter-link {
  all: unset;
  cursor: pointer;
  font-size: 12px;
  color: var(--ad-accent);
  padding: 6px 8px;
}

.filters__chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.chips-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ad-text-faint);
  margin-right: 6px;
}
.chip-btn {
  all: unset;
  cursor: pointer;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--ad-text-dim);
  border: 1px solid transparent;
}
.chip-btn:hover { color: var(--ad-text); }
.chip-btn--active {
  background: var(--ad-accent);
  color: #fff;
  border-color: var(--ad-accent);
}
</style>
