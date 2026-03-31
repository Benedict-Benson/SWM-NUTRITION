<template>
  <header
    class="fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300"
    :class="scrolled ? 'shadow-nav' : 'border-b border-[#e2e8f0]'"
  >
    <div class="wrap">
      <div class="flex items-center justify-between h-[68px]">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0">
          <div class="w-9 h-9 rounded-[10px] bg-[#1a7a4a] flex items-center justify-center shrink-0 shadow-sm">
            <span class="text-white text-[11px] font-extrabold tracking-tight leading-none">SW</span>
          </div>
          <div class="leading-tight">
            <p class="text-[13.5px] font-bold text-[#0f172a] leading-snug">SWM Nutrition</p>
            <p class="text-[10.5px] text-[#64748b]">Your Wellness Partner</p>
          </div>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="nav-a"
            :class="{ active: route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to)) }"
          >{{ item.label }}</NuxtLink>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-2">
          <!-- Cart -->
          <NuxtLink
            to="/cart"
            class="hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#64748b] hover:border-[#1a7a4a] hover:text-[#1a7a4a] hover:bg-[#e8f5ee] transition-all duration-200 relative"
            aria-label="Cart"
          >
            <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-[#1a7a4a] rounded-full text-white text-[9px] font-bold flex items-center justify-center">{{ cartCount }}</span>
          </NuxtLink>

          <!-- Account dropdown (logged in) -->
          <div v-if="user" class="relative hidden md:block" ref="dropdownRef">
            <button
              class="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[#e2e8f0] hover:border-[#1a7a4a] hover:bg-[#e8f5ee] transition-all duration-200"
              @click="dropdownOpen = !dropdownOpen"
            >
              <div class="w-7 h-7 rounded-full bg-[#1a7a4a] flex items-center justify-center text-white text-xs font-bold">
                {{ userInitial }}
              </div>
              <span class="text-sm font-medium text-[#0f172a] max-w-[80px] truncate">{{ firstName }}</span>
              <svg class="w-3.5 h-3.5 text-[#64748b] transition-transform" :class="dropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <!-- Dropdown menu -->
            <Transition name="dropdown">
              <div v-if="dropdownOpen" class="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-[#e2e8f0] overflow-hidden">
                <!-- User info -->
                <div class="px-4 py-3 border-b border-[#f1f5f9]">
                  <p class="text-sm font-semibold text-[#0f172a] truncate">{{ fullName }}</p>
                  <p class="text-xs text-[#94a3b8] truncate">{{ user.email }}</p>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5ee] text-[#1a7a4a] capitalize mt-1 inline-block">{{ userRole }}</span>
                </div>

                <!-- Admin link -->
                <NuxtLink
                  v-if="userRole === 'admin' || userRole === 'staff'"
                  to="/admin"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
                  @click="dropdownOpen = false"
                >
                  <svg class="w-4 h-4 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Admin Dashboard
                </NuxtLink>

                <NuxtLink to="/account/profile" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0f172a] hover:bg-[#f8fafc] transition-colors" @click="dropdownOpen = false">
                  <svg class="w-4 h-4 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
                  My Profile
                </NuxtLink>

                <NuxtLink to="/account/orders" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0f172a] hover:bg-[#f8fafc] transition-colors" @click="dropdownOpen = false">
                  <svg class="w-4 h-4 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  My Orders
                </NuxtLink>

                <NuxtLink to="/account/appointments" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0f172a] hover:bg-[#f8fafc] transition-colors" @click="dropdownOpen = false">
                  <svg class="w-4 h-4 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  My Appointments
                </NuxtLink>

                <div class="border-t border-[#f1f5f9]">
                  <button class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors" @click="signOut">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Book Now (not logged in) -->
          <NuxtLink v-if="!user" to="/services" class="btn btn-primary btn-sm hidden md:inline-flex gap-1.5">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            Book Now
          </NuxtLink>

          <!-- Login (not logged in) -->
          <NuxtLink v-if="!user" to="/login" class="btn btn-outline btn-sm hidden md:inline-flex">
            Sign In
          </NuxtLink>

          <!-- Hamburger -->
          <button
            class="md:hidden flex w-9 h-9 items-center justify-center rounded-lg border border-[#e2e8f0]"
            @click="mobileOpen = !mobileOpen"
          >
            <svg v-if="!mobileOpen" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide">
      <div v-if="mobileOpen" class="md:hidden bg-white border-t border-[#e2e8f0] shadow-nav">
        <div class="wrap py-4 flex flex-col gap-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center py-2.5 px-3 rounded-xl text-sm font-medium text-[#1e293b] hover:bg-[#e8f5ee] hover:text-[#1a7a4a] transition-colors"
            :class="(route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to))) ? 'bg-[#e8f5ee] text-[#1a7a4a]' : ''"
            @click="mobileOpen = false"
          >{{ item.label }}</NuxtLink>

          <div class="pt-3 border-t border-[#e2e8f0] mt-2 flex flex-col gap-2">
            <template v-if="user">
              <NuxtLink v-if="userRole === 'admin' || userRole === 'staff'" to="/admin" class="btn btn-outline btn-full" @click="mobileOpen = false">Admin Dashboard</NuxtLink>
              <NuxtLink to="/account/profile" class="btn btn-outline btn-full" @click="mobileOpen = false">My Profile</NuxtLink>
              <NuxtLink to="/account/orders" class="btn btn-outline btn-full" @click="mobileOpen = false">My Orders</NuxtLink>
              <NuxtLink to="/account/appointments" class="btn btn-outline btn-full" @click="mobileOpen = false">My Appointments</NuxtLink>
              <button class="btn btn-full text-red-500 border border-red-200" @click="signOut">Sign Out</button>
            </template>
            <template v-else>
              <NuxtLink to="/services" class="btn btn-primary btn-full" @click="mobileOpen = false">Book Consultation</NuxtLink>
              <NuxtLink to="/login" class="btn btn-outline btn-full" @click="mobileOpen = false">Sign In</NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </header>
  <div class="h-[68px]" aria-hidden="true" />
</template>

<script setup lang="ts">
const route    = useRoute()
const router   = useRouter()
const supabase = useSupabaseClient()
const { nav }  = useSiteData()

const scrolled     = ref(false)
const mobileOpen   = ref(false)
const dropdownOpen = ref(false)
const cartCount    = ref(0)
const dropdownRef  = ref<HTMLElement>()

const user     = ref<any>(null)
const fullName = ref('')
const userRole = ref('')

const firstName   = computed(() => fullName.value.split(' ')[0] || user.value?.email?.split('@')[0] || 'Account')
const userInitial = computed(() => (fullName.value || user.value?.email || 'A').charAt(0).toUpperCase())

// Load session
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) await loadProfile(session.user)

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      await loadProfile(session.user)
    } else {
      user.value     = null
      fullName.value = ''
      userRole.value = ''
    }
  })

  // Scroll listener
  const fn = () => { scrolled.value = window.scrollY > 8 }
  window.addEventListener('scroll', fn, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', fn))

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      dropdownOpen.value = false
    }
  })
})

async function loadProfile(authUser: any) {
  user.value = authUser
  const { data } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', authUser.id)
    .single()
  if (data) {
    fullName.value = data.full_name ?? ''
    userRole.value = data.role      ?? 'client'
  }
}

async function signOut() {
  await supabase.auth.signOut()
  dropdownOpen.value = false
  mobileOpen.value   = false
  router.push('/')
}

watch(() => route.path, () => {
  mobileOpen.value   = false
  dropdownOpen.value = false
})
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s, transform 0.15s; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>