<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <h1 class="text-xl font-bold text-[#0f172a]">Appointments</h1>
      <select v-model="statusFilter" class="input py-2 text-sm w-44" @change="page=1; fetchData()">
        <option value="">All statuses</option>
        <option v-for="s in statuses" :key="s" :value="s" class="capitalize">{{ s }}</option>
      </select>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div v-for="s in statuses" :key="s" class="card p-4 text-center">
        <p class="text-2xl font-extrabold text-[#0f172a]">{{ countByStatus(s) }}</p>
        <p class="text-xs text-[#64748b] capitalize mt-0.5">{{ s }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th v-for="h in ['Ref','Client','Service','Date & Time','Mode','Status','Actions']" :key="h"
                class="text-left text-xs font-semibold text-[#64748b] px-4 py-3 whitespace-nowrap">{{ h }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f1f5f9]">
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-12 text-center text-[#94a3b8]">Loading…</td>
            </tr>
            <tr v-else-if="!appts.length">
              <td colspan="7" class="px-4 py-12 text-center text-[#94a3b8]">No appointments found</td>
            </tr>
            <tr v-for="a in appts" :key="a.id" class="hover:bg-[#f8fafc] transition-colors">
              <td class="px-4 py-3 font-semibold text-[#0f172a] text-xs">{{ a.ref }}</td>
              <td class="px-4 py-3">
                <p class="font-medium text-[#0f172a]">{{ a.client_name }}</p>
                <p class="text-xs text-[#94a3b8]">{{ a.client_email }}</p>
                <p v-if="a.client_phone" class="text-xs text-[#94a3b8]">{{ a.client_phone }}</p>
              </td>
              <td class="px-4 py-3 text-[#64748b]">{{ a.service_type }}</td>
              <td class="px-4 py-3 text-[#64748b] whitespace-nowrap">{{ fmtDate(a.scheduled_at) }}</td>
              <td class="px-4 py-3">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                  :class="a.mode === 'virtual' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                  {{ a.mode === 'in_person' ? 'In Person' : 'Virtual' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs font-semibold px-2 py-1 rounded-full capitalize" :class="aptCls(a.status)">
                  {{ a.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <!-- Quick status update -->
                  <select
                    class="text-xs border border-[#e2e8f0] rounded-lg px-2 py-1.5 text-[#0f172a] bg-white focus:outline-none focus:border-[#1a7a4a]"
                    :value="a.status"
                    @change="quickUpdate(a, ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="s in statuses" :key="s" :value="s" class="capitalize">{{ s }}</option>
                  </select>
                  <!-- Detail button -->
                  <button
                    class="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e2e8f0] hover:border-[#1a7a4a] hover:text-[#1a7a4a] transition-colors"
                    @click="openDetail(a)"
                    title="View / Edit"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0]">
        <p class="text-xs text-[#94a3b8]">{{ total }} appointment(s)</p>
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

    <!-- Detail / Edit modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selected" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="selected = null">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 class="font-bold text-[#0f172a]">Appointment — {{ selected.ref }}</h2>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f1f5f9]" @click="selected = null">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <!-- Client info -->
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Client</p><p class="font-semibold text-[#0f172a]">{{ selected.client_name }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Email</p><p class="text-[#0f172a]">{{ selected.client_email }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Phone</p><p class="text-[#0f172a]">{{ selected.client_phone || '—' }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Service</p><p class="text-[#0f172a]">{{ selected.service_type }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Date & Time</p><p class="text-[#0f172a]">{{ fmtDate(selected.scheduled_at) }}</p></div>
                <div><p class="text-xs text-[#94a3b8] mb-0.5">Mode</p><p class="text-[#0f172a] capitalize">{{ selected.mode === 'in_person' ? 'In Person' : 'Virtual' }}</p></div>
              </div>

              <div v-if="selected.notes" class="p-3 bg-[#f8fafc] rounded-xl text-sm text-[#64748b]">
                <p class="text-xs font-semibold text-[#94a3b8] mb-1">Client Notes</p>
                {{ selected.notes }}
              </div>

              <!-- Status update -->
              <div>
                <label class="lbl">Update Status</label>
                <select v-model="editStatus" class="input">
                  <option v-for="s in statuses" :key="s" :value="s" class="capitalize">{{ s }}</option>
                </select>
              </div>

              <!-- Meeting link (for virtual) -->
              <div v-if="selected.mode === 'virtual'">
                <label class="lbl">Meeting Link</label>
                <input v-model="editMeetingLink" type="url" class="input" placeholder="https://meet.google.com/..." />
              </div>

              <!-- Admin notes -->
              <div>
                <label class="lbl">Note to Client</label>
                <textarea v-model="editAdminNotes" class="input" rows="3" placeholder="Any message to the client…" />
              </div>
            </div>

            <div class="px-6 py-4 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button class="btn btn-outline" @click="selected = null">Cancel</button>
              <button class="btn btn-primary gap-2 disabled:opacity-60" :disabled="saving" @click="saveDetail">
                <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
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
useHead({ title: 'Appointments – Admin' })

const { fetchAllAppointments, updateAppointmentStatus } = useAppointments()

const appts        = ref<any[]>([])
const total        = ref(0)
const loading      = ref(false)
const page         = ref(1)
const limit        = 20
const statusFilter = ref('')
const selected     = ref<any>(null)
const saving       = ref(false)
const editStatus      = ref('')
const editMeetingLink = ref('')
const editAdminNotes  = ref('')

const statuses   = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']
const totalPages = computed(() => Math.ceil(total.value / limit))

function countByStatus(s: string) {
  return appts.value.filter(a => a.status === s).length
}

async function fetchData() {
  loading.value = true
  try {
    const r = await fetchAllAppointments({ status: statusFilter.value, page: page.value, limit })
    appts.value  = r.appointments
    total.value  = r.total
  } finally {
    loading.value = false
  }
}

async function quickUpdate(appt: any, status: string) {
  await updateAppointmentStatus(appt.id, status)
  await fetchData()
}

function openDetail(appt: any) {
  selected.value       = appt
  editStatus.value     = appt.status
  editMeetingLink.value = appt.meeting_link ?? ''
  editAdminNotes.value  = appt.admin_notes  ?? ''
}

async function saveDetail() {
  if (!selected.value) return
  saving.value = true
  await updateAppointmentStatus(selected.value.id, editStatus.value, {
    adminNotes:  editAdminNotes.value  || undefined,
    meetingLink: editMeetingLink.value || undefined,
  })
  saving.value = false
  selected.value = null
  await fetchData()
}

function aptCls(s: string) {
  const m: Record<string, string> = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
    no_show:   'bg-gray-100 text-gray-500',
  }
  return m[s] ?? 'bg-[#e2e8f0] text-[#64748b]'
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-KE', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(fetchData)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>