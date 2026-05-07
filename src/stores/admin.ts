import { defineStore } from 'pinia'

const STORAGE_KEY = 'am_admin'

interface AdminState {
  isAuthenticated: boolean
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    isAuthenticated: false,
  }),

  actions: {
    hydrate() {
      try {
        this.isAuthenticated = localStorage.getItem(STORAGE_KEY) === '1'
      } catch {
        this.isAuthenticated = false
      }
    },

    login(password: string): boolean {
      const expected = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || ''
      if (!expected) {
        console.warn('[admin] VITE_ADMIN_PASSWORD no definido')
        return false
      }
      if (password === expected) {
        this.isAuthenticated = true
        try {
          localStorage.setItem(STORAGE_KEY, '1')
        } catch {}
        return true
      }
      return false
    },

    logout() {
      this.isAuthenticated = false
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {}
    },
  },
})
