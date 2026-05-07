<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'

const route = useRoute()
const search = ref('')

const sectionTitle = computed(() => {
  const map: Record<string, string> = {
    '/': 'HEMEROTECA',
    '/conversaciones': 'CONVERSACIONES',
    '/fuentes': 'FUENTES',
    '/etiquetas': 'ETIQUETAS',
  }
  return map[route.path] || 'HEMEROTECA'
})
</script>

<template>
  <div class="admin-root">
    <div class="admin-shell">
      <AdminSidebar />
      <div class="admin-main">
        <AdminTopbar :section="sectionTitle" v-model="search" />
        <main class="admin-content">
          <RouterView :search="search" />
        </main>
      </div>
    </div>
  </div>
</template>
