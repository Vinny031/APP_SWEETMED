/**
 * Configuration du router Vue Router 4
 * Navigation entre les 4 onglets principaux + vue détail remède + auth + admin.
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authService } from '@/services/authService'

// Augmentation du type RouteMeta pour TypeScript strict
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    requiresAdmin?: boolean
    showTabBar?: boolean
  }
}

// Lazy loading des vues pour optimiser le bundle initial
const routes: RouteRecordRaw[] = [
  // ── Auth (publique) ──────────────────────────────────────────
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { title: 'Connexion', showTabBar: false },
  },

  // ── App (protégées) ──────────────────────────────────────────
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Accueil', requiresAuth: true, showTabBar: true },
  },
  {
    path: '/explorer',
    name: 'explorer',
    component: () => import('@/views/ExploreView.vue'),
    meta: { title: 'Explorer', requiresAuth: true, showTabBar: true },
  },
  {
    path: '/remede/:id',
    name: 'remede-detail',
    component: () => import('@/views/RemedeDetailView.vue'),
    meta: { title: 'Détail', requiresAuth: true, showTabBar: false },
    props: true,
  },
  {
    path: '/favoris',
    name: 'favoris',
    component: () => import('@/views/FavoritesView.vue'),
    meta: { title: 'Mes Favoris', requiresAuth: true, showTabBar: true },
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Mon Profil', requiresAuth: true, showTabBar: true },
  },

  // ── Admin (protégées + rôle admin) ───────────────────────────
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { title: 'Administration', requiresAuth: true, requiresAdmin: true, showTabBar: false },
  },
  {
    path: '/admin/remedes',
    name: 'admin-remedes',
    component: () => import('@/views/admin/AdminRemedесView.vue'),
    meta: { title: 'Gérer les remèdes', requiresAuth: true, requiresAdmin: true, showTabBar: false },
  },
  {
    path: '/admin/remedes/nouveau',
    name: 'admin-remede-nouveau',
    component: () => import('@/views/admin/AdminRemedeFormView.vue'),
    meta: { title: 'Nouveau remède', requiresAuth: true, requiresAdmin: true, showTabBar: false },
  },
  {
    path: '/admin/remedes/:id/modifier',
    name: 'admin-remede-modifier',
    component: () => import('@/views/admin/AdminRemedeFormView.vue'),
    meta: { title: 'Modifier le remède', requiresAuth: true, requiresAdmin: true, showTabBar: false },
    props: true,
  },
  {
    path: '/admin/categories',
    name: 'admin-categories',
    component: () => import('@/views/admin/AdminCategoriesView.vue'),
    meta: { title: 'Gérer les catégories', requiresAuth: true, requiresAdmin: true, showTabBar: false },
  },
  {
    path: '/admin/categories/nouvelle',
    name: 'admin-categorie-nouvelle',
    component: () => import('@/views/admin/AdminCategorieFormView.vue'),
    meta: { title: 'Nouvelle catégorie', requiresAuth: true, requiresAdmin: true, showTabBar: false },
  },
  {
    path: '/admin/categories/:id/modifier',
    name: 'admin-categorie-modifier',
    component: () => import('@/views/admin/AdminCategorieFormView.vue'),
    meta: { title: 'Modifier la catégorie', requiresAuth: true, requiresAdmin: true, showTabBar: false },
    props: true,
  },

  // Redirection 404 → accueil
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  // Hash history compatible avec Capacitor (pas de server-side routing)
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

// ── Guard de navigation ──────────────────────────────────────────
router.beforeEach((to) => {
  const session = authService.getCurrentSession()

  // Redirige vers /auth si non connecté
  if (to.meta.requiresAuth && !session) {
    return { name: 'auth' }
  }

  // Redirige vers / si connecté mais pas admin
  if (to.meta.requiresAdmin && session?.role !== 'admin') {
    return { name: 'home' }
  }

  // Redirige les utilisateurs connectés hors de /auth
  if (to.name === 'auth' && session) {
    return { name: 'home' }
  }
})

// Mise à jour du titre de page
router.afterEach((to) => {
  const titre = to.meta.title as string | undefined
  document.title = titre ? `${titre} — SWEET MED` : 'SWEET MED'
})

export default router
