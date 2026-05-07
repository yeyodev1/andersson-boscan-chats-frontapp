<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

interface Item {
  label: string
  to?: string
  icon: string
  disabled?: boolean
}

const items: Item[] = [
  { label: 'Hemeroteca', to: '/', icon: '▦' },
  { label: 'Conversaciones', to: '/conversaciones', icon: '◉' },
  { label: 'Documentos', icon: '▤', disabled: true },
  { label: 'Grabaciones', icon: '◌', disabled: true },
  { label: 'Denuncias', icon: '!', disabled: true },
  { label: 'Fuentes', to: '/fuentes', icon: '◐' },
  { label: 'Etiquetas', to: '/etiquetas', icon: '#' },
  { label: 'Informes', icon: '▥', disabled: true },
  { label: 'Calendario', icon: '▣', disabled: true },
  { label: 'Papelera', icon: '×', disabled: true },
]

const router = useRouter()
const route = useRoute()
const admin = useAdminStore()

function isActive(to?: string) {
  if (!to) return false
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function logout() {
  admin.logout()
  router.replace('/login')
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <div class="brand-mark">A&amp;M</div>
      <div class="brand-name">ANDERSSON &amp; MONI</div>
    </div>

    <nav class="sidebar__nav">
      <button
        v-for="(item, i) in items"
        :key="i"
        class="nav-item"
        :class="{ 'nav-item--active': isActive(item.to), 'nav-item--disabled': item.disabled }"
        :disabled="item.disabled"
        @click="item.to && router.push(item.to)"
      >
        <span class="nav-item__icon">{{ item.icon }}</span>
        <span class="nav-item__label">{{ item.label }}</span>
        <span v-if="item.disabled" class="nav-item__soon">pronto</span>
      </button>
    </nav>

    <div class="sidebar__section">SEGURIDAD</div>
    <div class="sidebar__cipher">
      <span class="cipher-icon">⚿</span>
      <div>
        <div class="cipher-title">Archivo cifrado</div>
        <div class="cipher-sub">Sincronizado</div>
      </div>
      <span class="cipher-dot" />
    </div>

    <div class="sidebar__user" @click="logout" title="Cerrar sesión">
      <div class="avatar">A&amp;M</div>
      <div>
        <div class="user-name">Andersson &amp; Moni</div>
        <div class="user-meta">Toronto, Canadá 🇨🇦</div>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  background: var(--ad-bg-2);
  border-right: 1px solid var(--ad-border);
  display: flex;
  flex-direction: column;
  padding: 18px 14px;
  gap: 6px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar__brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 6px 8px 18px;
  gap: 4px;
}
.brand-mark {
  font-family: 'Times New Roman', serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.brand-mark::after {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  background: var(--ad-border-strong);
  margin-top: 6px;
}
.brand-name {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: var(--ad-text-dim);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 10px;
}

.nav-item {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--ad-text-dim);
  font-size: 14px;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.04);
  color: var(--ad-text);
}
.nav-item--active {
  background: rgba(214, 40, 40, 0.12);
  color: var(--ad-accent);
  border-left: 2px solid var(--ad-accent);
  padding-left: 10px;
}
.nav-item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.nav-item__icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
  opacity: 0.85;
}
.nav-item__label { flex: 1; }
.nav-item__soon {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ad-text-faint);
  border: 1px solid var(--ad-border-strong);
  padding: 1px 6px;
  border-radius: 999px;
}

.sidebar__section {
  margin-top: 18px;
  padding: 0 12px;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ad-text-faint);
}
.sidebar__cipher {
  margin-top: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  font-size: 12px;
}
.cipher-icon { font-size: 16px; opacity: 0.8; }
.cipher-title { font-size: 13px; color: var(--ad-text); }
.cipher-sub { font-size: 11px; color: var(--ad-text-faint); }
.cipher-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ad-success);
  margin-left: auto;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
}

.sidebar__user {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid var(--ad-border);
  cursor: pointer;
}
.sidebar__user:hover { background: rgba(255, 255, 255, 0.03); }
.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: grid; place-items: center;
  background: var(--ad-panel-2);
  border: 1px solid var(--ad-border-strong);
  font-family: 'Times New Roman', serif;
  font-size: 13px;
}
.user-name { font-size: 13px; }
.user-meta { font-size: 11px; color: var(--ad-text-faint); }
</style>
