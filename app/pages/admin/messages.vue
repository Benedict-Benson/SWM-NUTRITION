<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-[#0f172a]">Contact Messages</h1>
      <div class="flex items-center gap-3">
        <span class="text-xs text-[#94a3b8]">{{ total }} message(s)</span>
        <select v-model="statusFilter" class="input py-2 text-sm w-40" @change="page = 1; fetchData()">
          <option value="">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="card p-4 text-center">
        <p class="text-2xl font-extrabold text-amber-600">{{ countByStatus('unread') }}</p>
        <p class="text-xs text-[#64748b] mt-0.5">Unread</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-extrabold text-blue-600">{{ countByStatus('read') }}</p>
        <p class="text-xs text-[#64748b] mt-0.5">Read</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-extrabold text-[#1a7a4a]">{{ countByStatus('replied') }}</p>
        <p class="text-xs text-[#64748b] mt-0.5">Replied</p>
      </div>
    </div>

    <!-- Messages -->
    <div class="space-y-4">
      <div v-if="loading" class="card p-10 text-center text-[#94a3b8]">Loading…</div>
      <div v-else-if="!messages.length" class="card p-10 text-center text-[#94a3b8]">No messages found</div>

      <div v-for="m in messages" :key="m.id" class="card overflow-hidden" :class="m.status === 'unread' ? 'border-l-4 border-l-amber-400' : ''">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#1a7a4a] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {{ m.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-bold text-[#0f172a] text-sm">{{ m.name }}</p>
              <p class="text-xs text-[#94a3b8]">{{ m.email }}{{ m.phone ? ' · ' + m.phone : '' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-[#94a3b8]">{{ fmtDate(m.created_at) }}</span>
            <span class="text-xs font-semibold px-2 py-1 rounded-full capitalize" :class="statusCls(m.status)">{{ m.status }}</span>
          </div>
        </div>

        <!-- Body -->
        <div class="px-5 py-4">
          <p v-if="m.service" class="text-xs text-[#1a7a4a] font-semibold mb-2">Service: {{ m.service }}</p>
          <p class="text-sm text-[#0f172a] leading-relaxed">{{ m.message }}</p>

          <!-- Existing reply -->
          <div v-if="m.reply_text" class="mt-3 p-3 bg-[#e8f5ee] rounded-xl text-sm text-[#1a7a4a]">
            <p class="text-[10px] font-bold mb-1 text-[#1a7a4a]/70">YOUR REPLY:</p>
            {{ m.reply_text }}
          </div>

          <!-- Reply form -->
          <div v-if="replyingTo === m.id" class="mt-4 space-y-2">
            <textarea v-model="replyText" rows="3" placeholder="Type your reply…" class="input text-sm resize-none" />
            <div class="flex gap-2">
              <button class="btn btn-primary btn-sm disabled:opacity-60" :disabled="!replyText.trim() || replying" @click="sendReply(m.id)">
                <svg v-if="replying" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ replying ? 'Sending…' : 'Send Reply' }}
              </button>
              <button class="btn btn-outline btn-sm" @click="replyingTo = null">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="px-5 py-3 border-t border-[#e2e8f0] flex gap-2 flex-wrap">
          <button v-if="m.status === 'unread'" class="btn btn-outline btn-sm" @click="markRead(m.id)">Mark Read</button>
          <button v-if="m.status !== 'replied'" class="btn btn-primary btn-sm" @click="replyingTo = m.id; replyText = ''">Reply</button>
          <a :href="'mailto:' + m.email + '?subject=Re: Your SWM Nutrition Enquiry'" class="btn btn-outline btn-sm">Email Direct</a>
          <a v-if="m.phone" :href="'https://wa.me/' + m.phone.replace(/\D/g, '') + '?text=Hi ' + m.name + ', thank you for reaching out to SWM Nutrition!'" target="_blank" class="btn btn-outline btn-sm">WhatsApp</a>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button class="btn btn-outline btn-sm" :disabled="page <= 1" @click="page--; fetchData()">← Prev</button>
      <span class="text-sm text-[#64748b] flex items-center px-2">{{ page }} / {{ totalPages }}</span>
      <button class="btn btn-outline btn-sm" :disabled="page >= totalPages" @click="page++; fetchData()">Next →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Messages – Admin' })

const admin = useAdmin()

const messages     = ref<any[]>([])
const total        = ref(0)
const loading      = ref(false)
const page         = ref(1)
const limit        = 20
const statusFilter = ref('')
const replyingTo   = ref<string | null>(null)
const replyText    = ref('')
const replying     = ref(false)

const totalPages = computed(() => Math.ceil(total.value / limit))

function countByStatus(s: string) {
  return messages.value.filter(m => m.status === s).length
}

async function fetchData() {
  loading.value = true
  try {
    const r = await admin.fetchContactMessages({ status: statusFilter.value, page: page.value, limit })
    messages.value = r.messages
    total.value    = r.total
  } finally {
    loading.value = false
  }
}

async function markRead(id: string) {
  await admin.markMessageRead(id)
  await fetchData()
}

async function sendReply(id: string) {
  if (!replyText.value.trim()) return
  replying.value = true
  await admin.replyToMessage(id, replyText.value.trim())
  replying.value   = false
  replyingTo.value = null
  replyText.value  = ''
  await fetchData()
}

function statusCls(s: string) {
  const m: Record<string, string> = {
    unread:  'bg-amber-100 text-amber-700',
    read:    'bg-blue-100 text-blue-700',
    replied: 'bg-green-100 text-green-700',
  }
  return m[s] ?? 'bg-[#e2e8f0] text-[#64748b]'
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-KE', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

onMounted(fetchData)
</script>