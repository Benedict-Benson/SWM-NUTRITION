// composables/useMessages.ts
// Contact form submissions + realtime chat.

export function useMessages() {
  const supabase = useSupabaseClient()
  const loading  = ref(false)

  async function sendContactMessage({ name, email, phone, service, message }: {
    name: string; email: string; phone?: string; service?: string; message: string
  }) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({ name, email, phone, service, message, status: 'unread' })
        .select('id')
        .single()
      if (error) throw error
      return { success: true, id: data.id }
    } catch (err: any) {
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function subscribe(email: string) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email, is_active: true }, { onConflict: 'email' })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  async function fetchContactMessages({ status = '', page = 1, limit = 20 } = {}) {
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)

    const { data, count } = await query
    return { messages: data ?? [], count: count ?? 0 }
  }

  async function replyToMessage(id: string, replyText: string) {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'replied', reply_text: replyText, replied_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  async function markAsRead(id: string) {
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id)
  }

  return { loading, sendContactMessage, subscribe, fetchContactMessages, replyToMessage, markAsRead }
}

// ─────────────────────────────────────────────────────────────
// REALTIME CHAT
// ─────────────────────────────────────────────────────────────
export function useChat() {
  const supabase   = useSupabaseClient()
  const messages   = ref<ChatMessage[]>([])
  const room       = ref<any>(null)
  let   channel: any

  async function initRoom() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: existing } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_open', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existing) {
      room.value = existing
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single()

      const { data: newRoom } = await supabase
        .from('chat_rooms')
        .insert({
          user_id: session.user.id,
          title:   profile?.full_name ?? 'Customer',
          is_open: true,
        })
        .select()
        .single()
      room.value = newRoom
    }

    if (!room.value) return

    const { data: msgs } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', room.value.id)
      .order('created_at', { ascending: true })
      .limit(50)

    messages.value = msgs ?? []

    channel = supabase
      .channel(`chat-room-${room.value.id}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'chat_messages',
        filter: `room_id=eq.${room.value.id}`,
      }, (payload: any) => {
        const exists = messages.value.find(m => m.id === payload.new.id)
        if (!exists) messages.value.push(payload.new)
      })
      .subscribe()
  }

  async function sendMessage(content: string) {
    if (!room.value || !content.trim()) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data } = await supabase
      .from('chat_messages')
      .insert({
        room_id:   room.value.id,
        sender_id: session.user.id,
        content:   content.trim(),
        is_admin:  false,
        is_read:   false,
      })
      .select()
      .single()

    if (data && !messages.value.find(m => m.id === data.id)) {
      messages.value.push(data)
    }

    await supabase
      .from('chat_rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', room.value.id)
  }

  function unsubscribe() {
    channel?.unsubscribe()
    messages.value = []
    room.value     = null
  }

  return { messages, room, initRoom, sendMessage, unsubscribe }
}

interface ChatMessage {
  id:         string
  room_id:    string
  sender_id:  string
  content:    string
  is_admin:   boolean
  is_read:    boolean
  created_at: string
}