<template>
  <div>
    <!-- Back -->
    <div class="bg-[#f8fafc] border-b border-[#e2e8f0] py-3">
      <div class="wrap">
        <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1a7a4a] transition-colors group">
          <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Blog
        </NuxtLink>
      </div>
    </div>

    <section class="section bg-white">
      <div class="wrap max-w-3xl mx-auto">

        <!-- Hero image -->
        <div class="rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgb(0,0,0,0.16)] mb-8" style="aspect-ratio:16/9">
          <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" loading="eager" />
        </div>

        <!-- Article card -->
        <div class="card p-7 md:p-10 mb-6">
          <span class="badge badge-green mb-4 inline-flex">{{ post.category }}</span>
          <h1 class="h1 mb-5 text-[#0f172a]">{{ post.title }}</h1>

          <!-- Author row -->
          <div class="flex items-center justify-between mb-6 pb-6 border-b border-[#e2e8f0] flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <img :src="post.authorAvatar" :alt="post.author" class="w-10 h-10 rounded-full object-cover ring-2 ring-[#e8f5ee]" />
              <div>
                <p class="font-bold text-[#0f172a] text-sm">{{ post.author }}</p>
                <div class="flex items-center gap-3 text-[#94a3b8] text-xs">
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ post.date }}
                  </span>
                  <span>{{ post.readTime }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-outline btn-sm gap-1.5">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              <button class="btn btn-outline btn-sm gap-1.5">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                Save
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="prose" v-html="post.content" />
        </div>

        <!-- Author bio -->
        <div class="card p-6 flex items-start gap-4 mb-12">
          <img :src="post.authorAvatar" :alt="post.author" class="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-[#e8f5ee]" />
          <div>
            <p class="text-xs text-[#64748b] uppercase tracking-wide font-semibold mb-0.5">About the Author</p>
            <h4 class="font-bold text-[#0f172a] mb-2">{{ post.author }}</h4>
            <p class="text-sm text-[#64748b] leading-relaxed mb-3">{{ post.authorBio }}</p>
            <a href="#" class="text-[#1a7a4a] text-sm font-semibold hover:underline">View Profile →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Articles -->
    <section class="section-sm bg-[#f8fafc]">
      <div class="wrap">
        <h2 class="h2 mb-8">Related Articles</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <NuxtLink
            v-for="(rp, i) in related"
            :key="rp.slug"
            :to="`/blog/${rp.slug}`"
            class="card overflow-hidden group reveal"
            :style="`--d:${i * 80}ms`"
          >
            <div class="overflow-hidden" style="aspect-ratio:16/9">
              <img :src="rp.image" :alt="rp.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-4">
              <span class="badge badge-green mb-2 inline-flex text-[10px]">{{ rp.category }}</span>
              <h4 class="font-bold text-[#0f172a] text-sm leading-snug group-hover:text-[#1a7a4a] transition-colors">{{ rp.title }}</h4>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { init, destroy } = useReveal()
onMounted(() => nextTick(init))
onUnmounted(destroy)

const post = {
  title: '10 Essential Nutrients Every Body Needs',
  category: 'Nutrition Basics',
  author: 'SWM Nutrition',
  authorAvatar: 'https://i.pravatar.cc/96?img=47',
  authorBio: 'SWM Nutrition is Kenya\'s premier nutritional consultancy, dedicated to transforming lives through evidence-based nutritional guidance. Based in Nairobi\'s Westlands, we serve clients across Kenya with personalized wellness solutions grounded in local food knowledge.',
  date: 'January 28, 2026',
  readTime: '8 min read',
  image: 'https://images.unsplash.com/photo-1609197100049-373be8d93f56?w=1200&q=85&auto=format&fit=crop',
  content: `
    <p>Proper nutrition is the cornerstone of good health, and understanding which nutrients your body needs is essential for maintaining optimal wellness. In this comprehensive guide, we'll explore the ten most critical nutrients that form the foundation of a healthy diet.</p>
    <h2>1. Protein: The Building Block</h2>
    <p>Protein is essential for building and repairing tissues, producing enzymes and hormones, and supporting immune function. Adults should aim for 0.8 grams of protein per kilogram of body weight daily. Excellent sources include lean meats, fish, eggs, legumes, and dairy products.</p>
    <h2>2. Omega-3 Fatty Acids</h2>
    <p>These essential fats support heart health, brain function, and reduce inflammation throughout the body. Find them in fatty fish like salmon, walnuts, flaxseeds, and chia seeds.</p>
    <h2>3. Vitamin D: The Sunshine Vitamin</h2>
    <p>Crucial for bone health, immune function, and mood regulation. While our bodies can produce vitamin D from sunlight, many people need supplementation, especially in winter months.</p>
    <h2>4. Calcium</h2>
    <p>Beyond building strong bones and teeth, calcium plays a role in muscle function, nerve transmission, and blood clotting. Dairy products, leafy greens, and fortified foods are excellent sources.</p>
    <h2>5. Iron</h2>
    <p>Essential for carrying oxygen in the blood and supporting energy levels. Women, particularly those of childbearing age, need to pay special attention to iron intake. Find it in red meat, poultry, fish, legumes, and fortified cereals.</p>
    <h2>6. Fiber</h2>
    <p>Critical for digestive health, blood sugar control, and maintaining a healthy weight. Aim for 25–30 grams daily from whole grains, fruits, vegetables, and legumes.</p>
    <h2>7. Vitamin B12</h2>
    <p>Vital for nerve function, DNA synthesis, and red blood cell formation. Found primarily in animal products, vegetarians and vegans should consider supplementation.</p>
    <h2>8. Magnesium</h2>
    <p>Involved in over 300 enzymatic reactions in the body, including energy production, muscle function, and bone health. Rich sources include nuts, seeds, whole grains, and dark leafy greens.</p>
    <h2>9. Vitamin C</h2>
    <p>A powerful antioxidant that supports immune function, collagen production, and iron absorption. Citrus fruits, berries, bell peppers, and broccoli are excellent sources.</p>
    <h2>10. Potassium</h2>
    <p>Essential for heart health, muscle function, and maintaining healthy blood pressure. Find it in bananas, sweet potatoes, spinach, and beans.</p>
    <h2>Putting It All Together</h2>
    <p>The key to getting all these essential nutrients is eating a varied, balanced diet rich in whole foods. Focus on:</p>
    <ul>
      <li>Colorful fruits and vegetables</li>
      <li>Lean proteins</li>
      <li>Whole grains</li>
      <li>Healthy fats</li>
      <li>Low fat dairy or fortified alternatives</li>
    </ul>
    <p>Remember, while supplements can help fill nutritional gaps, they shouldn't replace a healthy diet. If you're concerned about your nutrient intake, consult with a registered dietitian who can provide personalized guidance based on your individual needs.</p>
    <h2>Conclusion</h2>
    <p>By understanding and prioritizing these ten essential nutrients, you're taking an important step toward optimal health. Small, consistent changes in your diet can lead to significant improvements in how you feel and function every day.</p>
  `,
}

const related = [
  { title: 'Understanding Macronutrients',       category: 'Nutrition Basics', slug: 'understanding-macronutrients', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80&auto=format&fit=crop' },
  { title: 'Supplements: What You Really Need',  category: 'Supplements',      slug: 'supplements-guide',            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&auto=format&fit=crop' },
  { title: 'Plant-Based Protein: Complete Guide', category: 'Plant-Based',     slug: 'plant-based-protein',          image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80&auto=format&fit=crop' },
]

useHead({ title: `${post.title} – SWM Nutrition Blog` })
</script>
