<template>
  <div class="card overflow-hidden group flex flex-col">
    <!-- Image -->
    <NuxtLink :to="`/shop/${product.slug}`" class="block overflow-hidden relative" style="aspect-ratio:4/3">
      <img
        :src="product.images?.[0] ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&auto=format&fit=crop'"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <!-- Category badge -->
      <span class="absolute top-3 left-3 badge text-white text-[10px] font-bold px-2.5 py-1" :class="catColor(product.category)">
        {{ product.category }}
      </span>
      <!-- Sale badge -->
      <span v-if="product.original_price" class="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        -{{ discount }}%
      </span>
      <!-- Wishlist -->
      <button
        class="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow transition-all duration-200 opacity-0 group-hover:opacity-100"
        :class="wished ? 'text-red-500' : 'text-[#94a3b8] hover:text-red-400'"
        @click.prevent="toggleWish"
        aria-label="Wishlist"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" :fill="wished ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </NuxtLink>

    <!-- Body -->
    <div class="p-5 flex flex-col flex-1">
      <!-- Rating -->
      <div class="flex items-center gap-1.5 mb-2">
        <span class="text-amber-400 text-sm leading-none">★</span>
        <span class="font-bold text-sm text-[#0f172a]">{{ product.rating.toFixed(1) }}</span>
        <span class="text-xs text-[#94a3b8]">({{ product.review_count }})</span>
        <span v-if="product.stock_quantity < 5" class="ml-auto text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
          Only {{ product.stock_quantity }} left
        </span>
        <span v-else-if="product.stock_quantity === 0" class="ml-auto text-[10px] font-bold text-[#94a3b8] bg-[#f1f5f9] px-2 py-0.5 rounded-full">
          Out of stock
        </span>
      </div>

      <!-- Name & desc -->
      <NuxtLink :to="`/shop/${product.slug}`" class="font-bold text-[#0f172a] mb-1.5 hover:text-[#1a7a4a] transition-colors leading-snug block">
        {{ product.name }}
      </NuxtLink>
      <p class="text-xs text-[#64748b] line-clamp-2 flex-1 mb-4">{{ product.short_desc }}</p>

      <!-- Price + CTA -->
      <div class="flex items-center justify-between mt-auto">
        <div>
          <span class="text-[#1a7a4a] font-extrabold text-base">KSh {{ product.price.toLocaleString() }}</span>
          <span v-if="product.original_price" class="text-xs text-[#94a3b8] line-through ml-2">
            KSh {{ product.original_price.toLocaleString() }}
          </span>
        </div>
        <button
          class="btn btn-primary btn-sm gap-1.5"
          :disabled="product.stock_quantity === 0"
          :class="product.stock_quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''"
          @click.prevent="$emit('add-to-cart', product)"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {{ product.stock_quantity === 0 ? 'Sold Out' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/shop'

const props = defineProps<{ product: Product }>()
defineEmits<{ 'add-to-cart': [product: Product] }>()

const wished = ref(false)
function toggleWish() { wished.value = !wished.value }

const discount = computed(() => {
  if (!props.product.original_price) return 0
  return Math.round(100 - (props.product.price / props.product.original_price * 100))
})

function catColor(cat: string) {
  const map: Record<string, string> = {
    Supplements:   'bg-blue-500',
    'Meal Plans':  'bg-[#1a7a4a]',
    Consultations: 'bg-purple-500',
    Wellness:      'bg-amber-500',
  }
  return map[cat] ?? 'bg-[#1a7a4a]'
}
</script>
