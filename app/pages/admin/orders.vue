<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <h1 class="text-xl font-bold text-[#0f172a]">Orders</h1>
      <div class="flex gap-2 flex-wrap">
        <input
          v-model="search" type="text" placeholder="Search order / customer…"
          class="input py-2 text-sm w-56" @input="debouncedFetch"
        />
        <select v-model="statusFilter" class="input py-2 text-sm w-36" @change="page = 1; fetchData()">
          <option value="">All statuses</option>
          <option v-for="s in allStatuses" :key="s" :value="s" class="capitalize">{{ s }}</option>
        </select>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 sm:grid-cols-7 gap-3 mb-6">
      <div v-for="s in allStatuses" :key="s" class="card p-3 text-center">
        <p class="text-xl font-extrabold text-[#0f172a]">{{ countByStatus(s) }}</p>
        <p class="text-[10px] text-[#64748b] capitalize mt-0.5">{{ s }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th v-for="h in headers" :key="h"
                class="text-left text-xs font-semibold text-[#64748b] px-4 py-3 whitespace-nowrap">{{ h }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f1f5f9]">
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-12 text-center">
                <svg class="w-5 h-5 animate-spin text-[#1a7a4a] mx-auto" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </td>
            </tr>
            <tr v-else-if="!orders.length">
              <td colspan="7" class="px-4 py-12 text-center text-[#94a3b8]">No orders found</td>
            </tr>
            <tr v-for="o in orders" :key="o.id" class="hover:bg-[#f8fafc] transition-colors">
              <td class="px-4 py-3">
                <p class="font-semibold text-[#0f172a]">#{{ o.order_number }}</p>
                <p class="text-xs text-[#94a3b8]">{{ fmtDate(o.created_at) }}</p>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-[#0f172a]">{{ o.customer_name }}</p>
                <p class="text-xs text-[#94a3b8]">{{ o.customer_email }}</p>
                <p class="text-xs text-[#94a3b8]">{{ o.customer_phone }}</p>
              </td>
              <td class="px-4 py-3 font-bold text-[#0f172a]">KSh {{ Number(o.total).toLocaleString() }}</td>
              <td class="px-4 py-3">
                <span class="text-xs font-semibold px-2 py-1 rounded-full capitalize" :class="statusCls(o.status)">
                  {{ o.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-[#64748b] capitalize text-sm">
                {{ (o.payment_method ?? '—').replace('_', ' ') }}
              </td>
              <td class="px-4 py-3 text-[#64748b] text-sm">{{ o.order_items?.length ?? 0 }} item(s)</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <select
                    class="text-xs border border-[#e2e8f0] rounded-lg px-2 py-1.5 bg-white text-[#0f172a] focus:outline-none focus:border-[#1a7a4a]"
                    :value="o.status"
                    @change="quickUpdate(o, ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="s in allStatuses" :key="s" :value="s" class="capitalize">{{ s }}</option>
                  </select>
                  <button
                    class="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e2e8f0] hover:border-[#1a7a4a] hover:text-[#1a7a4a] transition-colors"
                    title="View details"
                    @click="openDetail(o)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0]">
        <p class="text-xs text-[#94a3b8]">{{ total }} order(s)</p>
        <div class="flex gap-1">
          <button
            v-for="p in totalPages" :key="p"
            class="w-7 h-7 text-xs rounded-lg border transition-colors"
            :class="page === p ? 'bg-[#1a7a4a] text-white border-[#1a7a4a]' : 'border-[#e2e8f0] text-[#64748b] hover:border-[#1a7a4a]'"
            @click="page = p; fetchData()"
          >{{ p }}</button>
        </div>
      </div>
    </div>

    <!-- Order detail modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selected" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="selected = null">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 class="font-bold text-[#0f172a]">Order #{{ selected.order_number }}</h2>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f1f5f9]" @click="selected = null">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <!-- Customer -->
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Customer</p><p class="font-semibold text-[#0f172a]">{{ selected.customer_name }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Email</p><p class="text-[#0f172a]">{{ selected.customer_email }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Phone</p><p class="text-[#0f172a]">{{ selected.customer_phone || '—' }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Payment</p><p class="text-[#0f172a] capitalize">{{ (selected.payment_method ?? '—').replace('_',' ') }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Total</p><p class="font-bold text-[#1a7a4a]">KSh {{ Number(selected.total).toLocaleString() }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Date</p><p class="text-[#0f172a]">{{ fmtDate(selected.created_at) }}</p></div>
              </div>

              <!-- Shipping address -->
              <div v-if="selected.shipping_address" class="p-3 bg-[#f8fafc] rounded-xl text-sm text-[#64748b]">
                <p class="text-xs font-semibold text-[#94a3b8] mb-1">Shipping Address</p>
                {{ selected.shipping_address }}
              </div>

              <!-- Items -->
              <div>
                <p class="text-xs font-semibold text-[#94a3b8] mb-2">Items</p>
                <div class="space-y-2">
                  <div v-for="item in selected.order_items" :key="item.id" class="flex items-center gap-3">
                    <img :src="item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=60&q=60'"
                      class="w-10 h-10 rounded-lg object-cover bg-[#f1f5f9]" :alt="item.name" />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-[#0f172a]">{{ item.name }}</p>
                      <p class="text-xs text-[#94a3b8]">Qty: {{ item.quantity }} × KSh {{ Number(item.price).toLocaleString() }}</p>
                    </div>
                    <p class="text-sm font-bold text-[#0f172a]">KSh {{ Number(item.price * item.quantity).toLocaleString() }}</p>
                  </div>
                </div>
              </div>

              <!-- Status update -->
              <div>
                <label class="lbl">Update Status</label>
                <select v-model="editStatus" class="input">
                  <option v-for="s in allStatuses" :key="s" :value="s" class="capitalize">{{ s }}</option>
                </select>
              </div>

              <!-- Notes -->
              <div>
                <label class="lbl">Internal Notes</label>
                <textarea v-model="editNotes" class="input" rows="2" placeholder="Optional notes about this order…" />
              </div>
            </div>

            <div class="px-6 py-4 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button class="btn btn-outline" @click="selected = null">Cancel</button>
              <button class="btn btn-primary gap-2 disabled:opacity-60" :disabled="saving" @click="saveDetail">
                <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ saving ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Orders – Admin' })

const admin = useAdmin()

const orders       = ref<any[]>([])
const total        = ref(0)
const loading      = ref(false)
const page         = ref(1)
const limit        = 20
const search       = ref('')
const statusFilter = ref('')
const selected     = ref<any>(null)
const saving       = ref(false)
const editStatus   = ref('')
const editNotes    = ref('')

const headers    = ['Order', 'Customer', 'Total', 'Status', 'Payment', 'Items', 'Actions']
const allStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
const totalPages  = computed(() => Math.ceil(total.value / limit))

function countByStatus(s: string) {
  return orders.value.filter(o => o.status === s).length
}

async function fetchData() {
  loading.value = true
  try {
    const r = await admin.fetchOrders({ status: statusFilter.value, page: page.value, limit, search: search.value })
    orders.value = r.orders
    total.value  = r.total
  } finally {
    loading.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchData() }, 400)
}
async function quickUpdate(order: any, status: string) {
  await admin.updateOrderStatus(order.id, status)
  await fetchData()
}

function openDetail(order: any) {
  selected.value  = order
  editStatus.value = order.status
  editNotes.value  = order.notes ?? ''
}

async function saveDetail() {
  if (!selected.value) return
  saving.value = true
  await admin.updateOrderStatus(selected.value.id, editStatus.value, editNotes.value)
  saving.value   = false
  selected.value = null
  await fetchData()
}

function statusCls(s: string) {
  const m: Record<string, string> = {
    pending:    'bg-amber-100 text-amber-700',
    paid:       'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped:    'bg-indigo-100 text-indigo-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-600',
    refunded:   'bg-gray-100 text-gray-600',
  }
  return m[s] ?? 'bg-[#e2e8f0] text-[#64748b]'
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(fetchData)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>