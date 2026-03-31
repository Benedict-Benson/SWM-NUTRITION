// composables/useProducts.ts
import type { Product, ProductReview, ApiResponse } from '~/types/shop'

export function useProducts() {
  const supabase = useSupabaseClient()
  const loading  = ref(false)
  const error    = ref<string | null>(null)

  // ── Fetch all active products with filter/sort/search ─────
  async function fetchProducts({
    category = null as string | null,
    search   = '',
    sort     = 'newest' as 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'featured',
    limit    = 20,
    page     = 1,
  } = {}) {
    loading.value = true
    error.value   = null
    try {
      let query = supabase
        .from('products')
        .select('id,slug,name,short_desc,category,price,original_price,images,rating,review_count,is_featured,stock_quantity', { count: 'exact' })
        .eq('is_active', true)
        .range((page - 1) * limit, page * limit - 1)

      if (category && category !== 'All') query = query.eq('category', category)
      if (search) query = query.ilike('name', `%${search}%`)

      // Sorting
      switch (sort) {
        case 'price_asc':  query = query.order('price', { ascending: true });  break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'popular':    query = query.order('review_count', { ascending: false }); break
        case 'featured':   query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false }); break
        default:           query = query.order('created_at', { ascending: false }); break
      }

      const { data, error: err, count } = await query
      if (err) throw err
      return { products: (data ?? []) as Product[], total: count ?? 0 }
    } catch (err: any) {
      error.value = err.message
      return { products: [], total: 0 }
    } finally {
      loading.value = false
    }
  }

  // ── Fetch single product by slug ─────────────────────────
  async function fetchProduct(slug: string) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()
      if (err) throw err
      return { product: data as Product, error: null }
    } catch (err: any) {
      return { product: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ── Fetch product reviews ─────────────────────────────────
  async function fetchReviews(productId: string): Promise<ProductReview[]> {
    const { data } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    return (data ?? []) as ProductReview[]
  }

  // ── Submit a review ───────────────────────────────────────
  async function submitReview(payload: {
    productId: string; rating: number; review: string
    reviewer: string; avatarUrl?: string
  }): Promise<ApiResponse<ProductReview>> {
    const user = useSupabaseUser()
    const { data, error: err } = await supabase
      .from('product_reviews')
      .insert({
        product_id:  payload.productId,
        user_id:     user.value?.id ?? null,
        reviewer:    payload.reviewer,
        avatar_url:  payload.avatarUrl ?? null,
        rating:      payload.rating,
        review:      payload.review,
        is_verified: !!user.value,
      })
      .select()
      .single()
    if (err) return { success: false, error: err.message }
    return { success: true, data: data as ProductReview }
  }

  // ── Fetch featured / related products ────────────────────
  async function fetchFeatured(limit = 4): Promise<Product[]> {
    const { data } = await supabase
      .from('products')
      .select('id,slug,name,short_desc,price,original_price,images,rating,review_count,category,stock_quantity')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(limit)
    return (data ?? []) as Product[]
  }

  async function fetchRelated(category: string, excludeId: string, limit = 4): Promise<Product[]> {
    const { data } = await supabase
      .from('products')
      .select('id,slug,name,price,original_price,images,rating,category')
      .eq('is_active', true)
      .eq('category', category)
      .neq('id', excludeId)
      .limit(limit)
    return (data ?? []) as Product[]
  }

  return {
    loading, error,
    fetchProducts, fetchProduct, fetchReviews, submitReview,
    fetchFeatured, fetchRelated,
  }
}
