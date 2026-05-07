<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const admin = useAdminStore()

const password = ref('')
const error = ref('')
const loading = ref(false)

function submit(e: Event) {
  e.preventDefault()
  error.value = ''
  loading.value = true
  const ok = admin.login(password.value)
  loading.value = false
  if (ok) {
    router.replace('/')
  } else {
    error.value = 'Contraseña incorrecta'
  }
}
</script>

<template>
  <div class="admin-root login-view">
    <form class="login-card" @submit="submit">
      <div class="brand">
        <div class="brand__mark">A&amp;M</div>
        <div class="brand__name">ANDERSSON &amp; MONI</div>
      </div>
      <h1>Hemeroteca</h1>
      <p>Acceso restringido. Ingresa la contraseña del archivo.</p>

      <label class="field">
        <span>Contraseña</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          autofocus
        />
      </label>

      <div v-if="error" class="error">{{ error }}</div>

      <button type="submit" class="btn-primary" :disabled="loading || !password">
        {{ loading ? 'Verificando…' : 'Entrar' }}
      </button>

      <RouterLink to="/media-kit" class="back">← Ver media kit público</RouterLink>
    </form>
  </div>
</template>

<style scoped lang="scss">
.login-view {
  display: grid;
  place-items: center;
  padding: 40px 16px;
}
.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--ad-panel);
  border: 1px solid var(--ad-border);
  border-radius: 14px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}
.brand__mark {
  font-family: 'Times New Roman', serif;
  font-size: 36px;
}
.brand__name {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--ad-text-dim);
}
h1 {
  font-family: 'Times New Roman', serif;
  font-weight: 600;
  font-size: 28px;
  letter-spacing: -0.01em;
  margin: 0;
}
p {
  color: var(--ad-text-dim);
  font-size: 13px;
  margin: 0 0 8px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field span {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ad-text-faint);
}
.field input {
  background: var(--ad-bg-2);
  border: 1px solid var(--ad-border-strong);
  color: var(--ad-text);
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}
.field input:focus { border-color: var(--ad-accent); }

.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.btn-primary {
  margin-top: 4px;
  padding: 12px 20px;
  background: var(--ad-accent);
  color: #fff;
  border: 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: opacity 0.15s, background 0.15s;
}
.btn-primary:hover:not(:disabled) { background: #b91c1c; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.back {
  display: block;
  text-align: center;
  font-size: 12px;
  color: var(--ad-text-dim);
  text-decoration: none;
  margin-top: 4px;
}
.back:hover { color: var(--ad-text); }
</style>
