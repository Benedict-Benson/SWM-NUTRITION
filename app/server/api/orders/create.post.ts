// server/api/orders/create.post.ts
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { CartItem, CheckoutForm, Order } from '~/types/shop'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    form:         CheckoutForm
    items:        CartItem[]
    subtotal:     number
    shipping_fee: number
    total:        number
  }>(event)

  const { form, items, subtotal, shipping_fee, total } = body

  // ── Validate ──────────────────────────────────────────────────
  if (!form?.full_name || !form?.email || !form?.phone) {
    throw createError({ statusCode: 400, message: 'Name, email and phone are required' })
  }
  if (!items?.length) {
    throw createError({ statusCode: 400, message: 'Cart is empty' })
  }

  const supabase = serverSupabaseServiceRole(event)

  // Get logged-in user if any
  const authUser = await serverSupabaseUser(event).catch(() => null)

  // ── Verify stock ──────────────────────────────────────────────
  const productIds = items.map(i => i.id)
  const { data: products, error: stockErr } = await supabase
    .from('products')
    .select('id, name, stock_quantity, price')
    .in('id', productIds)

  if (stockErr) throw createError({ statusCode: 500, message: 'Could not verify stock' })

  const outOfStock: string[] = []
  for (const item of items) {
    const prod = products?.find(p => p.id === item.id)
    if (!prod || prod.stock_quantity < item.qty) {
      outOfStock.push(item.name)
    }
  }
  if (outOfStock.length) {
    throw createError({
      statusCode: 409,
      message: `Insufficient stock for: ${outOfStock.join(', ')}`,
    })
  }

  // ── Create order ──────────────────────────────────────────────
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_name:    form.full_name,
      customer_email:   form.email.toLowerCase().trim(),
      customer_phone:   form.phone,
      shipping_address: form.shipping_address,
      subtotal,
      shipping_fee,
      total,
      payment_method:   form.payment_method,
      status:           'pending',
      notes:            form.notes ?? null,
      user_id:          authUser?.id ?? null,
    })
    .select()
    .single()

  if (orderErr || !order) {
    throw createError({ statusCode: 500, message: orderErr?.message ?? 'Failed to create order' })
  }

  // ── Create order items ────────────────────────────────────────
  const orderItems = items.map(item => ({
    order_id:   order.id,
    product_id: item.id,
    name:       item.name,
    image:      item.image,
    price:      item.price,
    quantity:   item.qty,
    subtotal:   item.price * item.qty,
  }))

  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsErr) {
    // Rollback order
    await supabase.from('orders').delete().eq('id', order.id)
    throw createError({ statusCode: 500, message: 'Failed to save order items' })
  }

  // ── Decrement stock ───────────────────────────────────────────
  for (const item of items) {
    await supabase.rpc('decrement_stock', {
      p_product_id: item.id,
      p_quantity:   item.qty,
    })
  }

  // ── Fetch complete order with items ───────────────────────────
  const { data: fullOrder } = await supabase
    .from('orders')
    .select('*, order_items(id,name,quantity,price,image,subtotal)')
    .eq('id', order.id)
    .single()

  return { success: true, data: fullOrder as Order }
})