// composables/usePosts.js
// Fetches, creates and manages blog posts.

export function usePosts() {
  const supabase = useSupabaseClient()
  const loading  = ref(false)
  const error    = ref(null)

  // ── Fetch all published posts ─────────────────────────────
  async function fetchPosts({ category = null, search = '', limit = 20, page = 1 } = {}) {
    loading.value = true
    error.value   = null
    try {
      let query = supabase
        .from('posts')
        .select('id,slug,title,excerpt,cover_image,category,tags,read_time,views,published_at,author_id')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (category && category !== 'All') query = query.eq('category', category)
      if (search) query = query.ilike('title', `%${search}%`)

      const { data, error: err, count } = await query
      if (err) throw err
      return { posts: data ?? [], count }
    } catch (err) {
      error.value = err.message
      return { posts: [], count: 0 }
    } finally {
      loading.value = false
    }
  }

  // ── Fetch single post by slug ─────────────────────────────
  async function fetchPost(slug) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('posts')
        .select('*, profiles(full_name, avatar_url)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (err) throw err

      // Increment view count (fire-and-forget)
      supabase.rpc('increment_post_views', { post_slug: slug }).then(() => {})

      return { post: data, error: null }
    } catch (err) {
      return { post: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ── Fetch featured post ───────────────────────────────────
  async function fetchFeaturedPost() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()
    return data
  }

  // ── Related posts by category ─────────────────────────────
  async function fetchRelatedPosts(currentSlug, category, limit = 3) {
    const { data } = await supabase
      .from('posts')
      .select('slug,title,cover_image,category')
      .eq('status', 'published')
      .eq('category', category)
      .neq('slug', currentSlug)
      .limit(limit)
    return data ?? []
  }

  // ── Admin: create post ────────────────────────────────────
  async function createPost(postData) {
    const { user } = useAuth()
    const { data, error: err } = await supabase
      .from('posts')
      .insert({ ...postData, author_id: user.value?.id })
      .select()
      .single()
    if (err) return { success: false, error: err.message }
    return { success: true, data }
  }

  // ── Admin: update post ────────────────────────────────────
  async function updatePost(id, updates) {
    const { data, error: err } = await supabase
      .from('posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (err) return { success: false, error: err.message }
    return { success: true, data }
  }

  // ── Admin: delete post ────────────────────────────────────
  async function deletePost(id) {
    const { error: err } = await supabase.from('posts').delete().eq('id', id)
    if (err) return { success: false, error: err.message }
    return { success: true }
  }

  // ── Fetch all categories (distinct) ──────────────────────
  async function fetchCategories() {
    const { data } = await supabase
      .from('posts')
      .select('category')
      .eq('status', 'published')
    const cats = [...new Set((data ?? []).map(p => p.category))]
    return ['All', ...cats]
  }

  return { loading, error, fetchPosts, fetchPost, fetchFeaturedPost, fetchRelatedPosts, createPost, updatePost, deletePost, fetchCategories }
}