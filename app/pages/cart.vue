<template>
  <div>
    <div class="page-hero">
      <div class="wrap">
        <h1 class="h1">Shopping Cart</h1>
        <p class="body-sm text-[#64748b] mt-2">{{ cart.count }} item{{ cart.count !== 1 ? 's' : '' }} in your cart</p>
      </div>
    </div>

    <section class="section bg-[#f8fafc]">
      <div class="wrap">

        <!-- Empty state -->
        <div v-if="cart.isEmpty" class="text-center py-20">
          <div class="w-20 h-20 rounded-3xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-5">
            <svg class="w-9 h-9 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 class="h2 mb-3">Your cart is empty</h2>
          <p class="text-[#64748b] body-sm mb-7">Looks like you haven't added anything yet.</p>
          <NuxtLink to="/shop" class="btn btn-primary btn-lg">Browse Products</NuxtLink>
        </div>

        <!-- Cart grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- LEFT: items -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Desktop header row -->
            <div class="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4">
              <div class="col-span-6">Product</div>
              <div class="col-span-2 text-center">Price</div>
              <div class="col-span-2 text-center">Quantity</div>
              <div class="col-span-2 text-right">Subtotal</div>
            </div>

            <div class="card overflow-hidden divide-y divide-[#f1f5f9]">
              <div
                v-for="item in cart.items"
                :key="item.id"
                class="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center hover:bg-[#fafafa]"
              >
                <!-- Product info -->
                <div class="md:col-span-6 flex items-center gap-4">
                  <NuxtLink :to="`/shop/${item.slug}`">
                    <img
                      :src="item.image ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=70'"
                      :alt="item.name"
                      class="w-16 h-16 rounded-xl object-cover bg-[#f1f5f9] shrink-0"
                    />
                  </NuxtLink>
                  <div>
                    <NuxtLink :to="`/shop/${item.slug}`" class="font-semibold text-[#0f172a] hover:text-[#1a7a4a] transition-colors">
                      {{ item.name }}
                    </NuxtLink>
                    <p class="text-xs text-[#94a3b8] mt-0.5 capitalize">{{ item.category }}</p>
                    <p class="md:hidden text-sm font-bold text-[#1a7a4a] mt-1">KSh {{ item.price.toLocaleString() }}</p>
                  </div>
                </div>

                <!-- Desktop price -->
                <div class="hidden md:block md:col-span-2 text-center text-sm font-semibold text-[#0f172a]">
                  KSh {{ item.price.toLocaleString() }}
                </div>

                <!-- Qty stepper -->
                <div class="md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                  <button
                    class="qty-btn"
                    @click="cart.updateQty(item.id, item.qty - 1)"
                  >−</button>
                  <span class="w-9 text-center font-bold text-[#0f172a]">{{ item.qty }}</span>
                  <button
                    class="qty-btn"
                    :disabled="item.qty >= item.stock_quantity"
                    :class="item.qty >= item.stock_quantity ? 'opacity-40 cursor-not-allowed' : ''"
                    @click="cart.updateQty(item.id, item.qty + 1)"
                  >+</button>
                </div>

                <!-- Subtotal + remove -->
                <div class="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                  <span class="font-bold text-[#0f172a]">KSh {{ (item.price * item.qty).toLocaleString() }}</span>
                  <button
                    class="w-7 h-7 rounded-full flex items-center justify-center text-[#94a3b8] hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                    @click="cart.removeItem(item.id)"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
              <NuxtLink to="/shop" class="btn btn-outline gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Continue Shopping
              </NuxtLink>
              <button class="btn btn-outline text-red-600 border-red-200 hover:bg-red-50" @click="cart.clearCart()">
                Clear Cart
              </button>
            </div>
          </div>

          <!-- RIGHT: order summary -->
          <div class="space-y-5">
            <div class="card p-6">
              <h3 class="font-bold text-[#0f172a] mb-5">Order Summary</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-[#64748b]">Subtotal ({{ cart.count }} items)</span>
                  <span class="font-semibold">KSh {{ cart.subtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[#64748b]">Shipping (Nairobi)</span>
                  <span v-if="cart.shippingFee === 0" class="text-[#1a7a4a] font-bold">FREE</span>
                  <span v-else class="font-semibold">KSh {{ cart.shippingFee.toLocaleString() }}</span>
                </div>
                <div v-if="cart.shippingFee > 0" class="text-xs text-[#94a3b8] bg-[#f8fafc] rounded-xl px-3 py-2.5">
                  💡 Add <strong>KSh {{ (5000 - cart.subtotal).toLocaleString() }}</strong> for free delivery
                </div>
                <div class="pt-3 border-t border-[#e2e8f0] flex justify-between text-base">
                  <span class="font-bold text-[#0f172a]">Total</span>
                  <span class="font-extrabold text-[#1a7a4a] text-xl">KSh {{ cart.total.toLocaleString() }}</span>
                </div>
              </div>
              <NuxtLink to="/checkout" class="btn btn-primary btn-full btn-lg mt-5">
                Proceed to Checkout →
              </NuxtLink>
            </div>

            <!-- Payment methods -->
            <div class="card p-5">
              <p class="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">We Accept</p>
              <div class="flex flex-wrap gap-2">
                <div v-for="pm in payMethods" :key="pm" class="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#64748b]">
                  {{ pm }}
                </div>
              </div>
            </div>

            <!-- Trust badges -->
            <div class="card p-5 space-y-3">
              <div v-for="t in trustBadges" :key="t" class="flex items-center gap-2.5 text-sm text-[#64748b]">
                <svg class="w-4 h-4 text-[#1a7a4a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Cart – SWM Nutrition' })

// useCartStore is auto-imported from stores/cart.ts by @pinia/nuxt
const cart = useCartStore()

const payMethods  = ['M-Pesa', 'Visa', 'MasterCard', 'Cash on Delivery']
const trustBadges = ['Secure SSL checkout', 'Free returns within 7 days', '100% satisfaction guarantee']
</script>

<style scoped>
.qty-btn {
  @apply w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:border-[#1a7a4a] hover:text-[#1a7a4a] transition-colors font-bold text-sm;
}
</style>
