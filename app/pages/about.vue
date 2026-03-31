<template>
  <div>
    <!-- PAGE HERO -->
    <div class="page-hero">
      <div class="wrap">
        <h1 class="h1 reveal">About SWM Nutrition</h1>
        <p class="body-sm text-[#64748b] mt-3 reveal" style="--d:80ms">Your trusted partner in achieving optimal health through evidence-based nutrition</p>
      </div>
    </div>

    <!-- ════════════ OUR STORY ════════════ -->
    <section class="section bg-white">
      <div class="wrap">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <!-- Left: 2-image collage with "Based in" chip -->
          <div class="relative reveal">
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-2xl overflow-hidden shadow-card aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1609197100049-373be8d93f56?w=500&q=85&auto=format&fit=crop"
                  alt="SWM Nutrition - local farming"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="rounded-2xl overflow-hidden shadow-card aspect-[3/4] mt-10">
                <img
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=85&auto=format&fit=crop"
                  alt="Healthy meal prep"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <!-- Based in chip -->
            <div class="absolute bottom-2 right-2 bg-[#1a7a4a] text-white rounded-xl px-4 py-3 flex items-center gap-2 shadow-float">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <div>
                <p class="text-[10px] text-green-200 leading-none">Based in</p>
                <p class="text-sm font-bold leading-tight">Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          <!-- Right: Text content -->
          <div class="reveal" style="--d:100ms">
            <div class="inline-flex items-center gap-1.5 badge badge-green mb-4">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Our Story
            </div>
            <h2 class="h2 mb-5">Your Partner in Achieving Optimal Health</h2>
            <div class="space-y-4 mb-7">
              <p class="body-sm text-[#64748b]">
                SWM Nutrition is an individually-owned consultancy dedicated to transforming lives through evidence-based nutritional guidance. Founded in 2016 and <strong class="text-[#1a7a4a] font-medium">located in the heart of Nairobi</strong>, we serve clients across Kenya with personalized wellness solutions.
              </p>
              <p class="body-sm text-[#64748b]">
                Our approach combines scientific expertise with <strong class="text-[#1a7a4a] font-medium">local knowledge</strong>, creating meal plans that incorporate fresh, locally-sourced ingredients from Kenyan markets. We believe in sustainable, culturally-relevant nutrition that fits your lifestyle and budget.
              </p>
              <p class="body-sm text-[#64748b]">
                What started as a passion for helping individuals achieve their health goals has grown into a trusted consultancy serving over <strong class="text-[#1a7a4a] font-medium">500 clients</strong>. Every success story fuels our commitment to making professional nutrition guidance accessible to all Kenyans.
              </p>
            </div>

            <!-- Feature badges row -->
            <div class="grid grid-cols-2 gap-4 mb-7">
              <div class="flex items-start gap-3 p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                <div class="icon-box ib-green-l w-10 h-10 rounded-xl shrink-0">
                  <svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <div>
                  <p class="font-bold text-[#0f172a] text-sm">Certified Expert</p>
                  <p class="text-xs text-[#64748b]">Licensed nutritionist with international certification</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                <div class="icon-box ib-green-l w-10 h-10 rounded-xl shrink-0">
                  <svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div>
                  <p class="font-bold text-[#0f172a] text-sm">Results Driven</p>
                  <p class="text-xs text-[#64748b]">Proven track record of client success stories</p>
                </div>
              </div>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-4 gap-3 pt-5 border-t border-[#e2e8f0]">
              <div v-for="s in miniStats" :key="s.label" class="text-center">
                <p class="text-xl font-extrabold text-[#1a7a4a]">{{ s.value }}</p>
                <p class="text-[11px] text-[#64748b] leading-snug mt-0.5">{{ s.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════ MISSION & VISION ════════════ -->
    <section class="section-sm bg-[#f8fafc]">
      <div class="wrap">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="bg-[#1a7a4a] rounded-3xl p-8 md:p-10 reveal">
            <div class="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Our Mission</h3>
            <p class="text-green-100 body-sm leading-relaxed">
              To empower Kenyans to take control of their health through accessible, evidence-based nutritional guidance that respects our culture and utilizes our rich local food resources. We're committed to making professional nutrition consultancy available to everyone seeking a healthier lifestyle.
            </p>
          </div>
          <div class="bg-[#0f172a] rounded-3xl p-8 md:p-10 reveal" style="--d:100ms">
            <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Our Vision</h3>
            <p class="text-[#94a3b8] body-sm leading-relaxed">
              To be Kenya's leading nutritional consultancy, recognized for transforming lives through personalized, sustainable wellness solutions. We envision a future where every Kenyan has the knowledge and support to make informed nutritional choices that lead to optimal health and wellbeing.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════ QUALIFICATIONS ════════════ -->
    <section class="section bg-white">
      <div class="wrap">
        <div class="sec-head reveal">
          <h2 class="h2">Qualifications & Credentials</h2>
          <p>Professional certifications and continuous education</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="(q, i) in qualifications"
            :key="q.name"
            class="card p-6 reveal"
            :style="`--d:${i * 70}ms`"
          >
            <div class="icon-box ib-green-l w-10 h-10 mb-4">
              <svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div class="h-0.5 w-8 bg-[#e2e8f0] mb-3" />
            <p class="text-[#1a7a4a] text-xs font-bold mb-1">{{ q.year }}</p>
            <h4 class="font-bold text-[#0f172a] text-sm mb-1">{{ q.name }}</h4>
            <p class="text-xs text-[#64748b]">{{ q.institution }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════ CORE VALUES ════════════ -->
    <section class="section bg-[#f8fafc]">
      <div class="wrap">
        <div class="sec-head reveal">
          <h2 class="h2">Our Core Values</h2>
          <p>The principles that guide everything we do</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div
            v-for="(v, i) in coreValues"
            :key="v.title"
            class="reveal"
            :style="`--d:${i * 70}ms`"
          >
            <div class="icon-box ib-green-l w-16 h-16 mx-auto mb-4 rounded-2xl" v-html="v.icon" />
            <h4 class="font-bold text-[#0f172a] mb-2">{{ v.title }}</h4>
            <p class="text-xs text-[#64748b] leading-relaxed max-w-[200px] mx-auto">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════ OUR APPROACH ════════════ -->
    <section class="section bg-white">
      <div class="wrap">
        <div class="bg-[#f8fafc] rounded-3xl p-8 md:p-12 border border-[#e2e8f0]">
          <div class="sec-head reveal">
            <h2 class="h2">Our Approach</h2>
            <p>How we deliver exceptional results for our clients</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(a, i) in approach" :key="a.title" class="reveal" :style="`--d:${i * 100}ms`">
              <div class="icon-box ib-green w-12 h-12 mb-4 rounded-xl" v-html="a.icon" />
              <h4 class="font-bold text-[#0f172a] mb-2">{{ a.title }}</h4>
              <p class="body-sm text-[#64748b] leading-relaxed">{{ a.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'About SWM Nutrition' })
const { init, destroy } = useReveal()
onMounted(() => nextTick(init))
onUnmounted(destroy)

const miniStats = [
  { value: '8+',    label: 'Years Exp.' },
  { value: '500+',  label: 'Happy Clients' },
  { value: '98%',   label: 'Success Rate' },
  { value: '1000+', label: 'Custom Plans' },
]

const qualifications = [
  { name: 'BSc in Nutrition & Dietetics',     institution: 'Kenyatta University',                              year: '2015' },
  { name: 'Certified Nutrition Specialist',   institution: 'Board for Certification of Nutrition Specialists',  year: '2016' },
  { name: 'Sports Nutrition Certificate',     institution: 'International Society of Sports Nutrition',         year: '2018' },
  { name: 'Clinical Nutrition Certification', institution: 'Academy of Nutrition and Dietetics',                year: '2020' },
]

const coreValues = [
  { title: 'Client-Centered Care', desc: 'Every client is unique. We listen, understand, and create solutions that work for you, not generic templates.', icon: `<svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
  { title: 'Excellence',           desc: 'We stay updated with the latest nutritional science and continuously improve our services.', icon: `<svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>` },
  { title: 'Community Focus',      desc: 'Building a healthier Kenya, one person at a time, with culturally-appropriate nutrition solutions.', icon: `<svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
  { title: 'Sustainability',       desc: 'Promoting sustainable eating habits that benefit both your health and the environment.', icon: `<svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
]

const approach = [
  { title: 'Evidence-Based', desc: 'All recommendations are grounded in current nutritional science and research, ensuring you receive guidance that truly works.', icon: `<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>` },
  { title: 'Personalized',   desc: 'No two clients are the same. We create custom plans based on your unique health profile, lifestyle, and goals.', icon: `<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>` },
  { title: 'Practical',      desc: 'Our solutions fit into real life. We work with your schedule, budget, and preferences to create sustainable habits.', icon: `<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
]
</script>
