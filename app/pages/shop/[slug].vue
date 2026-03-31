<template>
  <div>
    <!-- Back -->
    <div class="bg-white border-b border-[#e2e8f0] py-3">
      <div class="wrap">
        <NuxtLink to="/shop" class="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1a7a4a] transition-colors group">
          <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Shop
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="section bg-[#f8fafc]">
      <div class="wrap">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="animate-pulse space-y-4"><div class="aspect-square rounded-2xl bg-[#e2e8f0]"/><div class="grid grid-cols-3 gap-3"><div class="aspect-square rounded-xl bg-[#e2e8f0]" v-for="i in 3" :key="i"/></div></div>
          <div class="animate-pulse space-y-4"><div class="h-6 bg-[#e2e8f0] rounded w-1/4"/><div class="h-8 bg-[#e2e8f0] rounded"/><div class="h-4 bg-[#e2e8f0] rounded w-3/4"/><div class="h-10 bg-[#e2e8f0] rounded"/></div>
        </div>
      </div>
    </div>

    <!-- Product -->
    <section v-else-if="product" class="section bg-[#f8fafc]">
      <div class="wrap">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <!-- Image gallery -->
          <div>
            <div class="rounded-2xl overflow-hidden bg-white border border-[#e2e8f0] mb-4 shadow-card">
              <img :src="product.images?.[activeImg] ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=85'" :alt="product.name" class="w-full aspect-square object-cover" />
            </div>
            <div v-if="product.images?.length > 1" class="grid grid-cols-4 gap-3">
              <button v-for="(img,i) in product.images" :key="i" class="rounded-xl overflow-hidden border-2 transition-all" :class="activeImg===i?'border-[#1a7a4a]':'border-[#e2e8f0] hover:border-[#c8e8d5]'" @click="activeImg=i">
                <img :src="img" :alt="`View ${i+1}`" class="w-full aspect-square object-cover"/>
              </button>
            </div>
          </div>
          <!-- Info -->
          <div>
            <span class="badge badge-green mb-3 inline-flex">{{ product.category }}</span>
            <h1 class="h1 mb-2">{{ product.name }}</h1>
            <p class="body-sm text-[#64748b] mb-4">{{ product.short_desc }}</p>
            <!-- Rating -->
            <div class="flex items-center gap-3 mb-4">
              <div class="flex gap-0.5">
                <span v-for="i in 5" :key="i" class="text-lg" :class="i<=Math.floor(product.rating)?'text-amber-400':'text-[#e2e8f0]'">★</span>
              </div>
              <span class="font-bold text-[#0f172a]">{{ Number(product.rating).toFixed(1) }}</span>
              <span class="text-[#64748b] text-sm">({{ product.review_count }} reviews)</span>
            </div>
            <!-- Price -->
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl font-extrabold text-[#0f172a]">KSh {{ Number(product.price).toLocaleString() }}</span>
              <span v-if="product.original_price" class="text-lg text-[#94a3b8] line-through">KSh {{ Number(product.original_price).toLocaleString() }}</span>
              <span v-if="discount>0" class="badge bg-red-100 text-red-600 text-xs">-{{ discount }}%</span>
            </div>
            <!-- Stock -->
            <div class="flex items-center gap-2 mb-5">
              <span v-if="product.stock_quantity>10" class="text-[#1a7a4a] text-sm font-semibold flex items-center gap-1"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>In Stock</span>
              <span v-else-if="product.stock_quantity>0" class="text-amber-600 text-sm font-semibold">Only {{ product.stock_quantity }} left</span>
              <span v-else class="text-red-500 text-sm font-semibold">Out of Stock</span>
            </div>
            <hr class="border-[#e2e8f0] mb-5"/>
            <!-- Qty -->
            <div class="flex items-center gap-4 mb-5">
              <span class="text-sm font-medium text-[#0f172a]">Quantity:</span>
              <div class="flex items-center gap-2">
                <button class="qty-btn" @click="qty=Math.max(1,qty-1)">−</button>
                <span class="w-10 text-center font-bold text-[#0f172a]">{{ qty }}</span>
                <button class="qty-btn" :disabled="qty>=product.stock_quantity" @click="qty++">+</button>
              </div>
              <span class="text-xs text-[#94a3b8]">{{ product.stock_quantity }} available</span>
            </div>
            <!-- CTAs -->
            <div class="flex gap-3 mb-5">
              <button class="btn btn-primary btn-lg flex-1 gap-2" :disabled="product.stock_quantity===0" @click="addToCart">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                {{ addedMsg || (product.stock_quantity===0?'Out of Stock':'Add to Cart') }}
              </button>
              <button class="btn btn-outline btn-lg w-12 justify-center" @click="toggleWish" :class="wished?'border-red-300 text-red-500 bg-red-50':''">
                <svg class="w-5 h-5" viewBox="0 0 24 24" :fill="wished?'currentColor':'none'" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
            <NuxtLink to="/checkout" class="btn btn-outline btn-full mb-5">Buy Now</NuxtLink>
            <!-- Key features -->
            <div v-if="product.key_features?.length" class="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0] mb-5">
              <p class="font-bold text-[#0f172a] mb-3 text-sm">Key Features:</p>
              <ul class="space-y-2">
                <li v-for="f in product.key_features" :key="f" class="flex items-start gap-2.5 text-sm text-[#0f172a]">
                  <svg class="w-4 h-4 text-[#1a7a4a] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ f }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <section v-if="product" class="section-sm bg-white">
      <div class="wrap">
        <div class="tab-bar mb-8">
          <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="activeTab===tab.id?'active':''" @click="activeTab=tab.id">{{ tab.label }}</button>
        </div>
        <div class="max-w-2xl">
          <div v-if="activeTab==='description'" class="prose" v-html="product.description" />
          <div v-else-if="activeTab==='ingredients'" class="prose" v-html="product.ingredients||'<p>Ingredient information coming soon.</p>'" />
          <div v-else-if="activeTab==='how-to-use'" class="prose" v-html="product.how_to_use||'<p>Usage instructions coming soon.</p>'" />
          <div v-else class="space-y-4">
            <div v-if="!reviews.length" class="text-center py-10 text-[#94a3b8]">No reviews yet. Be the first to review!</div>
            <div v-for="r in reviews" :key="r.id" class="card p-5">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-[#e8f5ee] flex items-center justify-center font-bold text-[#1a7a4a] shrink-0">{{ r.reviewer.charAt(0) }}</div>
                <div><p class="font-bold text-sm text-[#0f172a]">{{ r.reviewer }}</p><div class="stars text-sm">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5-r.rating) }}</div></div>
                <span class="ml-auto text-xs text-[#94a3b8]">{{ new Date(r.created_at).toLocaleDateString('en-KE',{month:'short',day:'numeric',year:'numeric'}) }}</span>
              </div>
              <p class="text-sm text-[#64748b]">{{ r.review }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related -->
    <section v-if="related.length" class="section bg-[#f8fafc]">
      <div class="wrap">
        <h2 class="h2 mb-8">You May Also Like</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <ShopProductCard v-for="p in related" :key="p.id" :product="p" @add-to-cart="cart.addItem($event);cart.openCart()" />
        </div>
      </div>
    </section>

    <CartSlideOver />
  </div>
</template>
<script setup lang="ts">
import type { Product, ProductReview } from '~/types/shop'
const route  = useRoute()
const cart   = useCartStore()
const { fetchProduct, fetchReviews, fetchRelated } = useProducts()
const product  = ref<Product|null>(null)
const reviews  = ref<ProductReview[]>([])
const related  = ref<Product[]>([])
const loading  = ref(true)
const activeImg= ref(0)
const qty      = ref(1)
const activeTab= ref('description')
const wished   = ref(false)
const addedMsg = ref('')

const tabs = computed(()=>[
  {id:'description',label:'Description'},
  {id:'ingredients',label:'Ingredients'},
  {id:'how-to-use', label:'How to Use'},
  {id:'reviews',    label:`Reviews (${product.value?.review_count??0})`},
])

const discount = computed(()=>{
  if(!product.value?.original_price) return 0
  return Math.round(100-(product.value.price/product.value.original_price*100))
})

onMounted(async()=>{
  const slug=route.params.slug as string
  const [pr,rv]= await Promise.all([fetchProduct(slug),fetchReviews('')])
  if(pr.product){
    product.value=pr.product
    useHead({title:`${pr.product.name} – SWM Nutrition`})
    const [rvs,rel]=await Promise.all([
      fetchReviews(pr.product.id),
      fetchRelated(pr.product.category,pr.product.id,4)
    ])
    reviews.value=rvs
    related.value=rel
  }
  loading.value=false
})

function addToCart(){
  if(!product.value) return
  cart.addItem({...product.value},qty.value)
  addedMsg.value='✓ Added!'
  setTimeout(()=>{addedMsg.value=''},2000)
  cart.openCart()
}
function toggleWish(){ wished.value=!wished.value }
</script>
