<template>
  <div>
    <div class="page-hero">
      <div class="wrap">
        <h1 class="h1">My Orders</h1>
        <p class="body-sm text-[#64748b] mt-2">Track and manage your orders</p>
      </div>
    </div>

    <section class="section bg-[#f8fafc]">
      <div class="wrap max-w-3xl mx-auto">
        <!-- Account nav -->
        <div class="flex gap-2 mb-6">
          <NuxtLink to="/account/profile" class="btn btn-sm btn-outline">Profile</NuxtLink>
          <NuxtLink to="/account/orders" class="btn btn-sm btn-primary">My Orders</NuxtLink>
          <NuxtLink to="/account/appointments" class="btn btn-sm btn-outline">My Appointments</NuxtLink>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="card p-5 animate-pulse">
            <div class="flex gap-4"><div class="h-4 bg-[#e2e8f0] rounded w-1/4"/><div class="h-4 bg-[#e2e8f0] rounded w-1/3 ml-auto"/></div>
            <div class="mt-3 h-3 bg-[#e2e8f0] rounded w-3/4"/>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!orders.length" class="text-center py-16">
          <div class="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <h3 class="font-bold text-[#0f172a] mb-2">No orders yet</h3>
          <p class="text-[#64748b] text-sm mb-5">Start shopping to see your orders here.</p>
          <NuxtLink to="/shop" class="btn btn-primary">Shop Now</NuxtLink>
        </div>

        <!-- Orders list -->
        <div v-else class="space-y-4">
          <div v-for="order in orders" :key="order.id" class="card overflow-hidden">
            <div class="flex items-center justify-between px-5 py-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <div>
                <p class="font-bold text-[#0f172a] text-sm">#{{ order.order_number }}</p>
                <p class="text-xs text-[#94a3b8]">{{ fmtDate(order.created_at) }}</p>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold px-2.5 py-1 rounded-full capitalize" :class="statusCls(order.status)">{{ order.status }}</span>
                <p class="font-extrabold text-[#1a7a4a] text-sm mt-1">KSh {{ Number(order.total).toLocaleString() }}</p>
              </div>
            </div>
            <div class="px-5 py-4">
              <div class="flex gap-2 flex-wrap mb-3">
                <img
                  v-for="item in (order.order_items ?? []).slice(0,4)"
                  :key="item.id"
                  :src="item.image ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&q=60'"
                  :alt="item.name"
                  class="w-12 h-12 rounded-xl object-cover bg-[#f1f5f9]"
                />
                <div v-if="(order.order_items?.length ?? 0) > 4" class="w-12 h-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-xs font-bold text-[#64748b]">
                  +{{ (order.order_items?.length ?? 0) - 4 }}
                </div>
              </div>
              <p class="text-xs text-[#64748b]">{{ order.order_items?.length ?? 0 }} item(s) · {{ order.payment_method?.replace('_',' ') }}</p>
            </div>

            <!-- Order status tracker -->
            <div class="px-5 py-4 border-t border-[#f1f5f9]">
              <div class="flex items-center justify-between relative">
                <div class="absolute left-0 right-0 top-3 h-0.5 bg-[#e2e8f0] z-0" />
                <div
                  class="absolute left-0 top-3 h-0.5 bg-[#1a7a4a] z-0 transition-all duration-500"
                  :style="`width: ${trackWidth(order.status)}%`"
                />
                <div v-for="step in trackSteps" :key="step.key" class="flex flex-col items-center z-10 gap-1.5">
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all"
                    :class="isStepDone(order.status, step.key)
                      ? 'bg-[#1a7a4a] border-[#1a7a4a] text-white'
                      : 'bg-white border-[#e2e8f0] text-[#94a3b8]'"
                  >
                    <svg v-if="isStepDone(order.status, step.key)" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span v-else>{{ step.n }}</span>
                  </div>
                  <span class="text-[10px] text-[#64748b] font-medium">{{ step.label }}</span>
                </div>
              </div>
            </div>

            <div class="px-5 py-3 border-t border-[#e2e8f0] flex justify-between items-center">
              <NuxtLink :to="`/checkout/confirmation/${order.order_number}`" class="text-[#1a7a4a] text-sm font-semibold hover:underline">
                View Details →
              </NuxtLink>
              <a v-if="order.status==='pending'||order.status==='paid'"
                :href="`https://wa.me/254700123456?text=I need help with order ${order.order_number}`"
                target="_blank"
                class="text-xs text-[#64748b] hover:text-[#1a7a4a] transition-colors"
              >Need help?</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'My Orders – SWM Nutrition' })

const supabase = useSupabaseClient()
const { fetchMyOrders, loading } = useOrders()
const orders = ref<any[]>([])

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  orders.value = await fetchMyOrders()
})

const trackSteps = [
  { key: 'pending',    label: 'Placed',     n: 1 },
  { key: 'paid',       label: 'Paid',       n: 2 },
  { key: 'processing', label: 'Processing', n: 3 },
  { key: 'shipped',    label: 'Shipped',    n: 4 },
  { key: 'delivered',  label: 'Delivered',  n: 5 },
]

const stepOrder = ['pending', 'paid', 'processing', 'shipped', 'delivered']

function isStepDone(status: string, stepKey: string) {
  if (status === 'cancelled') return false
  return stepOrder.indexOf(status) >= stepOrder.indexOf(stepKey)
}

function trackWidth(status: string) {
  if (status === 'cancelled') return 0
  const idx = stepOrder.indexOf(status)
  if (idx <= 0) return 0
  return (idx / (stepOrder.length - 1)) * 100
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusCls(s: string) {
  const m: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700', paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600',
  }
  return m[s] ?? 'bg-[#e2e8f0] text-[#64748b]'
}
</script>