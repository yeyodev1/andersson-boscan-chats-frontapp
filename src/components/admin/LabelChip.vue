<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string
  variant?: 'label' | 'status' | 'importance'
  tone?: string
}
const props = withDefaults(defineProps<Props>(), { variant: 'label' })

const cls = computed(() => {
  const t = (props.tone || props.text || '').toLowerCase()
  if (props.variant === 'importance') {
    if (t.startsWith('alta')) return 'chip chip--alta'
    if (t.startsWith('media')) return 'chip chip--media'
    return 'chip chip--baja'
  }
  if (props.variant === 'status') {
    if (t.includes('investigan')) return 'chip chip--investigando'
    if (t.includes('verifican')) return 'chip chip--verificando'
    if (t.includes('document')) return 'chip chip--documentado'
    return 'chip chip--por-publicar'
  }
  // label
  const map: Record<string, string> = {
    AMENAZA: 'chip--amenaza',
    SPAM: 'chip--spam',
    FUENTE: 'chip--fuente',
    PRENSA: 'chip--prensa',
    PRUEBA_VIDA: 'chip--prueba',
    COLABORACION: 'chip--colab',
    PROYECTO: 'chip--proyecto',
    FAN: 'chip--fan',
    OPINION: 'chip--opinion',
    ESTUDIANTE: 'chip--estudiante',
    VENEZOLANO: 'chip--ven',
    OTRO: 'chip--otro',
  }
  return `chip ${map[props.text] || 'chip--otro'}`
})
</script>

<template>
  <span :class="cls">{{ text }}</span>
</template>

<style scoped lang="scss">
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(232, 226, 211, 0.78);
  white-space: nowrap;
}
.chip--amenaza, .chip--spam {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
}
.chip--fuente, .chip--prensa, .chip--prueba {
  color: #fcd34d;
  background: rgba(250, 204, 21, 0.1);
  border-color: rgba(250, 204, 21, 0.28);
}
.chip--colab, .chip--proyecto {
  color: #a5f3fc;
  background: rgba(34, 211, 238, 0.1);
  border-color: rgba(34, 211, 238, 0.28);
}
.chip--fan, .chip--opinion, .chip--estudiante, .chip--ven, .chip--otro {
  color: rgba(232, 226, 211, 0.7);
}

.chip--alta { color: #f87171; }
.chip--alta::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }
.chip--media { color: #fbbf24; }
.chip--media::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; }
.chip--baja { color: #4ade80; }
.chip--baja::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }

.chip--investigando {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}
.chip--verificando {
  color: #fcd34d;
  background: rgba(250, 204, 21, 0.1);
  border-color: rgba(250, 204, 21, 0.28);
}
.chip--documentado {
  color: #c9a84c;
  background: rgba(201, 168, 76, 0.12);
  border-color: rgba(201, 168, 76, 0.3);
}
.chip--por-publicar {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.28);
}
</style>
