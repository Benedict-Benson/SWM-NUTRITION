<template>
  <div>
    <div class="page-hero">
      <div class="wrap">
        <h1 class="h1">My Appointments</h1>
        <p class="body-sm text-[#64748b] mt-2">Track and manage your booked appointments</p>
      </div>
    </div>

    <section class="section bg-[#f8fafc]">
      <div class="wrap max-w-3xl mx-auto">

        <!-- Account nav -->
        <div class="flex gap-2 mb-6">
          <NuxtLink to="/account/profile" class="btn btn-sm btn-outline">Profile</NuxtLink>
          <NuxtLink to="/account/orders" class="btn btn-sm btn-outline">My Orders</NuxtLink>
          <NuxtLink to="/account/appointments" class="btn btn-sm btn-primary">My Appointments</NuxtLink>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="card p-5 animate-pulse">
            <div class="flex gap-4">
              <div class="h-4 bg-[#e2e8f0] rounded w-1/4"/>
              <div class="h-4 bg-[#e2e8f0] rounded w-1/3 ml-auto"/>
            </div>
            <div class="mt-3 h-3 bg-[#e2e8f0] rounded w-3/4"/>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!appointments.length" class="text-center py-16">
          <div class="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <h3 class="font-bold text-[#0f172a] mb-2">No appointments yet</h3>
          <p class="text-[#64748b] text-sm mb-5">Book a consultation to get started on your wellness journey.</p>
          <NuxtLink to="/services" class="btn btn-primary">Book Now</NuxtLink>
        </div>

        <!-- Appointments list -->
        <div v-else class="space-y-4">
          <div v-for="appt in appointments" :key="appt.id" class="card overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <div>
                <p class="font-bold text-[#0f172a] text-sm">{{ appt.service_type }}</p>
                <p class="text-xs text-[#94a3b8] mt-0.5">Ref: {{ appt.ref }}</p>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded-full capitalize" :class="statusCls(appt.status)">
                {{ appt.status }}
              </span>
            </div>

            <!-- Details -->
            <div class="px-5 py-4 space-y-2.5">
              <div class="flex items-center gap-2 text-sm text-[#64748b]">
                <svg class="w-4 h-4 text-[#1a7a4a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{{ fmtDate(appt.scheduled_at) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-[#64748b]">
                <svg class="w-4 h-4 text-[#1a7a4a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="capitalize">{{ appt.mode === 'in_person' ? 'In Person' : 'Online / Video' }}</span>
              </div>
              <div v-if="appt.notes" class="flex items-start gap-2 text-sm text-[#64748b]">
                <svg class="w-4 h-4 text-[#1a7a4a] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>{{ appt.notes }}</span>
              </div>
              <!-- Meeting link (if confirmed) -->
              <div v-if="appt.meeting_link" class="flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-[#1a7a4a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14"/><rect x="1" y="6" width="15" height="12" rx="2"/></svg>
                <a :href="appt.meeting_link" target="_blank" class="text-[#1a7a4a] font-semibold hover:underline">Join Meeting</a>
              </div>
              <!-- Admin notes (if any) -->
              <div v-if="appt.admin_notes" class="mt-2 p-3 bg-[#e8f5ee] rounded-xl text-sm text-[#1a7a4a]">
                <p class="font-semibold text-xs mb-1">Note from SWM Nutrition:</p>
                <p>{{ appt.admin_notes }}</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-5 py-3 border-t border-[#e2e8f0] flex justify-between items-center">
              <p class="text-xs text-[#94a3b8]">Booked {{ fmtDateShort(appt.created_at) }}</p>
              
                :href="`https://wa.me/254700123456?text=I need help with appointment ${appt.ref}`"
                target="_blank"
                class="text-xs text-[#64748b] hover:text-[#1a7a4a] transition-colors"
              <a>Need help?</a>
            
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'My Appointments – SWM Nutrition' })

const supabase     = useSupabaseClient()
const loading      = ref(true)
const appointments = ref<any[]>([])

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', session.user.id)
    .order('scheduled_at', { ascending: false })

  appointments.value = data ?? []
  loading.value      = false
})

function statusCls(s: string) {
  const m: Record<string, string> = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  }
  return m[s] ?? 'bg-[#e2e8f0] text-[#64748b]'
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtDateShort(ts: string) {
  return new Date(ts).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>