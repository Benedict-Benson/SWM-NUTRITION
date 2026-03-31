<template>
  <div>
    <h1 class="text-xl font-bold text-[#0f172a] mb-5">Chat Support</h1>
    <div class="flex gap-5" style="height:calc(100vh - 180px); min-height:500px">

      <!-- Room list -->
      <div class="w-72 shrink-0 card flex flex-col overflow-hidden">
        <div class="px-4 py-3.5 border-b border-[#e2e8f0] shrink-0">
          <p class="font-bold text-[#0f172a] text-sm">Conversations</p>
          <p class="text-xs text-[#94a3b8] mt-0.5">{{ rooms.length }} open</p>
        </div>
        <div class="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
          <div v-if="!rooms.length" class="p-6 text-center text-sm text-[#94a3b8]">No open chats yet</div>
          <button
            v-for="r in rooms" :key="r.id"
            class="w-full text-left px-4 py-3.5 hover:bg-[#f8fafc] transition-colors"
            :class="activeRoom?.id === r.id ? 'bg-[#e8f5ee]' : ''"
            @click="selectRoom(r)"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[#1a7a4a]/10 flex items-center justify-center shrink-0">
                <span class="text-[#1a7a4a] text-xs font-bold">{{ (r.title ?? 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-[#0f172a] truncate">{{ r.title ?? 'Guest' }}</p>
                <p class="text-xs text-[#94a3b8]">{{ r.is_open ? 'Open' : 'Closed' }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Conversation -->
      <div class="flex-1 card flex flex-col overflow-hidden">
        <div v-if="!activeRoom" class="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div class="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 class="font-bold text-[#0f172a] mb-1.5">Select a conversation</h3>
          <p class="text-sm text-[#64748b]">Choose a chat from the left to start responding</p>
        </div>

        <template v-else>
          <!-- Header -->
          <div class="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full bg-[#1a7a4a]/10 flex items-center justify-center">
                <span class="text-[#1a7a4a] font-bold">{{ (activeRoom.title ?? 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <p class="font-bold text-[#0f172a] text-sm">{{ activeRoom.title ?? 'Guest' }}</p>
                <div class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span class="text-[11px] text-[#64748b]">Active</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div ref="msgEl" class="flex-1 overflow-y-auto p-5 space-y-3 bg-[#f8fafc]">
            <div v-for="msg in roomMessages" :key="msg.id" class="flex" :class="msg.is_admin ? 'justify-end' : 'gap-2.5'">
              <div v-if="!msg.is_admin" class="w-7 h-7 rounded-full bg-[#1a7a4a]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-[#1a7a4a] text-[9px] font-bold">{{ (activeRoom.title ?? 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <div
                class="rounded-2xl px-3.5 py-2.5 max-w-[70%]"
                :class="msg.is_admin ? 'bg-[#1a7a4a] text-white rounded-tr-none' : 'bg-white border border-[#e2e8f0] rounded-tl-none'"
              >
                <p v-if="msg.is_ai" class="text-[10px] font-bold mb-1 opacity-70">🤖 AI Assistant</p>
                <p class="text-sm leading-relaxed">{{ msg.content }}</p>
                <p class="text-[10px] mt-1 opacity-60">{{ fmt(msg.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Reply input -->
          <div class="p-4 border-t border-[#e2e8f0] bg-white shrink-0">
            <div class="flex gap-2">
              <input
                v-model="reply" type="text" placeholder="Type your reply…"
                class="input py-2 text-sm flex-1"
                @keydown.enter="sendReply"
              />
              <button class="btn btn-primary gap-1.5" :disabled="!reply.trim()" @click="sendReply">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Send
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Chat Support – SWM Admin' })

const supabase    = useSupabaseClient()
const rooms       = ref<any[]>([])
const activeRoom  = ref<any>(null)
const roomMessages = ref<any[]>([])
const reply       = ref('')
const msgEl       = ref<HTMLElement>()
let   channel: any

onMounted(async () => {
  await loadRooms()
  supabase.channel('admin-new-rooms')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_rooms' }, () => loadRooms())
    .subscribe()
})

async function loadRooms() {
  const { data } = await supabase
    .from('chat_rooms').select('*').eq('is_open', true).order('updated_at', { ascending: false })
  rooms.value = data ?? []
}

async function selectRoom(r: any) {
  activeRoom.value = r
  channel?.unsubscribe()
  const { data } = await supabase
    .from('chat_messages').select('*').eq('room_id', r.id).order('created_at', { ascending: true }).limit(100)
  roomMessages.value = data ?? []
  await nextTick(); scrollBottom()
  channel = supabase.channel(`admin-room-${r.id}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${r.id}` },
      (payload: any) => { roomMessages.value.push(payload.new); nextTick(scrollBottom) })
    .subscribe()
}

async function sendReply() {
  if (!reply.value.trim() || !activeRoom.value) return
  const content = reply.value.trim()
  reply.value = ''
  const { data: { session } } = await supabase.auth.getSession()
  await supabase.from('chat_messages').insert({
    room_id:   activeRoom.value.id,
    sender_id: session!.user.id,
    content,
    is_admin:  true,
    is_read:   false,
  })
}

function scrollBottom() { if (msgEl.value) msgEl.value.scrollTop = msgEl.value.scrollHeight }
function fmt(ts: string) { return new Date(ts).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) }
onUnmounted(() => channel?.unsubscribe())
</script>
