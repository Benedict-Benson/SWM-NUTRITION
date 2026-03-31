<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <h1 class="text-xl font-bold text-[#0f172a]">Clients</h1>
      <input
        v-model="search" type="text"
        placeholder="Search name or phone…"
        class="input py-2 text-sm w-64"
        @input="debouncedFetch"
      />
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th v-for="h in headers" :key="h" class="text-left text-xs font-semibold text-[#64748b] px-4 py-3 whitespace-nowrap">{{ h }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f1f5f9]">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-12 text-center">
                <svg class="w-5 h-5 animate-spin text-[#1a7a4a] mx-auto" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              </td>
            </tr>
            <tr v-else-if="!clients.length">
              <td colspan="6" class="px-4 py-12 text-center text-[#94a3b8]">No clients found</td>
            </tr>
            <tr v-for="c in clients" :key="c.id" class="hover:bg-[#f8fafc] transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#1a7a4a] font-bold text-sm shrink-0">
                    {{ initials(c.full_name) }}
                  </div>
                  <div>
                    <p class="font-semibold text-[#0f172a]">{{ c.full_name || '—' }}</p>
                    <p class="text-xs text-[#94a3b8]">{{ c.id.slice(0, 8) }}…</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-[#64748b]">{{ c.phone || '—' }}</td>
              <td class="px-4 py-3 text-[#64748b]">{{ c.city || '—' }}</td>
              <td class="px-4 py-3 text-[#64748b]">{{ c.country || '—' }}</td>
              <td class="px-4 py-3 text-[#64748b]">{{ fmtDate(c.created_at) }}</td>
              <td class="px-4 py-3">
                <span class="text-xs font-semibold px-2 py-1 rounded-full bg-[#e8f5ee] text-[#1a7a4a] capitalize">{{ c.role }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-5 py-3.5 border-t border-[#e2e8f0] flex items-center justify-between">
        <p class="text-xs text-[#64748b]">Showing {{ clients.length }} of {{ total }} clients</p>
        <div class="flex items-center gap-1">
          <button class="btn btn-outline btn-sm" :disabled="page <= 1" @click="page--; fetchData()">← Prev</button>
          <span class="px-3 text-sm text-[#64748b]">{{ page }}</span>
          <button class="btn btn-outline btn-sm" :disabled="clients.length < limit" @click="page++; fetchData()">Next →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Clients – SWM Admin' })

const admin   = useAdmin()
const clients = ref<any[]>([])
const total   = ref(0)
const loading = ref(true)
const page    = ref(1)
const limit   = 20
const search  = ref('')

const headers = ['Client', 'Phone', 'City', 'Country', 'Joined', 'Role']

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchData() }, 380)
}

async function fetchData() {
  loading.value = true
  try {
    const r = await admin.fetchClients({ page: page.value, limit, search: search.value })
    clients.value = r.clients
    total.value   = r.total
  } finally {
    loading.value = false
  }
}

function initials(name: string) {
  if (!name) return '?'
  return name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
}

function fmtDate(ts: string) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(fetchData)
</script>