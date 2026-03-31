<template>
  <div>
    <div class="page-hero">
      <div class="wrap">
        <!-- Breadcrumb -->
        <div class="flex items-center justify-center gap-2 mb-4 text-sm">
          <NuxtLink to="/cart" class="text-[#1a7a4a] font-semibold hover:underline">Cart</NuxtLink>
          <svg class="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
          <span class="font-bold text-[#0f172a]">Checkout</span>
          <svg class="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
          <span class="text-[#94a3b8]">Confirmation</span>
        </div>
        <h1 class="h1">Checkout</h1>
      </div>
    </div>

    <!-- Empty cart redirect -->
    <section v-if="cart.isEmpty" class="section bg-[#f8fafc] text-center">
      <div class="wrap py-12">
        <p class="text-[#64748b] mb-5">Your cart is empty.</p>
        <NuxtLink to="/shop" class="btn btn-primary btn-lg">Go to Shop</NuxtLink>
      </div>
    </section>

    <section v-else class="section bg-[#f8fafc]">
      <div class="wrap">
        <form novalidate @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- LEFT: form fields -->
            <div class="lg:col-span-2 space-y-6">

              <!-- 1. Customer info -->
              <div class="card p-7">
                <h2 class="font-bold text-[#0f172a] text-lg mb-5 flex items-center gap-2">
                  <span class="w-7 h-7 rounded-full bg-[#1a7a4a] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  Customer Information
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="sm:col-span-2">
                    <label class="lbl" for="full_name">Full Name <span class="text-red-500">*</span></label>
                    <input id="full_name" v-model="form.full_name" type="text" placeholder="Grace Wanjiku" class="input" :class="{'border-red-400': errors.full_name}" />
                    <p v-if="errors.full_name" class="text-red-500 text-xs mt-1">{{ errors.full_name }}</p>
                  </div>
                  <div>
                    <label class="lbl" for="email">Email Address <span class="text-red-500">*</span></label>
                    <input id="email" v-model="form.email" type="email" placeholder="grace@example.com" class="input" :class="{'border-red-400': errors.email}" />
                    <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
                  </div>
                  <div>
                    <label class="lbl" for="phone">Phone Number <span class="text-red-500">*</span></label>
                    <input id="phone" v-model="form.phone" type="tel" placeholder="+254 700 000 000" class="input" :class="{'border-red-400': errors.phone}" />
                    <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
                  </div>
                </div>
              </div>

              <!-- 2. Delivery address -->
              <div class="card p-7">
                <h2 class="font-bold text-[#0f172a] text-lg mb-5 flex items-center gap-2">
                  <span class="w-7 h-7 rounded-full bg-[#1a7a4a] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  Delivery Address
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="sm:col-span-2">
                    <label class="lbl" for="street">Street Address <span class="text-red-500">*</span></label>
                    <input id="street" v-model="form.shipping_address.street" type="text" placeholder="123 Westlands Road, Apt 4B" class="input" :class="{'border-red-400': errors.street}" />
                    <p v-if="errors.street" class="text-red-500 text-xs mt-1">{{ errors.street }}</p>
                  </div>
                  <div>
                    <label class="lbl" for="city">City / Town <span class="text-red-500">*</span></label>
                    <select id="city" v-model="form.shipping_address.city" class="input" :class="{'border-red-400': errors.city}">
                      <option value="">Select city...</option>
                      <option v-for="c in kenyanCities" :key="c">{{ c }}</option>
                    </select>
                    <p v-if="errors.city" class="text-red-500 text-xs mt-1">{{ errors.city }}</p>
                  </div>
                  <div>
                    <label class="lbl" for="county">County</label>
                    <input id="county" v-model="form.shipping_address.county" type="text" placeholder="Nairobi" class="input" />
                  </div>
                  <div>
                    <label class="lbl" for="postal">Postal Code</label>
                    <input id="postal" v-model="form.shipping_address.postal_code" type="text" placeholder="00100" class="input" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="lbl" for="instructions">Delivery Instructions (Optional)</label>
                    <textarea id="instructions" v-model="form.shipping_address.instructions" rows="2" placeholder="E.g. Call on arrival, leave at gate, apartment number..." class="input resize-none" />
                  </div>
                </div>
              </div>

              <!-- 3. Payment method -->
              <div class="card p-7">
                <h2 class="font-bold text-[#0f172a] text-lg mb-5 flex items-center gap-2">
                  <span class="w-7 h-7 rounded-full bg-[#1a7a4a] text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  Payment Method
                </h2>
                <div class="space-y-3">
                  <!-- M-Pesa -->
                  <label
                    class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                    :class="form.payment_method === 'mpesa' ? 'border-[#1a7a4a] bg-[#e8f5ee]' : 'border-[#e2e8f0] hover:border-[#c8e8d5]'"
                  >
                    <input v-model="form.payment_method" type="radio" value="mpesa" class="sr-only" />
                    <div class="w-10 h-10 rounded-xl bg-[#1a7a4a] flex items-center justify-center shrink-0">
                      <span class="text-white text-xs font-bold leading-none">M-P</span>
                    </div>
                    <div class="flex-1">
                      <p class="font-bold text-[#0f172a] text-sm">M-Pesa (STK Push)</p>
                      <p class="text-xs text-[#64748b]">You'll receive a prompt on your phone to complete payment</p>
                    </div>
                    <div v-if="form.payment_method === 'mpesa'" class="w-5 h-5 rounded-full bg-[#1a7a4a] flex items-center justify-center shrink-0">
                      <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </label>

                  <!-- Cash on Delivery -->
                  <label
                    class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                    :class="form.payment_method === 'cash_on_delivery' ? 'border-[#1a7a4a] bg-[#e8f5ee]' : 'border-[#e2e8f0] hover:border-[#c8e8d5]'"
                  >
                    <input v-model="form.payment_method" type="radio" value="cash_on_delivery" class="sr-only" />
                    <div class="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center shrink-0">
                      <svg class="w-5 h-5 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div class="flex-1">
                      <p class="font-bold text-[#0f172a] text-sm">Cash on Delivery</p>
                      <p class="text-xs text-[#64748b]">Pay when your order arrives. Nairobi only.</p>
                    </div>
                    <div v-if="form.payment_method === 'cash_on_delivery'" class="w-5 h-5 rounded-full bg-[#1a7a4a] flex items-center justify-center shrink-0">
                      <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </label>
                </div>
                <p v-if="errors.payment" class="text-red-500 text-xs mt-3">{{ errors.payment }}</p>
              </div>

              <!-- Order notes -->
              <div class="card p-7">
                <label class="lbl" for="notes">Order Notes (Optional)</label>
                <textarea id="notes" v-model="form.notes" rows="2" placeholder="Any special requests for your order..." class="input resize-none mt-1" />
              </div>
            </div>

            <!-- RIGHT: order summary sidebar -->
            <div>
              <div class="card p-6 sticky top-[88px]">
                <h3 class="font-bold text-[#0f172a] mb-4">Order Summary</h3>

                <!-- Items -->
                <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  <div v-for="item in cart.items" :key="item.id" class="flex gap-3">
                    <img
                      :src="item.image ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=60'"
                      :alt="item.name"
                      class="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#f1f5f9]"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-[#0f172a] line-clamp-2">{{ item.name }}</p>
                      <p class="text-xs text-[#94a3b8]">Qty: {{ item.qty }}</p>
                    </div>
                    <p class="text-sm font-bold text-[#0f172a] shrink-0">KSh {{ (item.price * item.qty).toLocaleString() }}</p>
                  </div>
                </div>

                <!-- Totals -->
                <div class="border-t border-[#e2e8f0] pt-4 space-y-2.5 text-sm">
                  <div class="flex justify-between">
                    <span class="text-[#64748b]">Subtotal</span>
                    <span class="font-semibold">KSh {{ cart.subtotal.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[#64748b]">Shipping</span>
                    <span v-if="cart.shippingFee === 0" class="text-[#1a7a4a] font-bold">FREE</span>
                    <span v-else class="font-semibold">KSh {{ cart.shippingFee.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-[#e2e8f0] text-base">
                    <span class="font-bold text-[#0f172a]">Total</span>
                    <span class="font-extrabold text-[#1a7a4a] text-xl">KSh {{ cart.total.toLocaleString() }}</span>
                  </div>
                </div>

                <!-- Error message -->
                <Transition name="slide">
                  <div v-if="submitError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {{ submitError }}
                  </div>
                </Transition>

                <!-- Submit -->
                <button
                  type="submit"
                  :disabled="cart.isLoading"
                  class="btn btn-primary btn-full btn-lg mt-4 gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg v-if="cart.isLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  {{ cart.isLoading ? 'Processing...' : `Place Order · KSh ${cart.total.toLocaleString()}` }}
                </button>

                <p class="text-center text-[11px] text-[#94a3b8] mt-3">
                  By placing your order you agree to our
                  <a href="#" class="text-[#1a7a4a] hover:underline">Terms</a> &
                  <a href="#" class="text-[#1a7a4a] hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </section>

    <!-- M-Pesa waiting modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="mpesaWaiting" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div class="bg-white rounded-3xl max-w-sm w-full p-8 text-center">
            <div class="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-5">
              <svg class="w-8 h-8 animate-pulse text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.05 6.05l1.79-1.79a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3 class="font-bold text-[#0f172a] text-xl mb-2">Check Your Phone</h3>
            <p class="text-[#64748b] text-sm mb-2">
              An M-Pesa payment request of <strong class="text-[#0f172a]">KSh {{ cart.total.toLocaleString() }}</strong> has been sent to <strong class="text-[#0f172a]">{{ form.phone }}</strong>.
            </p>
            <p class="text-[#64748b] text-sm mb-6">Enter your M-Pesa PIN to complete payment.</p>
            <div class="flex gap-2 justify-center mb-2">
              <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full bg-[#1a7a4a] animate-bounce" :style="`animation-delay:${i*0.15}s`" />
            </div>
            <p class="text-xs text-[#94a3b8]">Waiting for payment confirmation... ({{ pollCount }}/30)</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Checkout – SWM Nutrition' })

// useCartStore auto-imported from stores/cart.ts
const cart   = useCartStore()
const router = useRouter()

const submitError  = ref<string | null>(null)
const mpesaWaiting = ref(false)
const pollCount    = ref(0)
let   pollInterval: ReturnType<typeof setInterval>

const form = reactive({
  full_name:      '',
  email:          '',
  phone:          '',
  payment_method: 'mpesa',
  notes:          '',
  shipping_address: {
    street:       '',
    city:         '',
    county:       '',
    postal_code:  '',
    country:      'Kenya',
    instructions: '',
  },
})

const errors = reactive<Record<string, string>>({})

// Pre-fill if logged in
const user = useSupabaseUser()
if (user.value) {
  const supabase = useSupabaseClient()
  form.email = user.value.email ?? ''
  supabase.from('profiles').select('full_name, phone').eq('id', user.value.id).single()
    .then(({ data }) => {
      if (data?.full_name) form.full_name = data.full_name
      if (data?.phone)     form.phone     = data.phone
    })
}

function validate(): boolean {
  const errs = errors as Record<string, string>
  Object.keys(errs).forEach(k => delete errs[k])
  if (!form.full_name.trim())                           errs.full_name = 'Name is required'
  if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email     = 'Valid email is required'
  if (form.phone.replace(/\D/g, '').length < 9)        errs.phone     = 'Valid phone number is required'
  if (!form.shipping_address.street.trim())             errs.street    = 'Street address is required'
  if (!form.shipping_address.city)                     errs.city      = 'City is required'
  if (!form.payment_method)                            errs.payment   = 'Please select a payment method'
  return Object.keys(errs).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitError.value = null

  const res = await cart.checkout(form)
  if (!res.success || !res.data) {
    submitError.value = res.error ?? 'Something went wrong. Please try again.'
    return
  }

  const order = res.data

  if (form.payment_method === 'mpesa') {
    await triggerMpesa(order.id)
  } else {
    router.push(`/checkout/confirmation/${order.order_number}`)
  }
}

async function triggerMpesa(orderId: string) {
  try {
    const res = await $fetch<any>('/api/mpesa/stk-push', {
      method: 'POST',
      body: { phone: form.phone, amount: cart.total, orderId, description: 'SWM Nutrition Order' },
    })

    if (!res.success) {
      submitError.value = res.responseDesc ?? 'M-Pesa request failed. Try again.'
      return
    }

    mpesaWaiting.value = true
    pollCount.value    = 0

    pollInterval = setInterval(async () => {
      pollCount.value++
      try {
        const status = await $fetch<any>(`/api/mpesa/status/${orderId}`)
        if (status.paid) {
          clearInterval(pollInterval)
          mpesaWaiting.value = false
          router.push(`/checkout/confirmation/${status.orderNumber ?? orderId}`)
        }
      } catch {}
      if (pollCount.value >= 30) {
        clearInterval(pollInterval)
        mpesaWaiting.value = false
        submitError.value  = 'Payment confirmation timed out. If you paid, check your order history.'
      }
    }, 3000)
  } catch (err: any) {
    submitError.value = err?.data?.message ?? 'M-Pesa request failed'
  }
}

onUnmounted(() => { if (pollInterval) clearInterval(pollInterval) })

const kenyanCities = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Meru',
  'Nyeri', 'Garissa', 'Kitale', 'Malindi', 'Lamu', 'Kakamega', 'Kericho',
  'Kisii', 'Migori', 'Machakos', 'Isiolo', 'Wajir', 'Marsabit',
]
</script>
