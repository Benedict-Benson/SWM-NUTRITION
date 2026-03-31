<template>
  <div class="min-h-screen bg-[#f8fafc] flex flex-col">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-30 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Top bar -->
    <header class="bg-white border-b border-[#e2e8f0] px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-sm">
      <div class="flex items-center gap-3">
        <!-- Hamburger (mobile) -->
        <button class="lg:hidden p-1.5 rounded-lg hover:bg-[#f1f5f9]" @click="sidebarOpen = !sidebarOpen">
          <svg class="w-5 h-5 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <NuxtLink to="/admin" class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#1a7a4a] flex items-center justify-center">
            <span class="text-white text-[10px] font-extrabold leading-none">SW</span>
          </div>
          <span class="font-bold text-[#0f172a] text-sm hidden sm:block">SWM Admin</span>
        </NuxtLink>
        <span class="text-[#e2e8f0] hidden sm:block">|</span>
        <span class="text-sm text-[#64748b] hidden sm:block capitalize">{{ currentPage }}</span>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink to="/" target="_blank" class="btn btn-outline btn-sm hidden sm:inline-flex gap-1.5">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Live Site
        </NuxtLink>
        <button class="btn btn-outline btn-sm" @click="signOut">Sign Out</button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar (desktop) -->
      <aside class="w-56 shrink-0 bg-white border-r border-[#e2e8f0] hidden lg:flex flex-col">
        <nav class="p-3 space-y-0.5 flex-1 overflow-y-auto">
          <NuxtLink
            v-for="item in sideNav" :key="item.to" :to="item.to"
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-[#e8f5ee] text-[#1a7a4a]' : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'"
          >
            <span class="w-4 h-4 shrink-0" v-html="item.icon" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="p-3 border-t border-[#e2e8f0]">
          <div class="flex items-center gap-2.5 px-3 py-2">
            <div class="w-7 h-7 rounded-full bg-[#1a7a4a] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {{ adminInitial }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-[#0f172a] truncate">{{ adminName }}</p>
              <p class="text-[10px] text-[#64748b] capitalize">{{ adminRole }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Sidebar (mobile drawer) -->
      <aside
        class="fixed top-0 left-0 h-full w-64 bg-white border-r border-[#e2e8f0] z-40 flex flex-col transition-transform duration-200 lg:hidden"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="h-16 flex items-center px-4 border-b border-[#e2e8f0] gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#1a7a4a] flex items-center justify-center">
            <span class="text-white text-[10px] font-extrabold">SW</span>
          </div>
          <span class="font-bold text-[#0f172a]">SWM Admin</span>
          <button class="ml-auto p-1.5 rounded-lg hover:bg-[#f1f5f9]" @click="sidebarOpen = false">
            <svg class="w-4 h-4 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav class="p-3 space-y-0.5 flex-1 overflow-y-auto">
          <NuxtLink
            v-for="item in sideNav" :key="item.to" :to="item.to"
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-[#e8f5ee] text-[#1a7a4a]' : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'"
            @click="sidebarOpen = false"
          >
            <span class="w-4 h-4 shrink-0" v-html="item.icon" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="p-3 border-t border-[#e2e8f0]">
          <div class="flex items-center gap-2.5 px-3 py-2">
            <div class="w-7 h-7 rounded-full bg-[#1a7a4a] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {{ adminInitial }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-[#0f172a] truncate">{{ adminName }}</p>
              <p class="text-[10px] text-[#64748b] capitalize">{{ adminRole }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-4 sm:p-6 max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route        = useRoute()
const supabase     = useSupabaseClient()
const adminName    = ref('Admin')
const adminRole    = ref('admin')
const sidebarOpen  = ref(false)
const adminInitial = computed(() => adminName.value.charAt(0).toUpperCase())

const currentPage = computed(() => {
  const seg = route.path.split('/').filter(Boolean).pop() ?? ''
  const map: Record<string, string> = {
    admin: 'Dashboard', orders: 'Orders', appointments: 'Appointments',
    messages: 'Messages', products: 'Products', posts: 'Blog Posts',
    clients: 'Clients', chat: 'Chat Support',
  }
  return map[seg] ?? seg
})

// Close sidebar on route change
watch(() => route.path, () => { sidebarOpen.value = false })

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { data } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', session.user.id)
    .single()
  if (data) {
    adminName.value = data.full_name ?? session.user.email ?? 'Admin'
    adminRole.value = data.role
  }
})

async function signOut() {
  await supabase.auth.signOut()
  navigateTo('/login')
}

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

const icon = (d: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${d}</svg>`

const sideNav = [
  { label: 'Dashboard',    to: '/admin',              icon: icon('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>') },
  { label: 'Orders',       to: '/admin/orders',       icon: icon('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>') },
  { label: 'Products',     to: '/admin/products',     icon: icon('<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>') },
  { label: 'Appointments', to: '/admin/appointments', icon: icon('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>') },
  { label: 'Blog Posts',   to: '/admin/posts',        icon: icon('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>') },
  { label: 'Messages',     to: '/admin/messages',     icon: icon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>') },
  { label: 'Clients',      to: '/admin/clients',      icon: icon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>') },
  { label: 'Chat Support', to: '/admin/chat',         icon: icon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>') },
]
</script>