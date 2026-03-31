<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300"
    :class="scrolled ? 'shadow-nav' : 'border-b border-border'">
    <div class="wrap">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0">
          <div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span class="text-white text-[11px] font-bold font-display leading-none tracking-wide">SW</span>
          </div>
          <div class="leading-none">
            <p class="text-[13px] font-bold text-ink leading-none mb-1">SWM Nutrition</p>
            <p class="text-[10px] text-muted leading-none">Your Wellness Partner</p>
          </div>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-7">
          <NuxtLink v-for="l in LINKS" :key="l.to" :to="l.to"
            class="nl" :class="{ on: l.to === '/' ? r.path === '/' : r.path.startsWith(l.to) }">
            {{ l.label }}
          </NuxtLink>
        </nav>

        <!-- Right -->
        <div class="flex items-center gap-2">
          <NuxtLink to="/shop" class="hidden md:flex btn btn-icon btn-outline border-border" aria-label="Cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </NuxtLink>
          <NuxtLink to="/contact" class="btn btn-primary btn-sm hidden md:inline-flex">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Book Now
          </NuxtLink>
          <!-- Hamburger -->
          <button class="md:hidden p-2 text-body hover:text-primary transition-colors"
            @click="open = !open" aria-label="Toggle menu">
            <svg v-if="!open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div v-if="open" class="md:hidden bg-white border-t border-border shadow-lg">
        <div class="wrap py-4 space-y-1">
          <NuxtLink v-for="l in LINKS" :key="l.to" :to="l.to"
            class="block px-3 py-2.5 rounded-lg text-sm font-medium text-body hover:bg-pri-pale hover:text-primary transition-colors"
            :class="{ 'bg-pri-pale text-primary': l.to === '/' ? r.path === '/' : r.path.startsWith(l.to) }"
            @click="open = false">
            {{ l.label }}
          </NuxtLink>
          <div class="pt-2 border-t border-border">
            <NuxtLink to="/contact" class="btn btn-primary w-full justify-center mt-1" @click="open = false">
              Book Consultation
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
  <div class="h-16" />
</template>

<script setup>
const r = useRoute()
const scrolled = ref(false)
const open = ref(false)

const LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'About',    to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Blog',     to: '/blog' },
  { label: 'Shop',     to: '/shop' },
  { label: 'Contact',  to: '/contact' },
]

onMounted(() => {
  const fn = () => { scrolled.value = window.scrollY > 10 }
  window.addEventListener('scroll', fn, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', fn))
})
watch(() => r.path, () => { open.value = false })
</script>
