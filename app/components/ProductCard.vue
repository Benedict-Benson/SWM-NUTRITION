<template>
  <div class="card overflow-hidden group cursor-pointer">
    <!-- Image -->
    <div class="relative overflow-hidden" style="aspect-ratio:4/3">
      <NuxtLink :to="`/shop/${product.slug}`">
        <img
          :src="product.images?.[0] ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80'"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </NuxtLink>

      <!-- Category badge -->
      <span
        class="absolute top-3 left-3 badge text-white text-[10px] font-bold"
        :class="catColor"
      >{{ product.category }}</span>

      <!-- Discount badge -->
      <span
        v-if="discountPct > 0"
        class="absolute top-10 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
      >-{{ discountPct }}%</span>

      <!-- Wishlist -->
      <button
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm"
        :class="wished ? 'text-red-500' : 'text-[#94a3b8] hover:text-red-500'"
        :aria-label="wished ? 'Remove from wishlist' : 'Add to wishlist'"
        @click.prevent="$emit('wishlist', product.id)"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" :fill="wished ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>

    <!-- Body -->
    <div class="p-5">
      <!-- Rating -->
      <div class="flex items-center gap-1.5 mb-2">
        <span class="stars text-sm">★</span>
        <span class="font-bold text-sm text-[#0f172a]">{{ product.rating ?? '5.0' }}</span>
        <span class="text-xs text-[#94a3b8]">({{ product.review_count ?? 0 }})</span>
      </div>

      <!-- Name -->
      <NuxtLink :to="`/shop/${product.slug}`">
        <h3 class="font-bold text-[#0f172a] mb-1.5 leading-snug line-clamp-2 hover:text-[#1a7a4a] transition-colors">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <!-- Short desc -->
      <p class="body-xs text-[#64748b] mb-4 line-clamp-2">{{ product.short_desc }}</p>

      <!-- Price + CTA -->
      <div class="flex items-center justify-between gap-2">
        <div>
          <span class="text-[#1a7a4a] font-extrabold text-base">
            KSh {{ Number(product.price).toLocaleString() }}
          </span>
          <span v-if="product.original_price" class="text-xs text-[#94a3b8] line-through ml-2">
            KSh {{ Number(product.original_price).toLocaleString() }}
          </span>
        </div>
        <button
          class="btn btn-primary btn-sm gap-1.5 shrink-0"
          @click.prevent="handleAddToCart"
        >
          <svg v-if="!added" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ added ? 'Added!' : 'Add' }}
        </button>
      </div>

      <!-- Low stock warning -->
      <p
        v-if="product.stock_quantity !== undefined && product.stock_quantity < 5 && product.stock_quantity > 0"
        class="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Only {{ product.stock_quantity }} left in stock
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string
  slug: string
  name: string
  short_desc?: string
  category: string
  price: number
  original_price?: number
  images?: string[]
  rating?: number
  review_count?: number
  stock_quantity?: number
}

const props = defineProps<{
  product: Product
  wished?: boolean
}>()

defineEmits<{ wishlist: [id: string] }>()

const { addItem } = useCart()
const cartToast   = useState<boolean>('cart_toast', () => false)
const added       = ref(false)
let   timer: ReturnType<typeof setTimeout>

const discountPct = computed(() =>
  props.product.original_price
    ? Math.round(100 - (props.product.price / props.product.original_price * 100))
    : 0
)

const catColor = computed<string>(() =>
  ({
    Supplements:   'bg-blue-500',
    'Meal Plans':  'bg-[#1a7a4a]',
    Consultations: 'bg-purple-500',
    Wellness:      'bg-amber-500',
  } as Record<string, string>)[props.product.category] ?? 'bg-[#1a7a4a]'
)

function handleAddToCart() {
  addItem(props.product as any)
  added.value = true
  cartToast.value = true
  clearTimeout(timer)
  timer = setTimeout(() => { added.value = false; cartToast.value = false }, 2500)
}

onUnmounted(() => clearTimeout(timer))
</script>