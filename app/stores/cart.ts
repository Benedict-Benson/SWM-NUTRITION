// stores/cart.ts
// SSR-safe Pinia cart store. Compatible with @pinia/nuxt 0.5.5 + pinia 2.1.7

import { defineStore } from 'pinia'

interface CartItem {
  id:             string
  slug:           string
  name:           string
  price:          number
  image:          string | null
  qty:            number
  stock_quantity: number
  category:       string
}

export const useCartStore = defineStore('cart', {
  // ── State ─────────────────────────────────────────────────────
  // Use OPTIONS API syntax (not setup function) for best SSR compatibility
  state: () => ({
    items:       [] as CartItem[],
    isOpen:      false,
    isLoading:   false,
    checkoutErr: null as string | null,
  }),

  // ── Getters ───────────────────────────────────────────────────
  getters: {
    count:       (s) => s.items.reduce((n, i) => n + i.qty, 0),
    subtotal:    (s) => s.items.reduce((n, i) => n + i.price * i.qty, 0),
    shippingFee: (s) => {
      const sub = s.items.reduce((n, i) => n + i.price * i.qty, 0)
      return s.items.length === 0 ? 0 : sub >= 5000 ? 0 : 300
    },
    total(): number { return (this.subtotal as number) + (this.shippingFee as number) },
    isEmpty:     (s) => s.items.length === 0,
  },

  // ── Actions ───────────────────────────────────────────────────
  actions: {
    // localStorage hydration – client only
    hydrate() {
      if (typeof window === 'undefined') return
      try {
        const raw = localStorage.getItem('swm_cart_v2')
        if (raw) this.items = JSON.parse(raw)
      } catch {}
    },

    _persist() {
      if (typeof window === 'undefined') return
      try { localStorage.setItem('swm_cart_v2', JSON.stringify(this.items)) } catch {}
    },

    addItem(product: {
      id: string; slug: string; name: string; price: number | string
      images?: string[]; stock_quantity?: number; category?: string
    }, qty = 1) {
      const stock = product.stock_quantity ?? 99
      const existing = this.items.find(i => i.id === product.id)
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, stock)
      } else {
        this.items.push({
          id:             product.id,
          slug:           product.slug,
          name:           product.name,
          price:          Number(product.price),
          image:          product.images?.[0] ?? null,
          qty:            Math.min(qty, stock),
          stock_quantity: stock,
          category:       product.category ?? 'Supplements',
        })
      }
      this.isOpen = true
      this._persist()
    },

    removeItem(id: string) {
      this.items = this.items.filter(i => i.id !== id)
      this._persist()
    },

    updateQty(id: string, qty: number) {
      if (qty <= 0) { this.removeItem(id); return }
      const item = this.items.find(i => i.id === id)
      if (item) { item.qty = Math.min(qty, item.stock_quantity); this._persist() }
    },

    clearCart() {
      this.items = []
      if (typeof window !== 'undefined') localStorage.removeItem('swm_cart_v2')
    },

    openCart()   { this.isOpen = true  },
    closeCart()  { this.isOpen = false },
    toggleCart() { this.isOpen = !this.isOpen },

    async checkout(form: Record<string, any>) {
      if (this.isEmpty) return { success: false, error: 'Your cart is empty' }
      this.isLoading   = true
      this.checkoutErr = null
      try {
        const res = await $fetch<any>('/api/orders/create', {
          method: 'POST',
          body: {
            form,
            items:        this.items,
            subtotal:     this.subtotal,
            shipping_fee: this.shippingFee,
            total:        this.total,
          },
        })
        if (res.success && res.data) {
          this.clearCart()
          return { success: true, data: res.data }
        }
        this.checkoutErr = res.error ?? 'Order creation failed'
        return { success: false, error: this.checkoutErr }
      } catch (err: any) {
        const msg = err?.data?.message ?? err?.message ?? 'Network error. Please try again.'
        this.checkoutErr = msg
        return { success: false, error: msg }
      } finally {
        this.isLoading = false
      }
    },
  },
})
