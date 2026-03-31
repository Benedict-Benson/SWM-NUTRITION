<template>
  <div>
    <!-- PAGE HERO with search inside -->
    <div class="bg-[#f8fafc] border-b border-[#e2e8f0] pt-12 pb-8 text-center">
      <div class="wrap">
        <h1 class="h1 mb-2 reveal">Nutrition Blog</h1>
        <p class="body-sm text-[#64748b] mb-7 reveal" style="--d:80ms">Expert insights, tips, and guides to help you on your wellness journey</p>
        <!-- Search -->
        <div class="relative max-w-lg mx-auto mb-6 reveal" style="--d:120ms">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="query" type="search" placeholder="Search articles..." class="input pl-11" />
        </div>
        <!-- Category tabs -->
        <div class="flex flex-wrap gap-2 justify-center reveal" style="--d:160ms">
          <button
            v-for="cat in categories"
            :key="cat"
            class="btn btn-sm rounded-full"
            :class="activeCat === cat ? 'btn-primary' : 'btn-outline'"
            @click="activeCat = cat"
          >{{ cat }}</button>
        </div>
      </div>
    </div>

    <section class="section bg-white">
      <div class="wrap">

        <!-- Featured Article -->
        <div class="card overflow-hidden mb-10 reveal">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div class="overflow-hidden" style="min-height:260px">
              <img :src="featured.image" :alt="featured.title" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-8 md:p-10 flex flex-col justify-center">
              <div class="flex gap-2 mb-4">
                <span class="badge badge-green">{{ featured.category }}</span>
                <span class="badge bg-[#f1f5f9] text-[#475569]">Featured</span>
              </div>
              <h2 class="h2 mb-3">{{ featured.title }}</h2>
              <p class="body-sm text-[#64748b] mb-5">{{ featured.excerpt }}</p>
              <div class="flex items-center gap-4 text-[#94a3b8] text-xs mb-6">
                <span class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
                  {{ featured.author }}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {{ featured.date }}
                </span>
                <span>{{ featured.readTime }}</span>
              </div>
              <NuxtLink :to="`/blog/${featured.slug}`" class="btn btn-primary w-fit gap-1.5">
                Read Full Article →
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Articles Grid -->
        <div v-if="filteredPosts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="(post, i) in filteredPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="card overflow-hidden group reveal"
            :style="`--d:${(i % 3) * 70}ms`"
          >
            <div class="overflow-hidden" style="aspect-ratio:16/9">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div class="p-5">
              <div class="flex items-center gap-1.5 mb-2">
                <svg class="w-3 h-3 text-[#1a7a4a]" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
                <span class="text-[#1a7a4a] text-xs font-semibold">{{ post.category }}</span>
              </div>
              <h3 class="font-bold text-[#0f172a] mb-2 leading-snug group-hover:text-[#1a7a4a] transition-colors">{{ post.title }}</h3>
              <p class="text-xs text-[#64748b] leading-relaxed mb-4 line-clamp-3">{{ post.excerpt }}</p>
              <div class="flex items-center justify-between text-[#94a3b8] text-[11px]">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {{ post.date }}
                </span>
                <span>{{ post.readTime }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-16">
          <p class="text-[#64748b]">No articles found.
            <button class="text-[#1a7a4a] font-semibold hover:underline" @click="query='';activeCat='All'">Clear filters</button>
          </p>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="section-sm">
      <div class="wrap">
        <div class="bg-[#1a7a4a] rounded-3xl p-8 md:p-12 text-center reveal">
          <h2 class="text-2xl font-bold text-white mb-3">Subscribe to Our Newsletter</h2>
          <p class="text-green-100 body-sm mb-7 max-w-md mx-auto">Get the latest nutrition tips, healthy recipes, and wellness insights delivered to your inbox weekly.</p>
          <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" @submit.prevent="subscribe">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
              class="input flex-1 bg-white/10 border-white/25 text-white placeholder:text-green-200 focus:border-white"
            />
            <button type="submit" class="btn btn-white shrink-0">Subscribe</button>
          </form>
          <Transition name="fade">
            <p v-if="subscribed" class="text-green-200 text-sm mt-3 flex items-center justify-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              You're subscribed! Thank you.
            </p>
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Nutrition Blog – SWM Nutrition' })
const { init, destroy } = useReveal()
onMounted(() => nextTick(init))
onUnmounted(destroy)

const query = ref(''), activeCat = ref('All'), email = ref(''), subscribed = ref(false)
const categories = ['All', 'Nutrition', 'Wellness', 'Recipes', 'Fitness']

function subscribe() {
  subscribed.value = true; email.value = ''
  setTimeout(() => { subscribed.value = false }, 5000)
}

const featured = {
  title: 'Understanding Macronutrients: A Complete Guide for Kenyans',
  category: 'Nutrition', author: 'SWM Nutrition', date: 'January 28, 2026',
  readTime: '5 min read', slug: 'understanding-macronutrients',
  image: 'https://images.unsplash.com/photo-1609197100049-373be8d93f56?w=900&q=85&auto=format&fit=crop',
  excerpt: 'Learn how proteins, carbs, and fats work together to fuel your body with locally available foods. A comprehensive guide to help Kenyans make informed nutritional choices.',
}

const posts = [
  { title: '10 Superfoods Available in Kenyan Markets',        category: 'Nutrition', date: 'Jan 25, 2026', readTime: '7 min read', slug: '10-superfoods-kenya',  image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80&auto=format&fit=crop',  excerpt: 'Discover powerful, nutrient-dense foods you can find locally to boost your health naturally.' },
  { title: 'Meal Prep for Busy Professionals in Nairobi',      category: 'Recipes',   date: 'Jan 22, 2026', readTime: '6 min read', slug: 'meal-prep-nairobi',   image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80&auto=format&fit=crop',  excerpt: 'Time-saving strategies to maintain healthy eating habits even with a demanding schedule.' },
  { title: 'Building a Sustainable Wellness Routine',          category: 'Wellness',  date: 'Jan 20, 2026', readTime: '8 min read', slug: 'sustainable-wellness', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop',  excerpt: 'Create lasting healthy habits that fit into your lifestyle and cultural practices.' },
  { title: 'Hydration: The Overlooked Key to Health',          category: 'Wellness',  date: 'Jan 18, 2026', readTime: '4 min read', slug: 'hydration-health',     image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop',  excerpt: 'Why staying properly hydrated is crucial in Kenya\'s climate and how to do it right.' },
  { title: 'Sports Nutrition for Kenyan Athletes',             category: 'Fitness',   date: 'Jan 15, 2026', readTime: '10 min read', slug: 'sports-nutrition',   image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&auto=format&fit=crop',  excerpt: 'Optimize your performance with proper nutrition strategies tailored for athletes.' },
  { title: '10 Essential Nutrients Every Body Needs',          category: 'Nutrition', date: 'Jan 12, 2026', readTime: '8 min read', slug: 'essential-nutrients',  image: 'https://images.unsplash.com/photo-1609197100049-373be8d93f56?w=600&q=80&auto=format&fit=crop',  excerpt: 'A deep dive into the most critical nutrients for optimal health and how to get them from local foods.' },
  { title: 'Understanding Gut Health & Its Role in Wellness',  category: 'Wellness',  date: 'Jan 10, 2026', readTime: '6 min read', slug: 'gut-health',           image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80&auto=format&fit=crop',  excerpt: 'Explore how gut health impacts everything from mood to immunity.' },
]

const filteredPosts = computed(() => posts.filter(p => {
  const mc = activeCat.value === 'All' || p.category === activeCat.value
  const mq = !query.value || p.title.toLowerCase().includes(query.value.toLowerCase())
  return mc && mq
}))
</script>
