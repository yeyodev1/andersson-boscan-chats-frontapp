<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import LabelChip from '@/components/admin/LabelChip.vue'
import { messagesService } from '@/services/messagesService'
import { contactsService } from '@/services/contactsService'
import { MESSAGE_LABELS } from '@/types'
import type { ApiError, MessagesStats, ContactsStats } from '@/types'

const msgStats = ref<MessagesStats>({})
const contStats = ref<ContactsStats>({})
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [m, c] = await Promise.allSettled([
      messagesService.stats(),
      contactsService.stats(),
    ])
    if (m.status === 'fulfilled') msgStats.value = m.value
    if (c.status === 'fulfilled') contStats.value = c.value
    if (m.status === 'rejected' && c.status === 'rejected') {
      error.value = (m.reason as ApiError).message || 'Error cargando estadísticas'
    }
  } finally {
    loading.value = false
  }
}
onMounted(load)

const totalMsg = computed(() => msgStats.value.total ?? 0)

const rows = computed(() =>
  MESSAGE_LABELS.map((l) => ({
    label: l,
    msg: msgStats.value.byLabel?.[l] ?? 0,
    contacts: contStats.value.byLabel?.[l] ?? 0,
    pct: totalMsg.value
      ? Math.round(((msgStats.value.byLabel?.[l] ?? 0) / totalMsg.value) * 100)
      : 0,
  })).sort((a, b) => b.msg - a.msg),
)
</script>

<template>
  <div class="etiquetas">
    <header class="head">
      <h1>Etiquetas</h1>
      <p>Distribución de mensajes y fuentes por categoría.</p>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>
    <div v-if="loading" class="empty">Cargando…</div>

    <div v-else class="rows">
      <div
        v-for="r in rows"
        :key="r.label"
        class="row"
      >
        <div class="row__chip">
          <LabelChip :text="r.label" variant="label" />
        </div>
        <div class="row__bar">
          <div class="bar">
            <div class="bar__fill" :style="{ width: r.pct + '%' }" />
          </div>
        </div>
        <div class="row__stats">
          <div><strong>{{ r.msg }}</strong> mensajes</div>
          <div class="muted">{{ r.contacts }} fuentes · {{ r.pct }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.head h1 {
  font-family: 'Times New Roman', serif;
  font-size: 48px;
  font-weight: 600;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}
.head p { color: var(--ad-text-dim); margin: 0 0 22px; font-size: 13px; }

.rows {
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 12px;
  padding: 8px;
}
.row {
  display: grid;
  grid-template-columns: 200px 1fr 220px;
  align-items: center;
  gap: 18px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--ad-border);
}
.row:last-child { border-bottom: 0; }
@media (max-width: 720px) {
  .row { grid-template-columns: 1fr; gap: 8px; }
}

.bar {
  height: 8px;
  background: var(--ad-bg-2);
  border-radius: 999px;
  overflow: hidden;
}
.bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--ad-accent), var(--ad-gold));
  border-radius: 999px;
  transition: width 0.4s;
}

.row__stats { font-size: 13px; text-align: right; }
.row__stats strong { font-family: 'Times New Roman', serif; font-size: 18px; }
.muted { font-size: 11px; color: var(--ad-text-faint); }

.empty, .error-banner {
  padding: 24px;
  text-align: center;
  color: var(--ad-text-faint);
  font-size: 13px;
}
.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  border-radius: 8px;
}
</style>
