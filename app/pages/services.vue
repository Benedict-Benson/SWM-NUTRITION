<template>
  <div>
    <!-- PAGE HERO -->
    <div class="page-hero">
      <div class="wrap">
        <h1 class="h1 reveal">Our Services</h1>
        <p class="body-sm text-[#64748b] mt-3 reveal" style="--d:80ms">Comprehensive nutrition solutions designed to meet your unique health and wellness goals.</p>
      </div>
    </div>

    <!-- SERVICE CARDS -->
    <section class="section bg-white">
      <div class="wrap">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(svc, i) in services" :key="svc.title" class="card overflow-hidden reveal" :style="`--d:${i * 70}ms`">
            <div class="aspect-[4/3] overflow-hidden">
              <img :src="svc.image" :alt="svc.title" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-6">
              <div class="icon-box ib-green-l w-10 h-10 mb-3" v-html="svc.icon" />
              <h3 class="font-bold text-[#0f172a] text-lg mb-2">{{ svc.title }}</h3>
              <p class="body-xs text-[#64748b] mb-4">{{ svc.desc }}</p>
              <p class="text-[#1a7a4a] font-extrabold text-xl mb-1">{{ svc.price }}</p>
              <p class="text-[#94a3b8] text-xs flex items-center gap-1.5 mb-4">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ svc.duration }}
              </p>
              <ul class="space-y-1.5 mb-5">
                <li v-for="b in svc.bullets" :key="b" class="flex items-center gap-2 text-xs text-[#64748b]">
                  <svg class="w-3.5 h-3.5 text-[#1a7a4a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ b }}
                </li>
              </ul>
              <button class="btn btn-primary btn-full gap-1.5" @click="openBooking(svc)">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PACKAGE PLANS -->
    <section class="section bg-[#f8fafc]">
      <div class="wrap">
        <div class="sec-head reveal">
          <h2 class="h2">Package Plans</h2>
          <p>Choose a comprehensive package for the best value and long-term success.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(pkg, i) in packages" :key="pkg.name"
            class="card reveal flex flex-col"
            :class="pkg.popular ? 'ring-2 ring-[#1a7a4a] relative overflow-hidden' : ''"
            :style="`--d:${i * 100}ms`"
          >
            <div v-if="pkg.popular" class="bg-[#1a7a4a] text-white text-center text-[11px] font-bold py-2 tracking-widest uppercase">Most Popular</div>
            <div class="p-7 flex flex-col flex-1">
              <h3 class="text-xl font-bold text-[#0f172a] mb-1">{{ pkg.name }}</h3>
              <p class="text-xs text-[#64748b] mb-4">{{ pkg.tagline }}</p>
              <p class="text-[2.25rem] font-extrabold text-[#0f172a] leading-none mb-1">{{ pkg.price }}</p>
              <p class="text-xs text-[#94a3b8] mb-6">{{ pkg.duration }}</p>
              <ul class="space-y-2.5 mb-7 flex-1">
                <li v-for="f in pkg.features" :key="f" class="flex items-start gap-2.5 text-sm text-[#0f172a]">
                  <svg class="w-4 h-4 text-[#1a7a4a] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ f }}
                </li>
              </ul>
              <button class="btn btn-full" :class="pkg.popular ? 'btn-primary' : 'btn-outline'" @click="openBooking({ title: pkg.name })">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[#1a7a4a] py-16">
      <div class="wrap text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">Not Sure Which Service is Right for You?</h2>
        <p class="text-green-100 body-sm mb-8 max-w-md mx-auto">Book a free 15-minute consultation call to discuss your goals and find the perfect service.</p>
        <button class="btn btn-white btn-lg gap-2" @click="openBooking({ title: 'Free Consultation' })">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Schedule Free Call
        </button>
      </div>
    </section>

    <!-- BOOKING MODAL -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="closeModal">
          <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <!-- Modal header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-[#e2e8f0]">
              <div>
                <h2 class="font-bold text-[#0f172a] text-lg">Book Appointment</h2>
                <p class="text-sm text-[#64748b]">{{ form.service_type }}</p>
              </div>
              <button class="w-8 h-8 rounded-full hover:bg-[#f1f5f9] flex items-center justify-center" @click="closeModal">
                <svg class="w-4 h-4 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Success state -->
            <div v-if="bookingSuccess" class="p-8 text-center">
              <div class="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 class="font-bold text-[#0f172a] text-lg mb-2">Booking Confirmed!</h3>
              <p class="text-[#64748b] text-sm mb-1">Your appointment request has been submitted.</p>
              <p class="text-[#64748b] text-sm mb-6">We'll contact you within 24 hours to confirm your slot.</p>
              <p class="text-xs text-[#94a3b8] mb-5">Reference: <span class="font-bold text-[#0f172a]">{{ bookingRef }}</span></p>
              <button class="btn btn-primary" @click="closeModal">Done</button>
            </div>

            <!-- Form -->
            <form v-else class="p-6 space-y-4" @submit.prevent="submitBooking">
              <!-- Error -->
              <div v-if="bookingError" class="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {{ bookingError }}
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="lbl">Full Name *</label>
                  <input v-model="form.client_name" type="text" class="input" placeholder="Jane Doe" required />
                </div>
                <div>
                  <label class="lbl">Email *</label>
                  <input v-model="form.client_email" type="email" class="input" placeholder="you@example.com" required />
                </div>
                <div>
                  <label class="lbl">Phone</label>
                  <input v-model="form.client_phone" type="tel" class="input" placeholder="+254700000000" />
                </div>
                <div>
                  <label class="lbl">Service *</label>
                  <select v-model="form.service_type" class="input" required>
                    <option v-for="s in serviceOptions" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <div>
                  <label class="lbl">Preferred Date *</label>
                  <input v-model="form.date" type="date" class="input" :min="minDate" required />
                </div>
                <div>
                  <label class="lbl">Preferred Time *</label>
                  <select v-model="form.time" class="input" required>
                    <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="lbl">Mode *</label>
                  <div class="flex gap-6">
                    <label v-for="m in modes" :key="m.value" class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="form.mode" :value="m.value" class="accent-[#1a7a4a]" />
                      <span class="text-sm text-[#0f172a]">{{ m.label }}</span>
                    </label>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="lbl">Additional Notes</label>
                  <textarea v-model="form.notes" class="input min-h-[80px] resize-none" placeholder="Any health concerns or questions you'd like to discuss…" />
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-full btn-lg gap-2 disabled:opacity-60" :disabled="submitting">
                <svg v-if="submitting" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ submitting ? 'Submitting...' : 'Confirm Booking' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Our Services – SWM Nutrition' })
const { init, destroy } = useReveal()
onMounted(() => nextTick(init))
onUnmounted(destroy)

const supabase = useSupabaseClient()

// ── Modal state ───────────────────────────────────────────
const showModal      = ref(false)
const submitting     = ref(false)
const bookingSuccess = ref(false)
const bookingError   = ref('')
const bookingRef     = ref('')

const form = reactive({
  client_name:  '',
  client_email: '',
  client_phone: '',
  service_type: '',
  date:         '',
  time:         '09:00',
  mode:         'in_person',
  notes:        '',
})

const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]

const serviceOptions = [
  'Individual Consultation', 'Sports Nutrition', 'Weight Management',
  'Prenatal & Postnatal Nutrition', 'Family Nutrition', 'Corporate Wellness',
  'Free Consultation', 'Starter Package', 'Premium Package', 'Elite Package',
]

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]

const modes = [
  { value: 'in_person', label: 'In Person' },
  { value: 'virtual',   label: 'Online / Video' },
]

function openBooking(svc: { title: string }) {
  bookingSuccess.value = false
  bookingError.value   = ''
  form.service_type    = svc.title
  form.date            = ''
  form.time            = '09:00'
  form.mode            = 'in_person'
  form.notes           = ''

  // Pre-fill from profile if logged in
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (!session) return
    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', session.user.id)
      .single()
    if (data) {
      form.client_name  = data.full_name ?? ''
      form.client_phone = data.phone     ?? ''
    }
    form.client_email = session.user.email ?? ''
  })

  showModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value      = false
  bookingSuccess.value = false
  document.body.style.overflow = ''
}

async function submitBooking() {
  bookingError.value = ''
  submitting.value   = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const scheduled_at = new Date(`${form.date}T${form.time}:00`).toISOString()
    const ref = `APT-${Date.now().toString(36).toUpperCase()}`

    const { error } = await supabase.from('appointments').insert({
      ref,
      user_id:      session?.user.id ?? null,
      client_name:  form.client_name,
      client_email: form.client_email,
      client_phone: form.client_phone || null,
      service_type: form.service_type,
      mode:         form.mode,
      scheduled_at,
      notes:        form.notes || null,
      status:       'pending',
    })

    if (error) throw error

    bookingRef.value     = ref
    bookingSuccess.value = true
  } catch (e: any) {
    bookingError.value = e.message
  } finally {
    submitting.value = false
  }
}

// ── Services data ─────────────────────────────────────────
const services = [
  {
    title: 'Individual Consultation',
    desc: 'One-on-one personalized nutrition counselling tailored to your unique health goals and lifestyle.',
    price: 'KSh 3,500', duration: '60 minutes',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop',
    bullets: ['Comprehensive health assessment', 'Personalized meal plan', 'Supplement recommendations', 'Follow-up support'],
    icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`,
  },
  {
    title: 'Sports Nutrition',
    desc: 'Optimize your athletic performance with specialized nutrition strategies for training and competition.',
    price: 'KSh 5,000', duration: '60 minutes',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop',
    bullets: ['Performance assessment', 'Training nutrition plan', 'Recovery protocols', 'Competition day strategy'],
    icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
  {
    title: 'Weight Management',
    desc: 'Sustainable weight loss or gain programs designed for long-term success and overall wellbeing.',
    price: 'KSh 4,500', duration: '60 minutes',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80&auto=format&fit=crop',
    bullets: ['Goal setting & tracking', 'Customized meal plans', 'Behavioral coaching', 'Weekly check-ins'],
    icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  },
  {
    title: 'Prenatal & Postnatal Nutrition',
    desc: 'Expert nutrition guidance for a healthy pregnancy and postpartum recovery.',
    price: 'KSh 5,500', duration: '90 minutes',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80&auto=format&fit=crop',
    bullets: ['Trimester specific plans', 'Nutrient optimization', 'Morning sickness management', 'Breastfeeding support'],
    icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    title: 'Family Nutrition',
    desc: 'Create healthy eating habits for the whole family with practical, family-friendly solutions.',
    price: 'KSh 7,500', duration: '90 minutes',
    image: 'https://images.unsplash.com/photo-1609197100049-373be8d93f56?w=600&q=80&auto=format&fit=crop',
    bullets: ['Family assessment', 'Kid-friendly meal ideas', 'Grocery shopping guide', 'Meal prep strategies'],
    icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    title: 'Corporate Wellness',
    desc: 'Comprehensive workplace wellness programs to improve employee health and productivity.',
    price: 'Custom', duration: 'Flexible',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&auto=format&fit=crop',
    bullets: ['On-site consultations', 'Nutrition workshops', 'Health screenings', 'Wellness challenges'],
    icon: `<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
]

// ── Packages data ─────────────────────────────────────────
const packages = [
  {
    name: 'Starter Package', tagline: 'Perfect for getting started on your health journey',
    price: 'KSh 10,000', duration: 'One-time', popular: false,
    features: ['3 one-on-one consultations', 'Personalized meal plan', 'Email support for 1 month', 'Recipe collection'],
  },
  {
    name: 'Premium Package', tagline: 'Our most popular comprehensive program',
    price: 'KSh 25,000', duration: '3 months', popular: true,
    features: ['6 one-on-one consultations', 'Personalized meal plan', 'Email & phone support for 3 months', 'Recipe collection', 'Supplement recommendations', 'Progress tracking & adjustments'],
  },
  {
    name: 'Elite Package', tagline: 'Premium support for serious transformation',
    price: 'KSh 45,000', duration: '6 months', popular: false,
    features: ['12 one-on-one consultations', 'Personalized meal plan', 'Priority email & phone support for 6 months', 'Recipe collection', 'Supplement recommendations', 'Progress tracking & adjustments', 'Cooking classes & workshops', 'Grocery shopping assistance'],
  },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>