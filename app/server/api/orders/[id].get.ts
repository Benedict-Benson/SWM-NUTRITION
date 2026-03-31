// server/api/orders/[id].get.ts
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Order ID required' })

  const supabase = serverSupabaseServiceRole(event)

  // Support lookup by order_number OR uuid
  const isUuid = /^[0-9a-f-]{36}$/i.test(id)
  const field  = isUuid ? 'id' : 'order_number'

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(id,name,quantity,price,image,subtotal)')
    .eq(field, id)
    .single()

  if (error || !data) throw createError({ statusCode: 404, message: 'Order not found' })

  return { success: true, data }
})
