// types/shop.ts – All TypeScript types for the SWM shop

export type ProductCategory = 'Supplements' | 'Meal Plans' | 'Consultations' | 'Wellness'
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentMethod = 'mpesa' | 'card' | 'cash_on_delivery'

// ── Product ──────────────────────────────────────────────────
export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  short_desc: string | null
  category: ProductCategory
  price: number
  original_price: number | null
  sku: string | null
  stock_quantity: number
  images: string[]
  tags: string[]
  rating: number
  review_count: number
  is_active: boolean
  is_featured: boolean
  key_features: string[]
  ingredients: string | null
  how_to_use: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ProductReview {
  id: string
  product_id: string
  user_id: string | null
  reviewer: string
  avatar_url: string | null
  rating: number
  review: string
  is_verified: boolean
  created_at: string
}

// ── Cart ─────────────────────────────────────────────────────
export interface CartItem {
  id: string
  slug: string
  name: string
  price: number
  image: string | null
  qty: number
  stock_quantity: number
  category: ProductCategory
}

// ── Order ────────────────────────────────────────────────────
export interface ShippingAddress {
  street: string
  city: string
  postal_code?: string
  county?: string
  country: string
  instructions?: string
}

export interface CheckoutForm {
  full_name: string
  email: string
  phone: string
  shipping_address: ShippingAddress
  payment_method: PaymentMethod
  notes?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  name: string
  image: string | null
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: ShippingAddress
  subtotal: number
  shipping_fee: number
  discount: number
  total: number
  status: OrderStatus
  payment_method: string | null
  payment_ref: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

// ── API Response ─────────────────────────────────────────────
export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ── M-Pesa ───────────────────────────────────────────────────
export interface MpesaStkRequest {
  phone: string
  amount: number
  orderId: string
  description?: string
}

export interface MpesaStkResponse {
  success: boolean
  checkoutRequestId?: string
  responseCode?: string
  responseDesc?: string
  customerMessage?: string
  error?: string
}

export interface MpesaStatusResponse {
  paid: boolean
  status: OrderStatus
  paymentRef?: string
  message?: string
}
