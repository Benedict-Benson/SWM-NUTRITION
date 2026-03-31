// server/api/mpesa/status/[orderId].get.ts
// Polls order payment status – client polls this every few seconds after STK push

import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const orderId = getRouterParam(event, 'orderId')
  if (!orderId) throw createError({ statusCode: 400, message: 'orderId required' })

  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, payment_ref, paid_at')
    .eq('id', orderId)
    .single()

  if (error || !data) throw createError({ statusCode: 404, message: 'Order not found' })

  return {
    paid:       data.status === 'paid',
    status:     data.status,
    paymentRef: data.payment_ref,
    paidAt:     data.paid_at,
  }
})
