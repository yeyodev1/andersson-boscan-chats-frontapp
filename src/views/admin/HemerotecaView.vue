<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import StatsCards from '@/components/admin/StatsCards.vue'
import FiltersBar from '@/components/admin/FiltersBar.vue'
import MessagesTable from '@/components/admin/MessagesTable.vue'
import { messagesService } from '@/services/messagesService'
import { contactsService } from '@/services/contactsService'
import type { Message, MessageLabel, MessagesStats, ContactsStats, ApiError } from '@/types'

const props = defineProps<{ search?: string }>()

const messages = ref<Message[]>([])
const total = ref(0)
const page = ref(1)
const limit = 25
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

const filterLabel = ref<MessageLabel | ''>('')
const localSearch = ref('')

const messagesStats = ref<MessagesStats>({})
const contactsStats = ref<ContactsStats>({})

const sevenDaysAgo = () => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d
}

const cards = computed(() => {
  const total7 = messages.value.filter((m) => {
    const d = new Date(m.createdAt)
    return !m.read && d > sevenDaysAgo()
  }).length

  const audioCount =
    messagesStats.value.byType?.AUDIO ??
    messages.value.filter((m) => m.messageType === 'AUDIO').length
  const docCount =
    messagesStats.value.byType?.DOCUMENT ??
    messages.value.filter((m) => m.messageType === 'DOCUMENT').length
  const amenazaCount =
    messagesStats.value.byLabel?.AMENAZA ??
    messages.value.filter((m) => m.label === 'AMENAZA').length

  return [
    { icon: '▦', value: contactsStats.value.total ?? '—', label: 'Investigaciones', sub: 'Archivadas' },
    { icon: '◉', value: messagesStats.value.total ?? total.value, label: 'Conversaciones', sub: 'Grabadas' },
    { icon: '▤', value: docCount, label: 'Documentos', sub: 'Almacenados' },
    { icon: '◌', value: audioCount, label: 'Audios', sub: 'En total' },
    { icon: '⚠', value: amenazaCount, label: 'Alta importancia', sub: 'Activas', accent: true },
    { icon: '↻', value: total7, label: 'Actualizaciones', sub: 'Últimos 7 días' },
  ]
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await messagesService.list({
      label: filterLabel.value || undefined,
      page: page.value,
      limit,
    })
    messages.value = data.data
    total.value = data.pagination?.total ?? data.data.length
    totalPages.value = data.pagination?.totalPages ?? 1
  } catch (e) {
    const err = e as ApiError
    error.value = err.message || 'Error cargando mensajes'
    messages.value = []
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    messagesStats.value = await messagesService.stats()
  } catch {}
  try {
    contactsStats.value = await contactsService.stats()
  } catch {}
}

onMounted(() => {
  loadStats()
  load()
})

watch(filterLabel, () => {
  page.value = 1
  load()
})

watch(() => props.search, (v) => {
  localSearch.value = v ?? ''
})

const filteredMessages = computed(() => {
  const q = (localSearch.value || props.search || '').trim().toLowerCase()
  if (!q) return messages.value
  return messages.value.filter((m) =>
    [m.name, m.phone, m.content, m.label]
      .filter(Boolean)
      .some((s) => String(s).toLowerCase().includes(q)),
  )
})

function clearFilters() {
  filterLabel.value = ''
  localSearch.value = ''
  page.value = 1
  load()
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    load()
  }
}
function prevPage() {
  if (page.value > 1) {
    page.value--
    load()
  }
}
</script>

<template>
  <div class="hemeroteca">
    <header class="page-head">
      <h1>Andersson &amp; Moni</h1>
      <p>Archivo de investigaciones, conversaciones y documentos.</p>
    </header>

    <StatsCards :cards="cards" />

    <FiltersBar
      v-model:search="localSearch"
      v-model:label="filterLabel"
      @clear="clearFilters"
    />

    <div class="order-row">
      <div class="ordenar">Ordenar por: <strong>Más recientes</strong></div>
      <div class="view-toggle">
        <button class="vt vt--active">≡</button>
        <button class="vt">▦</button>
      </div>
    </div>

    <div v-if="error" class="error-banner">⚠ {{ error }}</div>

    <MessagesTable :messages="filteredMessages" :loading="loading" />

    <div v-if="!loading && totalPages > 1" class="pager">
      <button :disabled="page === 1" @click="prevPage">← Anterior</button>
      <span>Página {{ page }} de {{ totalPages }} · {{ total }} resultados</span>
      <button :disabled="page === totalPages" @click="nextPage">Siguiente →</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-head {
  margin-bottom: 24px;
}
.page-head h1 {
  font-family: 'Times New Roman', serif;
  font-weight: 600;
  font-size: 64px;
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 4px 0 8px;
}
.page-head p {
  color: var(--ad-text-dim);
  font-size: 14px;
  margin: 0;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--ad-border);
  margin-top: 4px;
}
.ordenar { font-size: 12px; color: var(--ad-text-dim); }
.ordenar strong { color: var(--ad-text); font-weight: 600; }
.view-toggle { display: flex; gap: 4px; }
.vt {
  all: unset;
  cursor: pointer;
  width: 32px; height: 32px;
  display: grid; place-items: center;
  border-radius: 6px;
  color: var(--ad-text-dim);
}
.vt--active { background: var(--ad-accent); color: #fff; }

.error-banner {
  margin: 16px 0;
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
  font-size: 12px;
}
.pager button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
