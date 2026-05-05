<template>
  <div>
    <!-- PAGE HERO -->
    <div class="page-hero">
      <div class="wrap">
        <h1 class="h1 reveal">Get In Touch</h1>
        <p class="body-sm text-[#64748b] mt-3 reveal" style="--d:80ms">
          Ready to start your wellness journey? Book a consultation or reach out with any questions.
        </p>
      </div>
    </div>

    <section class="section bg-[#f8fafc]">
      <div class="wrap">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-7">

          <!-- LEFT SIDEBAR -->
          <div class="space-y-5">
            <!-- Contact Info Card -->
            <div class="card p-6">
              <h3 class="font-bold text-[#0f172a] text-sm mb-5 uppercase tracking-wide">Contact Information</h3>
              <div class="space-y-4">
                <div v-for="item in contactItems" :key="item.label" class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl bg-[#e8f5ee] flex items-center justify-center shrink-0 mt-0.5 text-[#1a7a4a]" v-html="item.icon" />
                  <div>
                    <p class="font-bold text-[#0f172a] text-sm">{{ item.label }}</p>
                    <p v-for="v in item.values" :key="v" class="text-sm text-[#64748b]">{{ v }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- WhatsApp Card -->
            <div class="bg-[#1a7a4a] rounded-2xl p-6">
              <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.995 0C5.37 0 0 5.373 0 11.997c0 2.117.556 4.104 1.528 5.832L.057 24l6.305-1.654A11.955 11.955 0 0 0 12 24c6.624 0 12-5.373 12-12C24 5.373 18.62 0 11.995 0zm.005 21.785a9.826 9.826 0 0 1-5.012-1.368l-.36-.213-3.737.98.998-3.648-.234-.374A9.786 9.786 0 0 1 2.21 12c0-5.405 4.397-9.8 9.79-9.8 5.394 0 9.79 4.395 9.79 9.8 0 5.405-4.396 9.785-9.79 9.785z"/>
                </svg>
              </div>
              <h4 class="font-bold text-white mb-2">Quick Response</h4>
              <p class="text-green-100 text-sm mb-4">We typically respond to all inquiries within 24 hours during business days.</p>
              <a href="https://wa.me/254700123456" target="_blank" rel="noopener" class="btn btn-white btn-full justify-center">
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <!-- RIGHT: FORM + MAP -->
          <div class="lg:col-span-2 space-y-5">
            <div class="card p-7 md:p-9 bg-white">
              <h3 class="h3 mb-6">Send Us a Message</h3>

              <!-- Success state -->
              <div v-if="submitted" class="text-center py-10">
                <div class="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
                  <svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h4 class="font-bold text-[#0f172a] text-lg mb-2">Message Sent!</h4>
                <p class="text-[#64748b] text-sm mb-5">We'll get back to you within 24 hours.</p>
                <button class="btn btn-outline" @click="resetForm">Send Another</button>
              </div>

              <!-- Form -->
              <div v-else class="space-y-5">
                <!-- Error banner -->
                <div v-if="formError" class="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {{ formError }}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="lbl">Full Name <span class="text-red-500">*</span></label>
                    <input v-model="form.name" type="text" class="input" />
                  </div>
                  <div>
                    <label class="lbl">Email Address <span class="text-red-500">*</span></label>
                    <input v-model="form.email" type="email" class="input" />
                  </div>
                  <div>
                    <label class="lbl">Phone Number</label>
                    <input v-model="form.phone" type="tel" placeholder="+254 700 000 000" class="input" />
                  </div>
                  <div>
                    <label class="lbl">Service Interest</label>
                    <select v-model="form.service" class="input">
                      <option value="">Select a service</option>
                      <option>Initial Consultation</option>
                      <option>Weight Management</option>
                      <option>Sports Nutrition</option>
                      <option>Meal Planning</option>
                      <option>Wellness Program</option>
                      <option>Family Nutrition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="lbl">Message <span class="text-red-500">*</span></label>
                  <textarea v-model="form.message" rows="4" placeholder="Tell us about your health goals and any specific concerns..." class="input resize-none" />
                </div>

                <p class="text-[#94a3b8] text-xs">
                  By submitting this form, you agree to our privacy policy and consent to be contacted regarding your inquiry.
                </p>

                <button
                  class="btn btn-primary btn-full btn-lg gap-2 disabled:opacity-60"
                  :disabled="sending"
                  @click="submitForm"
                >
                  <svg v-if="sending" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  {{ sending ? 'Sending…' : 'Send Message' }}
                </button>
              </div>
            </div>

            <!-- Map placeholder -->
            <div class="card bg-white p-0 overflow-hidden h-48 flex flex-col items-center justify-center text-center">
              <svg class="w-8 h-8 text-[#94a3b8] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <p class="font-medium text-[#0f172a] text-sm">Westlands, Nairobi</p>
              <p class="text-[#94a3b8] text-xs mt-0.5">Map view available in production</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact – SWM Nutrition' })

const supabase = useSupabaseClient()

const sending   = ref(false)
const submitted = ref(false)
const formError = ref('')

const form = reactive({
  name:    '',
  email:   '',
  phone:   '',
  service: '',
  message: '',
})

const contactItems = [
  {
    label: 'Phone',
    values: ['+254 700 123 456', '+254 711 123 456'],
    icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16l.42.92z"/></svg>`,
  },
  {
    label: 'Email',
    values: ['info@swmnutrition.com'],
    icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  },
  {
    label: 'Location',
    values: ['Westlands, Nairobi', 'Kenya'],
    icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  },
  {
    label: 'Business Hours',
    values: ['Mon – Fri: 8am – 6pm', 'Sat: 9am – 2pm'],
    icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
]

async function submitForm() {
  formError.value = ''

  if (!form.name.trim())    { formError.value = 'Please enter your full name.'; return }
  if (!form.email.trim())   { formError.value = 'Please enter your email address.'; return }
  if (!form.message.trim()) { formError.value = 'Please enter a message.'; return }

  sending.value = true
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name:    form.name.trim(),
        email:   form.email.toLowerCase().trim(),
        phone:   form.phone.trim() || null,
        service: form.service     || null,
        message: form.message.trim(),
        status:  'unread',
      })

    if (error) throw error
    submitted.value = true
  } catch (e: any) {
    formError.value = e.message ?? 'Something went wrong. Please try again.'
  } finally {
    sending.value = false
  }
}

function resetForm() {
  submitted.value = false
  formError.value = ''
  form.name    = ''
  form.email   = ''
  form.phone   = ''
  form.service = ''
  form.message = ''
}
</script>
