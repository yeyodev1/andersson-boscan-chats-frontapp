<script setup lang="ts">
import { computed } from 'vue'
import LabelChip from './LabelChip.vue'
import type { Message, MessageLabel } from '@/types'

const props = defineProps<{
  messages: Message[]
  loading?: boolean
}>()

const emit = defineEmits<{ select: [m: Message] }>()

function importanceFor(label?: MessageLabel): { text: string; tone: string } {
  if (!label) return { text: 'Baja', tone: 'baja' }
  if (label === 'AMENAZA' || label === 'PRUEBA_VIDA') return { text: 'Alta', tone: 'alta' }
  if (label === 'PRENSA' || label === 'COLABORACION' || label === 'FUENTE' || label === 'PROYECTO')
    return { text: 'Media', tone: 'media' }
  return { text: 'Baja', tone: 'baja' }
}

function statusFor(m: Message): string {
  if (m.read) return 'DOCUMENTADO'
  if (m.autoResponded) return 'VERIFICANDO'
  if (m.label === 'PROYECTO' || m.label === 'COLABORACION') return 'POR PUBLICAR'
  return 'INVESTIGANDO'
}

function fmtDate(s: string): { date: string; time: string } {
  const d = new Date(s)
  if (isNaN(d.getTime())) return { date: '—', time: '' }
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const date = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
  const time = d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return { date, time }
}

function iconFor(t?: string): string {
  switch (t) {
    case 'AUDIO': return '◌'
    case 'IMAGE': return '▤'
    case 'VIDEO': return '▥'
    case 'DOCUMENT': return '▤'
    case 'STICKER': return '◔'
    default: return '◉'
  }
}

const rows = computed(() => props.messages)
</script>

<template>
  <div class="table-wrap">
    <div class="table-head">
      <div class="th th--inv">INVESTIGACIÓN</div>
      <div class="th">TIPO DE DENUNCIA</div>
      <div class="th">IMPORTANCIA</div>
      <div class="th">FECHA</div>
      <div class="th">FUENTE PRINCIPAL</div>
      <div class="th">ESTADO</div>
      <div class="th th--end" />
    </div>

    <div v-if="loading" class="empty">Cargando…</div>
    <div v-else-if="!rows.length" class="empty">Sin resultados</div>

    <button
      v-for="m in rows"
      :key="m._id"
      class="row"
      @click="emit('select', m)"
    >
      <div class="cell cell--inv">
        <span class="row__icon">{{ iconFor(m.messageType) }}</span>
        <div>
          <div class="row__title">{{ m.name || m.phone || 'Mensaje' }}</div>
          <div class="row__sub">{{ m.content }}</div>
        </div>
      </div>
      <div class="cell">
        <LabelChip v-if="m.label" :text="m.label" variant="label" />
        <span v-else class="muted">—</span>
      </div>
      <div class="cell">
        <LabelChip
          :text="importanceFor(m.label).text"
          :tone="importanceFor(m.label).tone"
          variant="importance"
        />
      </div>
      <div class="cell">
        <div class="row__date">{{ fmtDate(m.createdAt).date }}</div>
        <div class="row__time">{{ fmtDate(m.createdAt).time }}</div>
      </div>
      <div class="cell">
        <div>{{ m.name || 'Fuente reservada' }}</div>
        <div class="row__sub">{{ m.platform }}</div>
      </div>
      <div class="cell">
        <LabelChip :text="statusFor(m)" variant="status" />
      </div>
      <div class="cell cell--end">⋯</div>
    </button>
  </div>
</template>

<style scoped lang="scss">
.table-wrap {
  border-top: 1px solid var(--ad-border);
  margin-top: 8px;
}
.table-head, .row {
  display: grid;
  grid-template-columns: minmax(0, 2.4fr) 1.2fr 1fr 1.1fr 1.3fr 1.2fr 40px;
  gap: 16px;
  align-items: center;
  padding: 14px 8px;
}
.table-head {
  border-bottom: 1px solid var(--ad-border);
  padding: 12px 8px;
}
.th {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ad-text-faint);
  text-transform: uppercase;
}
.th--inv { padding-left: 36px; }

.row {
  all: unset;
  cursor: pointer;
  border-bottom: 1px solid var(--ad-border);
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 2.4fr) 1.2fr 1fr 1.1fr 1.3fr 1.2fr 40px;
  gap: 16px;
  align-items: center;
  padding: 16px 8px;
  transition: background 0.12s;
}
.row:hover { background: rgba(255, 255, 255, 0.02); }

.cell { font-size: 13px; min-width: 0; }
.cell--inv {
  display: flex;
  gap: 14px;
  align-items: center;
}
.row__icon {
  width: 28px; height: 28px;
  display: grid; place-items: center;
  background: var(--ad-panel-2);
  border-radius: 6px;
  border: 1px solid var(--ad-border);
  font-size: 13px;
  color: var(--ad-text-dim);
  flex-shrink: 0;
}
.row__title {
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 360px;
}
.row__sub {
  font-size: 12px;
  color: var(--ad-text-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 360px;
}
.row__date { font-size: 13px; }
.row__time { font-size: 11px; color: var(--ad-text-faint); }
.cell--end { text-align: right; color: var(--ad-text-faint); }
.muted { color: var(--ad-text-faint); font-size: 12px; }
.empty {
  padding: 40px;
  text-align: center;
  color: var(--ad-text-faint);
  font-size: 13px;
}
</style>
