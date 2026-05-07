<script setup lang="ts">
interface Card {
  icon: string
  value: number | string
  label: string
  sub?: string
  accent?: boolean
}
defineProps<{ cards: Card[] }>()
</script>

<template>
  <div class="stats">
    <div
      v-for="(c, i) in cards"
      :key="i"
      class="card"
      :class="{ 'card--accent': c.accent }"
    >
      <span class="card__icon">{{ c.icon }}</span>
      <div class="card__body">
        <div class="card__value">{{ c.value }}</div>
        <div class="card__label">{{ c.label }}</div>
        <div v-if="c.sub" class="card__sub">{{ c.sub }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 1280px) { .stats { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px) { .stats { grid-template-columns: repeat(2, 1fr); } }

.card {
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: var(--ad-radius);
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-height: 96px;
}
.card--accent .card__value { color: var(--ad-accent); }
.card--accent { border-color: rgba(214, 40, 40, 0.25); }

.card__icon {
  font-size: 18px;
  color: var(--ad-text-dim);
  margin-top: 2px;
}
.card__value {
  font-family: 'Times New Roman', serif;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
}
.card__label {
  margin-top: 6px;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ad-text);
}
.card__sub {
  margin-top: 2px;
  font-size: 11px;
  color: var(--ad-text-faint);
}
</style>
