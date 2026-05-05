<template>
  <footer class="bg-ink pt-14">
    <div class="wrap">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">

        <!-- Brand -->
        <div>
          <NuxtLink to="/" class="flex items-center gap-2.5 mb-4">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span class="text-white font-bold text-sm font-display">SW</span>
            </div>
            <div>
              <p class="text-sm font-bold text-white leading-none mb-1">SWM Nutrition</p>
              <p class="text-[10px] text-muted leading-none">Your Wellness Partner</p>
            </div>
          </NuxtLink>
          <p class="text-[13.5px] text-muted leading-relaxed mb-5">
            Professional nutritional consultancy services based in Nairobi, Kenya. Transforming lives through personalized nutrition and wellness solutions.
          </p>
          <div class="flex gap-2">
            <a v-for="s in SOCIALS" :key="s.l" href="#" :aria-label="s.l"
              class="w-8 h-8 rounded-full border border-ink-2 flex items-center justify-center text-muted hover:border-primary hover:text-green-400 transition-all duration-200"
              v-html="s.i" />
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-[12px] font-bold text-white uppercase tracking-widest mb-4">Quick Links</h4>
          <div class="space-y-2.5">
            <NuxtLink to="/"          class="foot-link block">Home</NuxtLink>
            <NuxtLink to="/about"     class="foot-link block">About</NuxtLink>
            <NuxtLink to="/services"  class="foot-link block">Services</NuxtLink>
            <NuxtLink to="/blog"      class="foot-link block">Blog</NuxtLink>
            <NuxtLink to="/shop"      class="foot-link block">Shop</NuxtLink>
            <NuxtLink to="/contact"   class="foot-link block">Contact</NuxtLink>
          </div>
        </div>

        <!-- Services -->
        <div>
          <h4 class="text-[12px] font-bold text-white uppercase tracking-widest mb-4">Our Services</h4>
          <div class="space-y-2.5">
            <NuxtLink v-for="s in SVCS" :key="s" to="/services" class="foot-link block">{{ s }}</NuxtLink>
          </div>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-[12px] font-bold text-white uppercase tracking-widest mb-4">Contact Us</h4>
          <div class="space-y-3.5">
            <div class="flex items-start gap-2.5">
              <svg class="text-primary mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <p class="text-muted text-[13.5px] leading-relaxed">Nairobi, Kenya</p>
            </div>
            <div class="flex items-start gap-2.5">
              <svg class="text-primary mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72 19.79 19.79 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.05 6.05l1.79-1.79a2 2 0 0 1 2.11-.45 19.79 19.79 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div class="text-muted text-[13.5px]">
                <p>+254 7XXX XXX</p>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <svg class="text-primary mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <p class="text-muted text-[13.5px]">info@XXX</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-ink-2">
      <div class="wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-[#475569] text-xs">© 2026 SWM Nutrition. All rights reserved. Individually owned and operated.</p>
        <div class="flex gap-5">
          <a href="#" class="text-[#475569] text-xs hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="text-[#475569] text-xs hover:text-white transition-colors">Terms of Service</a>
          <a href="#" class="text-[#475569] text-xs hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const SOCIALS = [
  { l:'Facebook',  i:`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>` },
  { l:'Instagram', i:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>` },
  { l:'Twitter',   i:`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  { l:'LinkedIn',  i:`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>` },
]
const SVCS = ['Nutrition Consultation','Meal Planning','Weight Management','Sports Nutrition','Wellness Programs']
</script>
