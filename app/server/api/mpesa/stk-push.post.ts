// server/api/mpesa/stk-push.post.ts
// Initiates M-Pesa STK Push via Safaricom Daraja API

import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body   = await readBody<{ phone: string; amount: number; orderId: string; description?: string }>(event)

  const { phone, amount, orderId, description } = body
  if (!phone || !amount || !orderId) {
    throw createError({ statusCode: 400, message: 'phone, amount and orderId are required' })
  }

  const isSandbox  = config.mpesaSandbox !== 'false'
  const baseUrl    = isSandbox
    ? 'https://sandbox.safaricom.co.ke'
    : 'https://api.safaricom.co.ke'

  // ── 1. OAuth token ─────────────────────────────────────────
  const credentials = Buffer.from(
    `${config.mpesaConsumerKey}:${config.mpesaConsumerSecret}`
  ).toString('base64')

  let token: string
  try {
    const tokenRes = await $fetch<{ access_token: string }>(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${credentials}` } }
    )
    token = tokenRes.access_token
  } catch (err: any) {
    throw createError({ statusCode: 502, message: `M-Pesa auth failed: ${err.message}` })
  }

  // ── 2. Build STK payload ───────────────────────────────────
  const shortcode = config.mpesaShortcode
  const passkey   = config.mpesaPasskey
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
  const password  = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  // Normalize phone → 254XXXXXXXXX
  const normalizedPhone = phone
    .replace(/\s/g, '')
    .replace(/^\+/, '')
    .replace(/^0/, '254')

  const callbackUrl = `${config.public.siteUrl}/api/mpesa/callback`

  // ── 3. Initiate STK push ───────────────────────────────────
  let stkRes: any
  try {
    stkRes = await $fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: {
        BusinessShortCode: shortcode,
        Password:          password,
        Timestamp:         timestamp,
        TransactionType:   'CustomerPayBillOnline',
        Amount:            Math.ceil(amount),
        PartyA:            normalizedPhone,
        PartyB:            shortcode,
        PhoneNumber:       normalizedPhone,
        CallBackURL:       callbackUrl,
        AccountReference:  `SWM-${orderId.slice(0, 8).toUpperCase()}`,
        TransactionDesc:   description ?? 'SWM Nutrition Order',
      },
    })
  } catch (err: any) {
    throw createError({ statusCode: 502, message: `STK push failed: ${err.message}` })
  }

  // ── 4. Store checkout request ID against order ─────────────
  if (stkRes.ResponseCode === '0') {
    const supabase = serverSupabaseServiceRole(event)
    await supabase
      .from('orders')
      .update({ payment_ref: stkRes.CheckoutRequestID, updated_at: new Date().toISOString() })
      .eq('id', orderId)
  }

  return {
    success:           stkRes.ResponseCode === '0',
    checkoutRequestId: stkRes.CheckoutRequestID,
    responseCode:      stkRes.ResponseCode,
    responseDesc:      stkRes.ResponseDescription,
    customerMessage:   stkRes.CustomerMessage,
  }
})
