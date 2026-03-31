<template>
  <footer class="bg-[#0f172a]">
    <div class="wrap py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- Brand -->
        <div>
          <NuxtLink to="/" class="flex items-center gap-2.5 mb-5">
            <div class="w-10 h-10 rounded-[10px] bg-[#1a7a4a] flex items-center justify-center shrink-0">
              <span class="text-white text-sm font-extrabold">SW</span>
            </div>
            <div class="leading-tight">
              <p class="text-sm font-bold text-white">SWM Nutrition</p>
              <p class="text-[11px] text-[#94a3b8]">Your Wellness Partner</p>
            </div>
          </NuxtLink>
          <p class="text-[13px] text-[#94a3b8] leading-relaxed mb-5">
            Professional nutritional consultancy services based in Nairobi, Kenya. Transforming lives through personalized nutrition and wellness solutions.
          </p>
          <div class="flex gap-2">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              :aria-label="s.label"
              class="w-9 h-9 rounded-full border border-[#334155] flex items-center justify-center text-[#94a3b8] hover:border-[#1a7a4a] hover:text-[#1a7a4a] transition-all duration-200"
            >
              <span class="w-4 h-4 block" v-html="s.svg" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h5 class="text-sm font-bold text-white mb-4">Quick Links</h5>
          <ul class="space-y-2.5">
            <li v-for="l in footerLinks" :key="l.to">
              <NuxtLink :to="l.to" class="foot-a">{{ l.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Our Services -->
        <div>
          <h5 class="text-sm font-bold text-white mb-4">Our Services</h5>
          <ul class="space-y-2.5">
            <li v-for="s in footerServices" :key="s">
              <NuxtLink to="/services" class="foot-a">{{ s }}</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Us -->
        <div>
          <h5 class="text-sm font-bold text-white mb-4">Contact Us</h5>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#1a7a4a]/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <div>
                <p class="text-[13px] text-[#94a3b8]">{{ contactInfo.address }}</p>
                <p class="text-[13px] text-[#94a3b8]">{{ contactInfo.area }}</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#1a7a4a]/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.05 6.05l1.79-1.79a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <p v-for="p in contactInfo.phones" :key="p" class="text-[13px] text-[#94a3b8]">{{ p }}</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#1a7a4a]/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <span class="text-[13px] text-[#94a3b8]">{{ contactInfo.emails[0] }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-[#1e293b]">
      <div class="wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-[12px] text-[#475569]">© 2026 SWM Nutrition. All rights reserved. Individually owned and operated.</p>
        <div class="flex gap-5">
          <a href="#" class="text-[12px] text-[#475569] hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="text-[12px] text-[#475569] hover:text-white transition-colors">Terms of Service</a>
          <a href="#" class="text-[12px] text-[#475569] hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { footerLinks, footerServices, socials, contactInfo } = useSiteData()
</script>