<template>
  <div>
    <!-- Trigger bubble -->
    <Transition name="fade">
      <button
        v-if="!open"
        class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1a7a4a] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        style="box-shadow:0 8px 30px -4px rgb(26 122 74/50%)"
        aria-label="Open chat"
        @click="openChat"
      >
        <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span
          v-if="unread > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
        >{{ unread }}</span>
      </button>
    </Transition>

    <!-- Chat window -->
    <Transition name="slide">
      <div
        v-if="open"
        class="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl overflow-hidden bg-white"
        style="height:480px;box-shadow:0 24px 64px -12px rgb(0 0 0/28%)"
      >
        <!-- Header -->
        <div class="bg-[#1a7a4a] px-4 py-3 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span class="text-white text-xs font-extrabold">SW</span>
            </div>
            <div>
              <p class="font-bold text-white text-sm leading-none">SWM Nutrition</p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                <span class="text-[11px] text-green-200">Online – we reply fast!</span>
              </div>
            </div>
          </div>
          <button
            class="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            @click="open = false"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Messages scroll area -->
        <div ref="msgEl" class="flex-1 overflow-y-auto bg-[#f8fafc] p-4 space-y-3">
          <!-- Static welcome -->
          <div class="flex gap-2.5">
            <div class="w-7 h-7 rounded-full bg-[#1a7a4a] flex items-center justify-center shrink-0 mt-0.5">
              <span class="text-white text-[9px] font-bold">SW</span>
            </div>
            <div class="bg-white rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[78%] border border-[#e2e8f0]">
              <p class="text-sm text-[#0f172a]">Hi there! 👋 Welcome to SWM Nutrition. How can we help you today?</p>
            </div>
          </div>

          <!-- Dynamic messages -->
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.is_admin ? 'gap-2.5' : 'justify-end'"
          >
            <div
              v-if="msg.is_admin"
              class="w-7 h-7 rounded-full bg-[#1a7a4a] flex items-center justify-center shrink-0 mt-0.5"
            >
              <span class="text-white text-[9px] font-bold">SW</span>
            </div>
            <div
              class="rounded-2xl px-3.5 py-2.5 max-w-[78%]"
              :class="msg.is_admin
                ? 'bg-white border border-[#e2e8f0] rounded-tl-none'
                : 'bg-[#1a7a4a] text-white rounded-tr-none'"
            >
              <p class="text-sm leading-relaxed">{{ msg.content }}</p>
              <p class="text-[10px] mt-1 opacity-60">{{ fmt(msg.created_at) }}</p>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="loading" class="flex gap-2.5">
            <div class="w-7 h-7 rounded-full bg-[#1a7a4a] flex items-center justify-center shrink-0">
              <span class="text-white text-[9px] font-bold">SW</span>
            </div>
            <div class="bg-white border border-[#e2e8f0] rounded-2xl rounded-tl-none px-4 py-3">
              <div class="flex gap-1 items-center h-4">
                <span
                  v-for="i in 3" :key="i"
                  class="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce"
                  :style="`animation-delay:${(i-1)*150}ms`"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick replies (shown before any messages) -->
        <div v-if="!messages.length && !loading" class="px-4 pb-3 bg-[#f8fafc] flex flex-wrap gap-1.5 shrink-0">
          <button
            v-for="q in quickReplies" :key="q"
            class="text-xs bg-white border border-[#e2e8f0] text-[#1a7a4a] font-medium px-3 py-1.5 rounded-full hover:border-[#1a7a4a] transition-colors"
            @click="sendQuick(q)"
          >{{ q }}</button>
        </div>

        <!-- Input -->
        <div class="bg-white border-t border-[#e2e8f0] p-3 shrink-0">
          <!-- Not logged in -->
          <div v-if="!session" class="text-center py-1">
            <p class="text-xs text-[#64748b] mb-2.5">Sign in to chat with our team.</p>
            <NuxtLink to="/login" class="btn btn-primary btn-sm btn-full" @click="open = false">
              Sign In to Chat
            </NuxtLink>
          </div>
          <!-- Logged in -->
          <div v-else class="flex gap-2">
            <input
              v-model="newMsg"
              type="text"
              placeholder="Type a message…"
              class="input py-2 text-sm flex-1"
              maxlength="500"
              @keydown.enter="send"
            />
            <button
              class="w-9 h-9 bg-[#1a7a4a] rounded-xl flex items-center justify-center shrink-0 hover:bg-[#156040] transition-colors disabled:opacity-40"
              :disabled="!newMsg.trim()"
              @click="send"
            >
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const { messages, initRoom, sendMessage, unsubscribe } = useChat()

const open    = ref(false)
const newMsg  = ref('')
const loading = ref(false)
const unread  = ref(0)
const session = ref<any>(null)
const msgEl   = ref<HTMLElement>()

const quickReplies = [
  'Book a consultation',
  'View pricing',
  'What services do you offer?',
  'Shop products',
]

onMounted(async () => {
  const { data: { session: s } } = await supabase.auth.getSession()
  session.value = s
})

async function openChat() {
  open.value = true
  unread.value = 0
  if (session.value && !messages.value.length) {
    loading.value = true
    await initRoom()
    loading.value = false
  }
  await nextTick()
  scrollBottom()
}

async function send() {
  if (!newMsg.value.trim()) return
  const content = newMsg.value.trim()
  newMsg.value = ''
  await sendMessage(content)
  await nextTick()
  scrollBottom()
}

async function sendQuick(text: string) {
  if (!session.value) { navigateTo('/login'); return }
  if (!open.value) await openChat()
  newMsg.value = text
  await send()
}

function scrollBottom() {
  if (msgEl.value) msgEl.value.scrollTop = msgEl.value.scrollHeight
}

function fmt(ts: string) {
  return new Date(ts).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

watch(messages, () => nextTick(scrollBottom), { deep: true })
onUnmounted(unsubscribe)
</script>