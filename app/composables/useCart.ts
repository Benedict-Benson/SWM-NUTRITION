// composables/useCart.ts
// Client-side cart with localStorage persistence.
// Checkout routes through /api/orders/create (server-side validation + stock check).

export function useCart() {
  const STORAGE_KEY = 'swm_cart_v2'

  // ── State ─────────────────────────────────────────────────────
  const items = useState<CartItem[]>('cart_items', () => [])

  // Hydrate from localStorage on client mount
  if (process.client && items.value.length === 0) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) items.value = JSON.parse(stored)
    } catch {}
  }

  // Persist on every change
  if (process.client) {
    watch(items, (val) => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch {}
    }, { deep: true })
  }

  // ── Computed ──────────────────────────────────────────────────
  const count    = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  const shipping = computed(() => subtotal.value >= 5000 ? 0 : 300)
  const total    = computed(() => subtotal.value + shipping.value)

  // ── Actions ───────────────────────────────────────────────────
  function addItem(product: Product, qty = 1) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.qty += qty
    } else {
      items.value.push({
        id:    product.id,
        slug:  product.slug,
        name:  product.name,
        price: Number(product.price),
        image: product.images?.[0] ?? null,
        qty,
      })
    }
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) { removeItem(productId); return }
    const item = items.value.find(i => i.id === productId)
    if (item) item.qty = qty
  }

  function clearCart() {
    items.value = []
    if (process.client) {
      try { localStorage.removeItem(STORAGE_KEY) } catch {}
    }
  }

  // ── Checkout via server API ───────────────────────────────────
  // This validates stock server-side, preventing oversell.
  async function checkout({
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentMethod = 'mpesa',
  }: CheckoutParams) {
    if (!items.value.length) return { success: false, error: 'Cart is empty' }

    try {
      const result = await $fetch<any>('/api/orders/create', {
        method: 'POST',
        body: {
          items: items.value.map(i => ({
            productId: i.id,
            name:      i.name,
            image:     i.image,
            price:     i.price,
            quantity:  i.qty,
          })),
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          paymentMethod,
        },
      })

      clearCart()
      return {
        success:     true,
        order: {
          id:           result.orderId,
          order_number: result.orderNumber,
          total:        result.total,
        },
      }
    } catch (e: any) {
      const message = e?.data?.message ?? e?.message ?? 'Order failed. Please try again.'
      return { success: false, error: message }
    }
  }

  // ── Fetch user's order history ────────────────────────────────
  async function fetchMyOrders() {
    const supabase = useSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return []
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(name, quantity, price, image)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    return data ?? []
  }

  return {
    items,
    count,
    subtotal,
    shipping,
    total,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    checkout,
    fetchMyOrders,
  }
}

// ── Types ─────────────────────────────────────────────────────
interface CartItem {
  id:    string
  slug:  string
  name:  string
  price: number
  image: string | null
  qty:   number
}

interface Product {
  id:      string
  slug:    string
  name:    string
  price:   number | string
  images?: string[]
}

interface CheckoutParams {
  customerName:    string
  customerEmail:   string
  customerPhone:   string
  shippingAddress: Record<string, any>
  paymentMethod?:  string
}