<template>
  <div>
    <!-- ════════════ HERO ════════════ -->
    <section class="bg-white pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
      <div class="wrap">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <!-- Left -->
          <div>
            <div class="inline-flex items-center gap-1.5 badge badge-green mb-5">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              Nairobi, Kenya
            </div>
            <h1 class="display text-[#0f172a] mb-5">
              Transform Your<br>Health with
              <span class="italic-ac block">Expert<br>Nutrition</span>
            </h1>
            <p class="body-lg text-[#64748b] mb-8 max-w-[460px]">
              SWM Nutrition provides personalized, evidence-based nutrition consultancy tailored to your unique health goals. Based in Kenya and serving clients nationwide, we use practical, whole-food strategies to support gut health, weight management, and overall wellness, helping you build sustainable habits that last.
            </p>
            <div class="flex flex-wrap gap-3 mb-7">
              <NuxtLink to="/contact" class="btn btn-primary btn-lg gap-2">
                Book Consultation →
              </NuxtLink>
              <NuxtLink to="/shop" class="btn btn-outline btn-lg">Browse Products</NuxtLink>
            </div>
            <div class="flex flex-wrap gap-5">
              <div v-for="b in badges" :key="b" class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-[#1a7a4a] flex items-center justify-center shrink-0">
                  <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span class="text-xs font-medium text-[#0f172a]">{{ b }}</span>
              </div>
            </div>
          </div>
          <!-- Right -->
          <div class="hidden md:block relative">
            <div class="rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgb(0,0,0,0.18)]" style="aspect-ratio:5/4">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=85&auto=format&fit=crop"
                alt="Fresh vegetables - Nairobi market"
                class="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <!-- Floating card -->
            <div class="absolute bottom-5 right-5 bg-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-[0_20px_60px_-10px_rgb(0,0,0,0.2)] border border-[#e2e8f0]">
              <div class="w-10 h-10 rounded-xl bg-[#1a7a4a] flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p class="text-[11px] text-[#64748b] leading-none mb-0.5">Success Rate</p>
                <p class="text-sm font-bold text-[#0f172a] leading-none">98% Client Goals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════ WHY CHOOSE ════════════ -->
    <section class="section bg-[#f8fafc]">
      <div class="wrap">
        <div class="sec-head reveal">
          <h2 class="h2">Why Choose SWM Nutrition?</h2>
          <p>What sets us apart as Kenya's premier nutritional consultancy</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="card card-hover p-6 reveal"
            :style="`--d:${i * 70}ms`"
          >
            <div class="icon-box ib-green-l w-11 h-11 mb-4" v-html="f.icon" />
            <h4 class="h4 mb-2">{{ f.title }}</h4>
            <p class="body-xs text-[#64748b]">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════ HEALTH JOURNEY ════════════ -->
    <section class="section bg-white">
      <div class="wrap">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div class="reveal">
            <div class="rounded-3xl overflow-hidden shadow-[0_16px_48px_-8px_rgb(0,0,0,0.14)]" style="aspect-ratio:4/3">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=85&auto=format&fit=crop"
                alt="Nutrition consultation"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <div class="reveal" style="--d:120ms">
            <h2 class="h2 mb-2">Your Health Journey, Simplified</h2>
            <p class="body-sm text-[#64748b] mb-6">A structured approach designed to deliver real, sustainable results.</p>
            <div class="divide-y divide-[#e2e8f0]">
              <div v-for="step in journey" :key="step.title" class="flex items-start gap-3 py-4">
                <div class="w-6 h-6 rounded-full bg-[#1a7a4a] flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p class="font-bold text-[#0f172a] text-sm">{{ step.title }}</p>
                  <p class="body-xs text-[#64748b]">{{ step.desc }}</p>
                </div>
              </div>
            </div>
            <NuxtLink to="/contact" class="btn btn-primary btn-lg mt-7 inline-flex">Start Your Journey Today</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════ HOW IT WORKS ════════════ -->
    <section class="section bg-[#f8fafc]">
      <div class="wrap">
        <div class="sec-head reveal">
          <h2 class="h2">How It Works</h2>
          <p>Our simple 4 step process to transform your health and wellness</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div
            v-for="(step, i) in howItWorks"
            :key="step.title"
            class="card card-hover p-7 reveal"
            :style="`--d:${i * 80}ms`"
          >
            <div class="icon-box ib-green w-12 h-12 mb-4" v-html="step.icon" />
            <h3 class="h3 mb-2">{{ step.title }}</h3>
            <p class="body-sm text-[#64748b] mb-4">{{ step.desc }}</p>
            <ul class="space-y-1.5">
              <li v-for="b in step.bullets" :key="b" class="flex items-center gap-2 text-sm text-[#0f172a]">
                <span class="w-1.5 h-1.5 rounded-full bg-[#1a7a4a] shrink-0" />
                {{ b }}
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 justify-center reveal" style="--d:200ms">
          <NuxtLink to="/contact" class="btn btn-primary btn-lg">Book Your Free Discovery Call</NuxtLink>
          <NuxtLink to="/services" class="btn btn-outline btn-lg">View Pricing Plans</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ════════════ TESTIMONIALS ════════════ -->
    <section class="section bg-white">
      <div class="wrap">
        <div class="sec-head reveal">
          <h2 class="h2">Client Success Stories</h2>
          <p>Real results from real people across Kenya who transformed their health with SWM Nutrition</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(t, i) in testimonials"
            :key="t.name"
            class="card card-hover p-6 reveal"
            :style="`--d:${i * 60}ms`"
          >
            <div class="flex items-center gap-3 mb-4">
              <img :src="t.avatar" :alt="t.name" class="w-11 h-11 rounded-full object-cover ring-2 ring-[#e8f5ee]" />
              <div>
                <p class="font-bold text-sm text-[#0f172a]">{{ t.name }}</p>
                <p class="text-xs text-[#64748b]">{{ t.city }}</p>
                <div class="stars text-sm">★★★★★</div>
              </div>
            </div>
            <p class="body-xs text-[#64748b] leading-relaxed mb-4">"{{ t.quote }}"</p>
            <div class="flex items-center gap-2 text-[#1a7a4a] text-xs font-semibold pt-3 border-t border-[#e2e8f0]">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              {{ t.result }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════ STATS BANNER ════════════ -->
    <section class="bg-[#1a7a4a] py-16 relative overflow-hidden">
      <div class="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
      <div class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
      <div class="wrap relative">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="(s, i) in stats" :key="s.label" class="reveal" :style="`--d:${i * 80}ms`">
            <p class="text-[2.75rem] font-extrabold text-white leading-none">{{ s.value }}</p>
            <p class="text-sm text-green-200 font-medium mt-1.5">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'SWM Nutrition – Transform Your Health with Expert Nutrition' })
const { init, destroy } = useReveal()
onMounted(() => nextTick(init))
onUnmounted(destroy)

const badges = ['Certified Nutritionist', 'Personalized Plans', '100+ Happy Clients']

const features = [
  { title: 'Personalized Approach',  desc: 'Every plan is designed around you, your needs, preferences, and health goals, making it easy to follow and fit into your daily routine.',                                         icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>` },
  { title: 'Evidence-Based',         desc: 'All recommendations are grounded in nutrition science, helping you make choices guided by evidence rather than trends or guesswork.',                                                        icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>` },
  { title: 'Whole-Food Focus',       desc: 'We focus on simple, nourishing foods you can easily find and enjoy, without extreme diets or unnecessary restrictions.',                                            icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
  { title: 'Flexible Support',       desc: '24/7 chat support, regular check-ins, and plan adjustments to fit your changing lifestyle.',                                                    icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>` },
  { title: 'Fits Your Real Life',    desc: 'Your plan is designed to fit into your routine, whether you are working, studying, or managing a busy schedule.',                                                        icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>` },
  { title: 'Sustainable Results',    desc: 'We help you build habits you can maintain, so your results last well beyond the plan.,                                               icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
]

const journey = [
  { title: 'Comprehensive Assessment', desc: 'Detailed analysis of your health status, lifestyle, and nutritional needs.' },
  { title: 'Custom Meal Planning',     desc: 'Personalised meal plans with recipes, shopping lists, and portion guides.' },
  { title: 'Ongoing Monitoring',       desc: 'Regular progress tracking and plan adjustments for optimal results.' },
  { title: 'Education & Support',      desc: 'Learn sustainable habits with continuous professional guidance.' },
]

const howItWorks = [
  {
    title: 'Book Consultation',
    desc: 'Schedule your initial 30-minute consultation session at your convenience. We offer both in-person meetings in Nairobi and virtual consultations.',
    bullets: ['Flexible scheduling', 'Virtual or in-person', '1 week history review'],
    icon: `<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  },
  {
    title: 'Comprehensive Assessment',
    desc: 'We thoroughly evaluate your current health status, lifestyle, dietary habits, and specific goals to create your personalised plan.',
    bullets: ['Health & lifestyle analysis', 'Dietary preferences review', 'Goal-setting session'],
    icon: `<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>`,
  },
  {
    title: 'Custom Plan Creation',
    desc: 'Receive a personalised nutrition plan with detailed meal schedules, recipes using local ingredients, shopping lists, and supplement recommendations.',
    bullets: ['Tailored meal plans', 'Shopping guides', 'Recipe collection'],
    icon: `<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/></svg>`,
  },
  {
    title: 'Ongoing Support',
    desc: 'Regular check-ins, progress monitoring, and plan adjustments ensure you stay on track and achieve your health goals sustainably.',
    bullets: ['Weekly follow ups', 'Plan readjustments', '24/7 diet support'],
    icon: `<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
]

const testimonials = [
  { name: 'Grace Wanjiku', city: 'Nairobi',  avatar: 'https://i.pravatar.cc/96?img=5',  quote: 'SWM Nutrition transformed my relationship with food. I lost 15kg in 4 months and learned sustainable eating habits that fit my Kenyan lifestyle. The meal plans using local ingredients made it so easy!', result: 'Lost 15kg in 4 months' },
  { name: 'David Omondi',  city: 'Mombasa',  avatar: 'https://i.pravatar.cc/96?img=12', quote: 'As an athlete, proper nutrition was crucial for my performance. The sports nutrition program helped me improve my marathon time by 20 minutes. Highly recommended.', result: 'Improved marathon time by 20 minutes' },
  { name: 'Amina Hassan',  city: 'Kisumu',   avatar: 'https://i.pravatar.cc/96?img=9',  quote: 'Managing diabetes seemed overwhelming until I found SWM Nutrition. The personalised guidance and regular check-ins helped me get my blood sugar under control naturally.', result: 'Blood sugar levels normalised' },
  { name: 'James Kamau',   city: 'Nairobi',  avatar: 'https://i.pravatar.cc/96?img=15', quote: 'The wellness program is incredible value. I gained muscle, lost fat, and my energy levels are through the roof. The best investment in my health!', result: 'Gained 6kg muscle, lost 12kg fat' },
  { name: 'Mary Akinyi',   city: 'Nairobi',  avatar: 'https://i.pravatar.cc/96?img=25', quote: 'After years of trying different diets, SWM Nutrition finally gave me results that last. The approach is scientific, practical, and respectful of our culture.', result: 'Maintained weight for 2 years' },
  { name: 'Peter Njoroge', city: 'Nakuru',   avatar: 'https://i.pravatar.cc/96?img=33', quote: 'Professional, knowledgeable, and genuinely caring. The consultation sessions are thorough and the follow-up support is exceptional.', result: 'Reversed pre-diabetes' },
]

const stats = [
  { value: '500+',  label: 'Happy Clients'     },
  { value: '98%',   label: 'Success Rate'       },
  { value: '1000+', label: 'Meal Plans Created' },
  { value: '8+',    label: 'Years Experience'   },
]
</script>
