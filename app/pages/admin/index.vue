<template>
  <div>
    <div class="flex items-center justify-between mb-7">
      <div>
        <h1 class="text-xl font-bold text-[#0f172a]">Dashboard</h1>
        <p class="text-sm text-[#64748b] mt-0.5">Welcome back, {{ firstName }} 👋</p>
      </div>
      <p class="text-xs text-[#94a3b8] hidden sm:block">{{ today }}</p>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      <template v-if="loading">
        <div v-for="i in 8" :key="i" class="card p-5 animate-pulse">
          <div class="h-3 bg-[#e2e8f0] rounded mb-4 w-16"/>
          <div class="h-6 bg-[#e2e8f0] rounded w-20"/>
        </div>
      </template>
      <template v-else>
        <div v-for="s in statCards" :key="s.label" class="card p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="s.iconBg" v-html="s.icon"/>
            <span class="badge text-[10px] font-bold" :class="s.badgeCls">{{ s.badge }}</span>
          </div>
          <p class="text-[#64748b] text-xs mb-1">{{ s.label }}</p>
          <p class="text-[#0f172a] font-extrabold text-xl leading-none">{{ s.value }}</p>
        </div>
      </template>
    </div>

    <!-- Lower panels -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Recent orders -->
      <div class="lg:col-span-2 card overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
          <h2 class="font-bold text-[#0f172a]">Recent Orders</h2>
          <NuxtLink to="/admin/orders" class="text-xs text-[#1a7a4a] font-semibold hover:underline">View all →</NuxtLink>
        </div>
        <div class="divide-y divide-[#f1f5f9]">
          <div v-if="!orders.length" class="px-5 py-10 text-center text-sm text-[#94a3b8]">No orders yet</div>
          <div v-for="o in orders" :key="o.id" class="px-5 py-3.5 flex items-center gap-3 hover:bg-[#f8fafc] transition-colors">
            <div class="w-8 h-8 rounded-full bg-[#e8f5ee] flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-[#0f172a] truncate">{{ o.customer_name }}</p>
              <p class="text-xs text-[#94a3b8]">#{{ o.order_number }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-[#0f172a]">KSh {{ Number(o.total).toLocaleString() }}</p>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize" :class="statusCls(o.status)">{{ o.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <!-- Upcoming appointments -->
        <div class="card overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3.5 border-b border-[#e2e8f0]">
            <h2 class="font-bold text-[#0f172a] text-sm">Appointments</h2>
            <NuxtLink to="/admin/appointments" class="text-xs text-[#1a7a4a] font-semibold hover:underline">View all →</NuxtLink>
          </div>
          <div class="divide-y divide-[#f1f5f9]">
            <div v-if="!appointments.length" class="px-4 py-6 text-center text-xs text-[#94a3b8]">No upcoming</div>
            <div v-for="a in appointments" :key="a.id" class="px-4 py-3">
              <p class="text-sm font-semibold text-[#0f172a]">{{ a.client_name }}</p>
              <p class="text-xs text-[#64748b]">{{ a.service_type }}</p>
              <p class="text-xs text-[#1a7a4a] font-medium mt-0.5">{{ fmtDate(a.scheduled_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Unread messages -->
        <div class="card overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3.5 border-b border-[#e2e8f0]">
            <h2 class="font-bold text-[#0f172a] text-sm">Unread Messages</h2>
            <NuxtLink to="/admin/messages" class="text-xs text-[#1a7a4a] font-semibold hover:underline">View all →</NuxtLink>
          </div>
          <div class="divide-y divide-[#f1f5f9]">
            <div v-if="!unreadMsgs.length" class="px-4 py-6 text-center text-xs text-[#94a3b8]">All caught up!</div>
            <div v-for="m in unreadMsgs" :key="m.id" class="px-4 py-3">
              <p class="text-sm font-semibold text-[#0f172a]">{{ m.name }}</p>
              <p class="text-xs text-[#94a3b8] line-clamp-1 mt-0.5">{{ m.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin Dashboard – SWM Nutrition' })

const supabase = useSupabaseClient()
const admin    = useAdmin()

const loading      = ref(true)
const firstName    = ref('Admin')
const stats        = ref<Record<string, any>>({})
const orders       = ref<any[]>([])
const appointments = ref<any[]>([])
const unreadMsgs   = ref<any[]>([])

const today = new Date().toLocaleDateString('en-KE', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
})

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const { data } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single()
    if (data?.full_name) firstName.value = data.full_name.split(' ')[0]
  }
  try {
    const [s, { orders: o }, { appointments: a }, { messages: m }] = await Promise.all([
      admin.getDashboardStats(),
      admin.fetchOrders({ limit: 5 }),
      admin.fetchAllAppointments({ status: 'confirmed', limit: 4 }),
      admin.fetchContactMessages({ status: 'unread', limit: 4 }),
    ])
    stats.value        = s
    orders.value       = o
    appointments.value = a
    unreadMsgs.value   = m
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

const ic = (d: string, cls: string) =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${d}</svg>`

const statCards = computed(() => [
  { label: 'Total Revenue',    value: `KSh ${Number(stats.value.total_revenue ?? 0).toLocaleString()}`,     badge: 'all time',      badgeCls: 'badge-green',                   iconBg: 'bg-[#e8f5ee]', icon: ic('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', 'w-4 h-4 text-[#1a7a4a]') },
  { label: 'Total Orders',     value: stats.value.total_orders ?? 0,                                         badge: 'all time',      badgeCls: 'badge-green',                   iconBg: 'bg-blue-50',   icon: ic('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>', 'w-4 h-4 text-blue-600') },
  { label: 'Pending Orders',   value: stats.value.pending_orders ?? 0,                                       badge: 'action needed', badgeCls: 'bg-amber-100 text-amber-700',   iconBg: 'bg-amber-50',  icon: ic('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 'w-4 h-4 text-amber-600') },
  { label: 'Active Products',  value: stats.value.total_products ?? 0,                                       badge: 'live',          badgeCls: 'badge-green',                   iconBg: 'bg-[#e8f5ee]', icon: ic('<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>', 'w-4 h-4 text-[#1a7a4a]') },
  { label: 'Total Clients',    value: stats.value.total_customers ?? 0,                                      badge: 'registered',    badgeCls: 'badge-green',                   iconBg: 'bg-[#e8f5ee]', icon: ic('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>', 'w-4 h-4 text-[#1a7a4a]') },
  { label: 'Appointments',     value: stats.value.pending_appts ?? 0,                                        badge: 'pending',       badgeCls: 'bg-purple-100 text-purple-700', iconBg: 'bg-purple-50', icon: ic('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', 'w-4 h-4 text-purple-600') },
  { label: 'Unread Messages',  value: stats.value.unread_messages ?? 0,                                      badge: 'unread',        badgeCls: 'bg-red-100 text-red-600',       iconBg: 'bg-red-50',    icon: ic('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', 'w-4 h-4 text-red-500') },
  { label: 'Published Posts',  value: stats.value.total_posts ?? 0,                                          badge: 'live',          badgeCls: 'badge-green',                   iconBg: 'bg-[#e8f5ee]', icon: ic('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', 'w-4 h-4 text-[#1a7a4a]') },
])

function statusCls(s: string) {
  const m: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', paid: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600' }
  return m[s] ?? 'bg-[#e2e8f0] text-[#64748b]'
}
function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
