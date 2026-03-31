// composables/useAdmin.ts
// Full admin composable: stats, orders, products, posts, appointments, messages, clients

export function useAdmin() {
  const supabase = useSupabaseClient()

  // ── Dashboard stats ───────────────────────────────────────
  async function getDashboardStats() {
    const { data } = await supabase.rpc('get_dashboard_stats')
    return data ?? {}
  }

  // ── Orders ────────────────────────────────────────────────
  async function fetchOrders({ status = '', page = 1, limit = 20, search = '' } = {}) {
    let query = supabase
      .from('orders')
      .select('*, order_items(name,quantity,price,image)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)
    if (search) query = query.or(
      `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_number.ilike.%${search}%`
    )

    const { data, count } = await query
    return { orders: data ?? [], total: count ?? 0 }
  }

  async function updateOrderStatus(id: string, status: string, notes = '') {
    const updates: Record<string, any> = { status, updated_at: new Date().toISOString() }
    if (notes) updates.notes = notes
    if (status === 'paid') updates.paid_at = new Date().toISOString()
    const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select().single()
    return error ? { success: false, error: error.message } : { success: true, data }
  }

  // ── Products ──────────────────────────────────────────────
  async function fetchAllProducts({ category = '', page = 1, limit = 20, search = '' } = {}) {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (category) query = query.eq('category', category)
    if (search)   query = query.ilike('name', `%${search}%`)

    const { data, count } = await query
    return { products: data ?? [], total: count ?? 0 }
  }

  async function upsertProduct(product: Record<string, any>) {
    if (!product.slug && product.name) {
      product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    product.updated_at = new Date().toISOString()
    const { data, error } = await supabase.from('products').upsert(product).select().single()
    return error ? { success: false, error: error.message } : { success: true, data }
  }

  async function toggleProductActive(id: string, isActive: boolean) {
    const { error } = await supabase
      .from('products').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', id)
    return error ? { success: false } : { success: true }
  }

  async function deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    return error ? { success: false } : { success: true }
  }

  // ── Blog posts ────────────────────────────────────────────
  async function fetchAllPosts({ status = '', page = 1, limit = 20 } = {}) {
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)

    const { data, count } = await query
    return { posts: data ?? [], total: count ?? 0 }
  }

  async function upsertPost(post: Record<string, any>) {
    if (!post.slug && post.title) {
      post.slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    if (post.status === 'published' && !post.published_at) {
      post.published_at = new Date().toISOString()
    }
    post.updated_at = new Date().toISOString()
    const { data, error } = await supabase.from('posts').upsert(post).select().single()
    return error ? { success: false, error: error.message } : { success: true, data }
  }

  async function deletePost(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    return error ? { success: false } : { success: true }
  }

  // ── Appointments ──────────────────────────────────────────
  async function fetchAllAppointments({ status = '', page = 1, limit = 20 } = {}) {
    let query = supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .order('scheduled_at', { ascending: true })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)

    const { data, count } = await query
    return { appointments: data ?? [], total: count ?? 0 }
  }

  async function updateAppointmentStatus(id: string, status: string, adminNotes = '') {
    const updates: Record<string, any> = { status, updated_at: new Date().toISOString() }
    if (adminNotes) updates.admin_notes = adminNotes
    const { error } = await supabase.from('appointments').update(updates).eq('id', id)
    return error ? { success: false } : { success: true }
  }

  // ── Contact messages ──────────────────────────────────────
  async function fetchContactMessages({ status = '', page = 1, limit = 20 } = {}) {
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)

    const { data, count } = await query
    return { messages: data ?? [], total: count ?? 0 }
  }

  async function replyToMessage(id: string, replyText: string) {
    const { error } = await supabase.from('contact_messages').update({
      status:     'replied',
      reply_text: replyText,
      replied_at: new Date().toISOString(),
    }).eq('id', id)
    return error ? { success: false } : { success: true }
  }

  async function markMessageRead(id: string) {
    const { error } = await supabase.from('contact_messages')
      .update({ status: 'read' }).eq('id', id)
    return error ? { success: false } : { success: true }
  }

  // ── Clients ───────────────────────────────────────────────
  async function fetchClients({ page = 1, limit = 20, search = '' } = {}) {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('role', 'client')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (search) query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)

    const { data, count } = await query
    return { clients: data ?? [], total: count ?? 0 }
  }

  return {
    getDashboardStats,
    fetchOrders, updateOrderStatus,
    fetchAllProducts, upsertProduct, toggleProductActive, deleteProduct,
    fetchAllPosts, upsertPost, deletePost,
    fetchAllAppointments, updateAppointmentStatus,
    fetchContactMessages, replyToMessage, markMessageRead,
    fetchClients,
  }
}