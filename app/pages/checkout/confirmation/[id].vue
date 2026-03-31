<template>
  <div class="bg-[#f8fafc] min-h-screen">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <svg class="w-8 h-8 animate-spin text-[#1a7a4a] mx-auto mb-3" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-[#64748b]">Loading your order...</p>
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!order" class="section text-center">
      <div class="wrap py-16">
        <h2 class="h2 mb-3">Order not found</h2>
        <p class="text-[#64748b] mb-7">We couldn't find this order. Please check your order number.</p>
        <div class="flex gap-3 justify-center">
          <NuxtLink to="/shop" class="btn btn-primary">Continue Shopping</NuxtLink>
          <NuxtLink to="/account/orders" class="btn btn-outline">My Orders</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Success -->
    <div v-else class="section">
      <div class="wrap max-w-3xl mx-auto">

        <!-- Success header -->
        <div class="text-center mb-8">
          <!-- Animated checkmark -->
          <div class="w-20 h-20 rounded-full bg-[#1a7a4a] flex items-center justify-center mx-auto mb-5 shadow-btn">
            <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 class="h1 text-[#0f172a] mb-2">Order Confirmed! 🎉</h1>
          <p class="body-lg text-[#64748b]">
            Thank you, <strong class="text-[#0f172a]">{{ order.customer_name.split(' ')[0] }}</strong>!
            Your order has been placed successfully.
          </p>
          <p class="text-sm text-[#94a3b8] mt-1">A confirmation will be sent to <strong>{{ order.customer_email }}</strong></p>
        </div>

        <!-- Order number card -->
        <div class="bg-[#1a7a4a] rounded-2xl px-7 py-5 text-center text-white mb-6">
          <p class="text-green-200 text-sm mb-1">Order Number</p>
          <p class="text-2xl font-extrabold tracking-wider">{{ order.order_number }}</p>
          <p class="text-green-200 text-xs mt-1">Save this for tracking your order</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <!-- Order Items -->
          <div class="card p-6">
            <h3 class="font-bold text-[#0f172a] mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Items Ordered ({{ order.order_items?.length }})
            </h3>
            <div class="space-y-3">
              <div v-for="item in order.order_items" :key="item.id" class="flex gap-3 items-center">
                <img :src="item.image ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&q=60'" :alt="item.name" class="w-12 h-12 rounded-xl object-cover bg-[#f1f5f9] shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-[#0f172a] line-clamp-2">{{ item.name }}</p>
                  <p class="text-xs text-[#94a3b8]">Qty: {{ item.quantity }} × KSh {{ Number(item.price).toLocaleString() }}</p>
                </div>
                <p class="text-sm font-bold text-[#0f172a] shrink-0">KSh {{ Number(item.subtotal).toLocaleString() }}</p>
              </div>
            </div>
            <!-- Totals -->
            <div class="border-t border-[#e2e8f0] mt-4 pt-4 space-y-2 text-sm">
              <div class="flex justify-between text-[#64748b]">
                <span>Subtotal</span>
                <span>KSh {{ Number(order.subtotal).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-[#64748b]">
                <span>Shipping</span>
                <span v-if="Number(order.shipping_fee) === 0" class="text-[#1a7a4a] font-semibold">FREE</span>
                <span v-else>KSh {{ Number(order.shipping_fee).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between font-bold text-[#0f172a] text-base pt-1 border-t border-[#e2e8f0]">
                <span>Total Paid</span>
                <span class="text-[#1a7a4a] text-xl">KSh {{ Number(order.total).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Delivery + Payment info -->
          <div class="space-y-4">
            <!-- Delivery address -->
            <div class="card p-5">
              <h4 class="font-bold text-[#0f172a] text-sm mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Delivery Address
              </h4>
              <div class="text-sm text-[#64748b] space-y-0.5">
                <p class="font-semibold text-[#0f172a]">{{ order.customer_name }}</p>
                <p>{{ order.shipping_address?.street }}</p>
                <p>{{ order.shipping_address?.city }}{{ order.shipping_address?.county ? ', ' + order.shipping_address.county : '' }}</p>
                <p v-if="order.shipping_address?.postal_code">{{ order.shipping_address.postal_code }}</p>
                <p>{{ order.shipping_address?.country ?? 'Kenya' }}</p>
                <p v-if="order.shipping_address?.instructions" class="mt-2 italic text-xs text-[#94a3b8]">{{ order.shipping_address.instructions }}</p>
              </div>
            </div>

            <!-- Payment status -->
            <div class="card p-5">
              <h4 class="font-bold text-[#0f172a] text-sm mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Payment
              </h4>
              <div class="flex items-center justify-between text-sm">
                <div>
                  <p class="text-[#64748b] capitalize">{{ (order.payment_method ?? 'mpesa').replace('_', ' ') }}</p>
                  <p v-if="order.payment_ref" class="text-xs text-[#94a3b8] mt-0.5">Ref: {{ order.payment_ref }}</p>
                </div>
                <span
                  class="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                  :class="statusCls(order.status)"
                >{{ order.status }}</span>
              </div>
            </div>

            <!-- Estimated delivery -->
            <div class="card p-5 bg-[#e8f5ee] border-[#c8e8d5]">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#1a7a4a] flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <div>
                  <p class="font-bold text-[#1a7a4a] text-sm">Estimated Delivery</p>
                  <p class="text-[#1a7a4a] text-xs">{{ estimatedDelivery }} (2–4 business days)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order status timeline -->
        <div class="card p-6 mb-6">
          <h3 class="font-bold text-[#0f172a] mb-5">Order Status</h3>
          <div class="flex items-start gap-0">
            <div v-for="(step, i) in statusSteps" :key="step.label" class="flex-1 flex flex-col items-center relative">
              <!-- Connector line -->
              <div v-if="i < statusSteps.length - 1" class="absolute top-4 left-1/2 right-0 h-0.5 -translate-y-1/2" :class="isStepDone(i) ? 'bg-[#1a7a4a]' : 'bg-[#e2e8f0]'" />
              <!-- Circle -->
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center z-10 text-xs font-bold shrink-0"
                :class="isStepActive(i) ? 'bg-[#1a7a4a] text-white ring-4 ring-[#e8f5ee]' : isStepDone(i) ? 'bg-[#1a7a4a] text-white' : 'bg-[#e2e8f0] text-[#94a3b8]'"
              >
                <svg v-if="isStepDone(i) && !isStepActive(i)" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <p class="text-[10px] text-center mt-2 font-medium" :class="isStepDone(i) ? 'text-[#1a7a4a]' : 'text-[#94a3b8]'">{{ step.label }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/shop" class="btn btn-primary btn-lg gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Continue Shopping
          </NuxtLink>
          <NuxtLink to="/account/orders" class="btn btn-outline btn-lg">Track Orders</NuxtLink>
          <button class="btn btn-outline btn-lg gap-2" @click="printPage">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Receipt
          </button>
        </div>

        <!-- WhatsApp CTA -->
        <div class="mt-6 bg-[#e8f5ee] rounded-2xl p-5 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-[#1a7a4a] flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.995 0C5.37 0 0 5.373 0 11.997c0 2.117.556 4.104 1.528 5.832L.057 24l6.305-1.654A11.955 11.955 0 0 0 12 24c6.624 0 12-5.373 12-12C24 5.373 18.62 0 11.995 0zm.005 21.785a9.826 9.826 0 0 1-5.012-1.368l-.36-.213-3.737.98.998-3.648-.234-.374A9.786 9.786 0 0 1 2.21 12c0-5.405 4.397-9.8 9.79-9.8 5.394 0 9.79 4.395 9.79 9.8 0 5.405-4.396 9.785-9.79 9.785z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-bold text-[#0f172a] text-sm">Need help with your order?</p>
            <p class="text-xs text-[#64748b]">Chat with us on WhatsApp for quick support</p>
          </div>
          <a
            :href="`https://wa.me/254700123456?text=Hi, I need help with order ${order.order_number}`"
            target="_blank"
            rel="noopener"
            class="btn btn-primary btn-sm shrink-0"
          >Chat Now</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/shop'

const route  = useRoute()
const order  = ref<Order | null>(null)
const loading = ref(true)

const orderNum = route.params.id as string

useHead({ title: `Order ${orderNum} – SWM Nutrition` })

const { fetchOrderByNumber } = useOrders()

onMounted(async () => {
  order.value = await fetchOrderByNumber(orderNum)
  loading.value = false
})

const estimatedDelivery = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 4)
  return d.toLocaleDateString('en-KE', { weekday: 'short', month: 'long', day: 'numeric' })
})

const statusOrder: Record<string, number> = {
  pending: 0, paid: 1, processing: 2, shipped: 3, delivered: 4
}
const statusSteps = [
  { label: 'Order Placed',  status: 'pending'    },
  { label: 'Payment',       status: 'paid'       },
  { label: 'Processing',    status: 'processing' },
  { label: 'Dispatched',    status: 'shipped'    },
  { label: 'Delivered',     status: 'delivered'  },
]

function isStepDone(i: number) {
  return statusOrder[order.value?.status ?? 'pending'] >= i
}
function isStepActive(i: number) {
  return statusOrder[order.value?.status ?? 'pending'] === i
}

function statusCls(s: string) {
  const map: Record<string, string> = {
    pending:    'bg-amber-100 text-amber-700',
    paid:       'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped:    'bg-indigo-100 text-indigo-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-600',
    refunded:   'bg-gray-100 text-gray-600',
  }
  return map[s] ?? 'bg-[#e2e8f0] text-[#64748b]'
}

function printPage() { window.print() }
</script>
