// server/api/products/[slug].get.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'slug required' })

  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) throw createError({ statusCode: 404, message: 'Product not found' })

  // Increment view counter (fire-and-forget)
  supabase.rpc('increment_product_views', { p_product_id: data.id }).catch(() => {})

  return { success: true, data }
})
