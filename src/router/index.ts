import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const BASE_TITLE = 'Andersson & Moni — Hemeroteca'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/LoginView.vue'),
    meta: {
      title: `Acceso — ${BASE_TITLE}`,
      description: 'Acceso restringido al archivo de investigaciones.',
    },
  },
  {
    path: '/',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'Hemeroteca',
        component: () => import('../views/admin/HemerotecaView.vue'),
        meta: { title: `Hemeroteca — ${BASE_TITLE}` },
      },
      {
        path: 'conversaciones',
        name: 'Conversaciones',
        component: () => import('../views/admin/ConversacionesView.vue'),
        meta: { title: `Conversaciones — ${BASE_TITLE}` },
      },
      {
        path: 'fuentes',
        name: 'Fuentes',
        component: () => import('../views/admin/FuentesView.vue'),
        meta: { title: `Fuentes — ${BASE_TITLE}` },
      },
      {
        path: 'etiquetas',
        name: 'Etiquetas',
        component: () => import('../views/admin/EtiquetasView.vue'),
        meta: { title: `Etiquetas — ${BASE_TITLE}` },
      },
    ],
  },
  {
    path: '/media-kit',
    name: 'MediaKit',
    component: () => import('../views/MediaKitView.vue'),
    meta: {
      title: `Media Kit 2026 — Andersson y Moni Boscán | Periodismo Digital LATAM`,
      description: 'Media Kit oficial de Andersson y Moni Boscán. 88.7M impresiones mensuales, 910K seguidores TikTok, programa noticioso más viral de LATAM.',
    },
  },
  {
    path: '/quienes-somos',
    name: 'QuienesSomos',
    component: () => import('../views/QuienesSomosView.vue'),
    meta: {
      title: `Quiénes somos — Andersson y Moni Boscán | Media Kit 2026`,
      description: 'Conoce a Andersson Boscán y Mónica Velásquez — el equipo detrás del programa noticioso más viral de LATAM.',
    },
  },
  {
    path: '/precios',
    name: 'Precios',
    component: () => import('../views/PreciosView.vue'),
    meta: {
      title: `Tarifas 2026 — Andersson y Moni Boscán | Media Kit`,
      description: 'Tabla de tarifas y formatos de pauta de Andersson y Moni Boscán.',
    },
  },
  {
    path: '/agendar',
    name: 'Agendar',
    component: () => import('../views/AgendarView.vue'),
    meta: {
      title: `Agenda tu llamada — Andersson y Moni Boscán | Media Kit 2026`,
      description: 'Agenda tu llamada estratégica con el equipo de Andersson y Moni Boscán.',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: `404 — Página no encontrada | ${BASE_TITLE}`,
      description: 'La página que buscas no existe.',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
  const title = to.meta?.title as string | undefined
  if (title) document.title = title

  const desc = to.meta?.description as string | undefined
  if (desc) {
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', desc)
  }

  const requiresAdmin = to.matched.some((r) => r.meta?.requiresAdmin)
  const admin = useAdminStore()
  if (!admin.isAuthenticated) admin.hydrate()

  if (requiresAdmin && !admin.isAuthenticated) {
    return next({ path: '/login', replace: true })
  }

  if (to.path === '/login' && admin.isAuthenticated) {
    return next({ path: '/', replace: true })
  }

  next()
})

export default router
