<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import LabelChip from '@/components/admin/LabelChip.vue'
import { messagesService } from '@/services/messagesService'
import type { Message, ApiError } from '@/types'

const messages = ref<Message[]>([])
const loading = ref(false)
const error = ref('')
const selectedPhone = ref<string | null>(null)

interface Thread {
  phone: string
  name?: string
  lastMessage: Message
  count: number
  unread: number
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await messagesService.list({ page: 1, limit: 200 })
    messages.value = data.data
    if (!selectedPhone.value && data.data.length) {
      selectedPhone.value = data.data[0]?.phone ?? null
    }
  } catch (e) {
    error.value = (e as ApiError).message || 'Error cargando'
  } finally {
    loading.value = false
  }
}
onMounted(load)

const threads = computed<Thread[]>(() => {
  const map = new Map<string, Thread>()
  for (const m of messages.value) {
    const prev = map.get(m.phone)
    if (!prev) {
      map.set(m.phone, {
        phone: m.phone,
        name: m.name,
        lastMessage: m,
        count: 1,
        unread: m.read ? 0 : 1,
      })
    } else {
      prev.count++
      if (!m.read) prev.unread++
      if (new Date(m.createdAt) > new Date(prev.lastMessage.createdAt)) {
        prev.lastMessage = m
        prev.name = m.name || prev.name
      }
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => +new Date(b.lastMessage.createdAt) - +new Date(a.lastMessage.createdAt),
  )
})

const conversation = computed(() => {
  if (!selectedPhone.value) return []
  return messages.value
    .filter((m) => m.phone === selectedPhone.value)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
})

function fmtTime(s: string) {
  return new Date(s).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
}
function fmtDay(s: string) {
  const d = new Date(s)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}
</script>

<template>
  <div class="conv">
    <header class="conv__head">
      <h1>Conversaciones</h1>
      <p>Historial completo de mensajería entrante.</p>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <div class="conv__layout">
      <aside class="conv__list">
        <div v-if="loading" class="empty">Cargando…</div>
        <div v-else-if="!threads.length" class="empty">Sin hilos</div>
        <button
          v-for="t in threads"
          :key="t.phone"
          class="thread"
          :class="{ 'thread--active': t.phone === selectedPhone }"
          @click="selectedPhone = t.phone"
        >
          <div class="thread__avatar">{{ (t.name || t.phone).slice(0, 2).toUpperCase() }}</div>
          <div class="thread__body">
            <div class="thread__top">
              <span class="thread__name">{{ t.name || t.phone }}</span>
              <span class="thread__time">{{ fmtDay(t.lastMessage.createdAt) }}</span>
            </div>
            <div class="thread__last">{{ t.lastMessage.content }}</div>
          </div>
          <span v-if="t.unread > 0" class="thread__badge">{{ t.unread }}</span>
        </button>
      </aside>

      <section class="conv__pane">
        <header v-if="selectedPhone" class="pane-head">
          <div>
            <div class="pane-name">{{ conversation[0]?.name || selectedPhone }}</div>
            <div class="pane-sub">{{ selectedPhone }} · {{ conversation.length }} mensajes</div>
          </div>
          <LabelChip v-if="conversation[0]?.label" :text="conversation[0].label!" variant="label" />
        </header>
        <div class="pane-body">
          <div v-for="m in conversation" :key="m._id" class="bubble">
            <div class="bubble__meta">
              <span>{{ fmtDay(m.createdAt) }} · {{ fmtTime(m.createdAt) }}</span>
              <LabelChip v-if="m.label" :text="m.label" variant="label" />
            </div>
            <div class="bubble__content">{{ m.content }}</div>
            <div v-if="m.autoResponse" class="bubble__auto">
              <span class="bubble__auto-tag">Auto</span> {{ m.autoResponse }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conv__head h1 {
  font-family: 'Times New Roman', serif;
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.conv__head p {
  color: var(--ad-text-dim);
  font-size: 13px;
  margin: 0 0 22px;
}

.conv__layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  height: calc(100vh - 240px);
  min-height: 520px;
}
@media (max-width: 960px) {
  .conv__layout { grid-template-columns: 1fr; height: auto; }
}

.conv__list {
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 12px;
  overflow-y: auto;
  padding: 6px;
}
.thread {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid var(--ad-border);
}
.thread:last-child { border-bottom: 0; }
.thread:hover { background: rgba(255, 255, 255, 0.03); }
.thread--active { background: rgba(214, 40, 40, 0.1); }
.thread__avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: grid; place-items: center;
  background: var(--ad-bg-2);
  border: 1px solid var(--ad-border-strong);
  font-size: 12px;
  flex-shrink: 0;
}
.thread__body { flex: 1; min-width: 0; }
.thread__top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 2px;
}
.thread__name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.thread__time {
  font-size: 11px;
  color: var(--ad-text-faint);
}
.thread__last {
  font-size: 12px;
  color: var(--ad-text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.thread__badge {
  background: var(--ad-accent);
  color: #fff;
  border-radius: 999px;
  padding: 2px 7px;
  font-size: 10px;
  font-weight: 700;
}

.conv__pane {
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.pane-head {
  padding: 16px 20px;
  border-bottom: 1px solid var(--ad-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pane-name { font-family: 'Times New Roman', serif; font-size: 20px; }
.pane-sub { font-size: 12px; color: var(--ad-text-faint); margin-top: 2px; }
.pane-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bubble {
  background: var(--ad-bg-2);
  border: 1px solid var(--ad-border);
  border-radius: 10px;
  padding: 12px 14px;
}
.bubble__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--ad-text-faint);
  margin-bottom: 6px;
}
.bubble__content {
  font-size: 14px;
  line-height: 1.5;
}
.bubble__auto {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--ad-border-strong);
  font-size: 12px;
  color: var(--ad-text-dim);
}
.bubble__auto-tag {
  background: var(--ad-accent-soft);
  color: var(--ad-accent);
  font-size: 9px;
  letter-spacing: 0.14em;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 6px;
}

.empty {
  padding: 30px;
  text-align: center;
  color: var(--ad-text-faint);
  font-size: 13px;
}
.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}
</style>
