<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LabelChip from '@/components/admin/LabelChip.vue'
import { contactsService } from '@/services/contactsService'
import type { Contact, ApiError } from '@/types'

const contacts = ref<Contact[]>([])
const loading = ref(false)
const error = ref('')
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)
const limit = 50

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await contactsService.list({ page: page.value, limit })
    contacts.value = data.data
    total.value = data.pagination?.total ?? data.data.length
    totalPages.value = data.pagination?.totalPages ?? 1
  } catch (e) {
    error.value = (e as ApiError).message || 'Error'
  } finally {
    loading.value = false
  }
}
onMounted(load)

function fmtDate(s?: string | null) {
  if (!s) return '—'
  const d = new Date(s)
  return d.toLocaleDateString('es-EC')
}
</script>

<template>
  <div class="fuentes">
    <header class="head">
      <h1>Fuentes</h1>
      <p>Contactos archivados con historial de mensajería.</p>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <div class="grid">
      <div v-if="loading" class="empty">Cargando…</div>
      <div v-else-if="!contacts.length" class="empty">Sin fuentes</div>
      <article
        v-for="c in contacts"
        :key="c._id"
        class="card"
      >
        <div class="card__top">
          <div class="avatar">{{ (c.name || c.phone).slice(0, 2).toUpperCase() }}</div>
          <div class="card__head">
            <div class="card__name">{{ c.name || 'Fuente reservada' }}</div>
            <div class="card__phone">{{ c.phone }}</div>
          </div>
          <LabelChip v-if="c.label" :text="c.label" variant="label" />
        </div>

        <div class="card__row">
          <div>
            <div class="kpi">{{ c.messageCount ?? 0 }}</div>
            <div class="kpi-label">Mensajes</div>
          </div>
          <div>
            <div class="kpi">{{ fmtDate(c.lastMessageAt) }}</div>
            <div class="kpi-label">Último</div>
          </div>
        </div>

        <div v-if="c.notes" class="notes">{{ c.notes }}</div>
      </article>
    </div>

    <div v-if="!loading && totalPages > 1" class="pager">
      <button :disabled="page === 1" @click="page--; load()">← Anterior</button>
      <span>Página {{ page }} de {{ totalPages }} · {{ total }} fuentes</span>
      <button :disabled="page === totalPages" @click="page++; load()">Siguiente →</button>
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.card {
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card__top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: grid; place-items: center;
  background: var(--ad-bg-2);
  border: 1px solid var(--ad-border-strong);
  font-size: 12px;
  flex-shrink: 0;
}
.card__head { flex: 1; min-width: 0; }
.card__name {
  font-family: 'Times New Roman', serif;
  font-size: 17px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card__phone { font-size: 12px; color: var(--ad-text-faint); }

.card__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--ad-border);
}
.kpi {
  font-family: 'Times New Roman', serif;
  font-size: 22px;
}
.kpi-label {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ad-text-faint);
}

.notes {
  font-size: 12px;
  color: var(--ad-text-dim);
  line-height: 1.5;
  padding-top: 8px;
  border-top: 1px dashed var(--ad-border);
}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--ad-text-faint);
  font-size: 13px;
}
.error-banner {
  margin-bottom: 14px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  border-radius: 8px;
  font-size: 13px;
}
.pager {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--ad-text-dim);
}
.pager button {
  all: unset;
  cursor: pointer;
  padding: 8px 14px;
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 8px;
}
.pager button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
