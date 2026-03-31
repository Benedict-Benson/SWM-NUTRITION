<template>
  <div>
    <div class="bg-[#f8fafc] border-b border-[#e2e8f0] py-10 text-center">
      <div class="wrap"><h1 class="h1 mb-2">Shop</h1><p class="body-sm text-[#64748b] max-w-md mx-auto">Premium supplements, personalized meal plans, and professional consultation services</p></div>
    </div>
    <!-- STICKY FILTER BAR -->
    <div class="bg-white border-b border-[#e2e8f0] sticky top-[68px] z-30 py-3 shadow-sm">
      <div class="wrap">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1 max-w-sm">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input v-model="search" type="search" placeholder="Search products..." class="input pl-10 py-2.5 text-sm" @input="onSearch" />
          </div>
          <div class="flex gap-2 flex-wrap items-center">
            <button v-for="cat in categories" :key="cat" class="btn btn-sm rounded-full text-xs px-4" :class="activeCat===cat?'btn-primary':'btn-outline'" @click="activeCat=cat;page=1;load()">{{ cat }}</button>
          </div>
          <select v-model="sort" class="input py-2.5 text-sm w-full sm:w-44 shrink-0" @change="page=1;load()">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>
    </div>
    <!-- GRID -->
    <section class="section bg-[#f8fafc] min-h-[60vh]">
      <div class="wrap">
        <p v-if="!loading && total>0" class="text-sm text-[#64748b] mb-5">Showing <strong class="text-[#0f172a]">{{ products.length }}</strong> of <strong class="text-[#0f172a]">{{ total }}</strong> products</p>
        <!-- Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="card animate-pulse overflow-hidden">
            <div class="bg-[#e2e8f0] aspect-[4/3]" /><div class="p-5 space-y-3"><div class="h-3 bg-[#e2e8f0] rounded w-3/4"/><div class="h-3 bg-[#e2e8f0] rounded"/><div class="h-3 bg-[#e2e8f0] rounded w-1/2"/></div>
          </div>
        </div>
        <!-- Products -->
        <div v-else-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ShopProductCard v-for="product in products" :key="product.id" :product="product" @add-to-cart="handleAddToCart" />
        </div>
        <!-- Empty -->
        <div v-else class="text-center py-24">
          <div class="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4"><svg class="w-7 h-7 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
          <h3 class="font-bold text-[#0f172a] mb-2">No products found</h3>
          <p class="text-[#64748b] text-sm mb-5">Try adjusting your search or category filters</p>
          <button class="btn btn-primary" @click="resetFilters">Clear all filters</button>
        </div>
        <!-- Pagination -->
        <div v-if="!loading && total>limit" class="flex justify-center gap-2 mt-10">
          <button class="btn btn-outline btn-sm" :disabled="page<=1" @click="page--;load()">← Previous</button>
          <span class="flex items-center px-4 text-sm text-[#64748b]">Page {{ page }}</span>
          <button class="btn btn-outline btn-sm" :disabled="products.length<limit" @click="page++;load()">Next →</button>
        </div>
      </div>
    </section>
    <!-- Trust -->
    <section class="bg-white border-t border-[#e2e8f0] py-10">
      <div class="wrap">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div v-for="f in trust" :key="f.title" class="flex items-center gap-4 p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div class="icon-box ib-green-l w-12 h-12 rounded-xl shrink-0" v-html="f.icon"/>
            <div><p class="font-bold text-[#0f172a] text-sm">{{ f.title }}</p><p class="text-xs text-[#64748b]">{{ f.desc }}</p></div>
          </div>
        </div>
      </div>
    </section>
    <!-- Cart slide-over & toast -->
    <CartSlideOver />
    <Transition name="fade">
      <div v-if="toastProd" class="fixed bottom-6 right-6 bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-float text-sm flex items-center gap-3 z-50 max-w-xs">
        <img v-if="toastProd.images?.[0]" :src="toastProd.images[0]" class="w-9 h-9 rounded-lg object-cover shrink-0"/>
        <div class="flex-1 min-w-0"><p class="font-semibold">Added to cart!</p><p class="text-xs text-[#94a3b8] truncate">{{ toastProd.name }}</p></div>
        <NuxtLink to="/cart" class="btn btn-white btn-sm shrink-0 text-[#0f172a]" @click="toastProd=null">View Cart</NuxtLink>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import type { Product } from '~/types/shop'
useHead({ title: 'Shop – SWM Nutrition' })
const cart = useCartStore()
const { fetchProducts } = useProducts()
const products=ref<Product[]>([]);const total=ref(0);const loading=ref(true)
const page=ref(1);const limit=9;const search=ref('');const activeCat=ref('All')
const sort=ref<any>('featured');const toastProd=ref<Product|null>(null)
const categories=['All','Supplements','Meal Plans','Consultations','Wellness']
let stimer:any
function onSearch(){clearTimeout(stimer);stimer=setTimeout(()=>{page.value=1;load()},350)}
async function load(){loading.value=true;try{const r=await fetchProducts({category:activeCat.value!=='All'?activeCat.value:null,search:search.value,sort:sort.value,limit,page:page.value});products.value=r.products;total.value=r.total}finally{loading.value=false}}
function resetFilters(){search.value='';activeCat.value='All';sort.value='featured';page.value=1;load()}
function handleAddToCart(p:Product){cart.addItem(p);toastProd.value=p;setTimeout(()=>{toastProd.value=null},3000)}
onMounted(load)
const trust=[
  {title:'Free Delivery in Nairobi',desc:'Free on orders above KSh 5,000',icon:`<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`},
  {title:'Quality Guaranteed',desc:'All products certified and tested',icon:`<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`},
  {title:'Expert Support',desc:'Free 15-min consultation with purchase',icon:`<svg class="w-5 h-5 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`},
]
</script>
