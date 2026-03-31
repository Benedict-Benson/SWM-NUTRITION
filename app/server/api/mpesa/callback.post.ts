// server/api/mpesa/callback.post.ts
// Receives Safaricom Daraja STK Push result

import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body        = await readBody(event)
  const callback    = body?.Body?.stkCallback
  const resultCode  = callback?.ResultCode
  const resultDesc  = callback?.ResultDesc
  const checkoutId  = callback?.CheckoutRequestID
  const metaItems   = callback?.CallbackMetadata?.Item ?? []

  // Parse callback metadata
  const meta: Record<string, any> = {}
  for (const item of metaItems) meta[item.Name] = item.Value

  const supabase = serverSupabaseServiceRole(event)

  if (resultCode === 0) {
    // ── Successful payment ─────────────────────────────────
    await supabase
      .from('orders')
      .update({
        status:      'paid',
        paid_at:     new Date().toISOString(),
        payment_ref: meta['MpesaReceiptNumber'] ?? checkoutId,
        notes:       `M-Pesa: ${meta['MpesaReceiptNumber']} | Phone: ${meta['PhoneNumber']} | KSh ${meta['Amount']}`,
        updated_at:  new Date().toISOString(),
      })
      .eq('payment_ref', checkoutId)

    // Audit log
    await supabase.from('audit_logs').insert({
      action:     'mpesa_payment_success',
      table_name: 'orders',
      record_id:  checkoutId,
      new_data:   meta,
    })
  } else {
    // ── Payment failed or cancelled ────────────────────────
    await supabase
      .from('orders')
      .update({
        notes:      `M-Pesa failed (${resultCode}): ${resultDesc}`,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_ref', checkoutId)

    await supabase.from('audit_logs').insert({
      action:     'mpesa_payment_failed',
      table_name: 'orders',
      record_id:  checkoutId,
      new_data:   { resultCode, resultDesc },
    })
  }

  // Safaricom expects exactly this 200 response
  return { ResultCode: 0, ResultDesc: 'Accepted' }
})
