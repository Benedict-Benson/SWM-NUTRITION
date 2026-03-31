<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="cart.isOpen"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        @click="cart.closeCart()"
      />
    </Transition>

    <!-- Slide panel -->
    <Transition name="slide-right">
      <div
        v-if="cart.isOpen"
        class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white flex flex-col"
        style="box-shadow: -20px 0 60px rgba(0,0,0,0.15)"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] shrink-0">
          <div class="flex items-center gap-2.5">
            <svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2 class="font-bold text-[#0f172a]">Shopping Cart</h2>
            <span v-if="cart.count" class="badge badge-green text-xs px-2 py-0.5">{{ cart.count }}</span>
          </div>
          <button
            class="w-8 h-8 rounded-full bg-[#f8fafc] hover:bg-[#e2e8f0] flex items-center justify-center transition-colors"
            @click="cart.closeCart()"
          >
            <svg class="w-4 h-4 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="cart.isEmpty" class="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <div class="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h3 class="font-bold text-[#0f172a] mb-1">Your cart is empty</h3>
          <p class="text-sm text-[#64748b] mb-6">Add some products to get started!</p>
          <NuxtLink to="/shop" class="btn btn-primary" @click="cart.closeCart()">Browse Products</NuxtLink>
        </div>

        <!-- Items list -->
        <div v-else class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="flex gap-3 bg-[#f8fafc] rounded-2xl p-3 border border-[#e2e8f0]"
          >
            <NuxtLink :to="`/shop/${item.slug}`" @click="cart.closeCart()">
              <img
                :src="item.image ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=70'"
                :alt="item.name"
                class="w-16 h-16 rounded-xl object-cover shrink-0 bg-white"
              />
            </NuxtLink>
            <div class="flex-1 min-w-0">
              <NuxtLink
                :to="`/shop/${item.slug}`"
                class="font-semibold text-[#0f172a] text-sm line-clamp-2 hover:text-[#1a7a4a] transition-colors block"
                @click="cart.closeCart()"
              >{{ item.name }}</NuxtLink>
              <p class="text-xs text-[#94a3b8] mt-0.5">KSh {{ item.price.toLocaleString() }} each</p>
              <div class="flex items-center gap-2 mt-2">
                <button
                  class="w-6 h-6 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:border-[#1a7a4a] hover:text-[#1a7a4a] transition-colors text-sm font-bold"
                  @click="cart.updateQty(item.id, item.qty - 1)"
                >−</button>
                <span class="w-6 text-center text-sm font-bold text-[#0f172a]">{{ item.qty }}</span>
                <button
                  class="w-6 h-6 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:border-[#1a7a4a] hover:text-[#1a7a4a] transition-colors text-sm font-bold"
                  :disabled="item.qty >= item.stock_quantity"
                  @click="cart.updateQty(item.id, item.qty + 1)"
                >+</button>
              </div>
            </div>
            <div class="flex flex-col items-end justify-between shrink-0">
              <p class="font-bold text-[#0f172a] text-sm">KSh {{ (item.price * item.qty).toLocaleString() }}</p>
              <button class="text-[#94a3b8] hover:text-red-500 transition-colors p-1" @click="cart.removeItem(item.id)">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer / totals -->
        <div v-if="!cart.isEmpty" class="border-t border-[#e2e8f0] px-6 py-5 space-y-3 shrink-0 bg-white">
          <div class="flex items-center justify-between text-sm">
            <span class="text-[#64748b]">Subtotal</span>
            <span class="font-semibold text-[#0f172a]">KSh {{ cart.subtotal.toLocaleString() }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-[#64748b]">Shipping</span>
            <span v-if="cart.shippingFee === 0" class="text-[#1a7a4a] font-semibold text-xs">FREE</span>
            <span v-else class="font-semibold text-[#0f172a]">KSh {{ cart.shippingFee.toLocaleString() }}</span>
          </div>
          <div v-if="cart.shippingFee > 0" class="text-xs text-[#94a3b8] bg-[#f8fafc] rounded-xl px-3 py-2">
            💡 Add KSh {{ (5000 - cart.subtotal).toLocaleString() }} more for free delivery
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-[#e2e8f0]">
            <span class="font-bold text-[#0f172a]">Total</span>
            <span class="font-extrabold text-[#1a7a4a] text-lg">KSh {{ cart.total.toLocaleString() }}</span>
          </div>
          <div class="space-y-2 pt-1">
            <NuxtLink to="/checkout" class="btn btn-primary btn-full btn-lg" @click="cart.closeCart()">
              Proceed to Checkout →
            </NuxtLink>
            <NuxtLink to="/shop" class="btn btn-outline btn-full" @click="cart.closeCart()">
              Continue Shopping
            </NuxtLink>
          </div>
          <button class="w-full text-center text-xs text-[#94a3b8] hover:text-red-500 transition-colors py-1" @click="cart.clearCart()">
            Clear cart
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// useCartStore is auto-imported from stores/cart.ts by @pinia/nuxt
const cart = useCartStore()
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
