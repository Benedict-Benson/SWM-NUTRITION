<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-[#0f172a]">Products</h1>
      <button class="btn btn-primary gap-1.5" @click="openModal()">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Product
      </button>
    </div>

    <div class="flex gap-2 mb-5 flex-wrap">
      <input v-model="search" type="text" placeholder="Search products…" class="input py-2 text-sm w-56" @input="debouncedFetch" />
      <select v-model="catFilter" class="input py-2 text-sm w-44" @change="page = 1; fetchData()">
        <option value="">All categories</option>
        <option v-for="c in categories" :key="c">{{ c }}</option>
      </select>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th v-for="h in ['Product','Category','Price','Stock','Active','Actions']" :key="h" class="text-left text-xs font-semibold text-[#64748b] px-4 py-3">{{ h }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f1f5f9]">
            <tr v-if="loading"><td colspan="6" class="px-4 py-12 text-center text-[#94a3b8]">Loading…</td></tr>
            <tr v-else-if="!products.length"><td colspan="6" class="px-4 py-12 text-center text-[#94a3b8]">No products found</td></tr>
            <tr v-for="p in products" :key="p.id" class="hover:bg-[#f8fafc] transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img :src="p.images?.[0] ?? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&q=60'" class="w-10 h-10 rounded-lg object-cover bg-[#f1f5f9] shrink-0" />
                  <div>
                    <p class="font-semibold text-[#0f172a] max-w-[200px] truncate">{{ p.name }}</p>
                    <p class="text-xs text-[#94a3b8]">{{ p.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3"><span class="badge badge-green text-[10px]">{{ p.category }}</span></td>
              <td class="px-4 py-3 font-bold text-[#0f172a]">KSh {{ Number(p.price).toLocaleString() }}</td>
              <td class="px-4 py-3"><span :class="p.stock_quantity < 5 ? 'text-red-600 font-bold' : 'text-[#0f172a]'">{{ p.stock_quantity }}</span></td>
              <td class="px-4 py-3">
                <button class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors" :class="p.is_active ? 'bg-[#1a7a4a]' : 'bg-[#e2e8f0]'" @click="toggleActive(p)">
                  <span class="w-3.5 h-3.5 rounded-full bg-white shadow transition-transform" :class="p.is_active ? 'translate-x-4' : 'translate-x-1'" />
                </button>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-1.5">
                  <button class="btn btn-outline btn-sm" @click="openModal(p)">Edit</button>
                  <button class="btn btn-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" @click="confirmDelete(p)">Del</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3.5 border-t border-[#e2e8f0] flex items-center justify-between">
        <p class="text-xs text-[#64748b]">{{ total }} products total</p>
        <div class="flex items-center gap-1">
          <button class="btn btn-outline btn-sm" :disabled="page <= 1" @click="page--; fetchData()">← Prev</button>
          <span class="px-3 text-sm text-[#64748b]">{{ page }}</span>
          <button class="btn btn-outline btn-sm" :disabled="products.length < limit" @click="page++; fetchData()">Next →</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showModal = false">
          <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
              <h2 class="font-bold text-[#0f172a]">{{ form.id ? 'Edit' : 'Add' }} Product</h2>
              <button class="w-7 h-7 rounded-full bg-[#f8fafc] flex items-center justify-center" @click="showModal = false">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="p-5 space-y-4">
              <div><label class="lbl">Name *</label><input v-model="form.name" type="text" class="input" /></div>
              <div><label class="lbl">Slug</label><input v-model="form.slug" type="text" class="input" placeholder="auto-generated if empty" /></div>
              <div class="grid grid-cols-2 gap-3">
                <div><label class="lbl">Price (KSh) *</label><input v-model.number="form.price" type="number" min="0" class="input" /></div>
                <div><label class="lbl">Original Price</label><input v-model.number="form.original_price" type="number" min="0" class="input" /></div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div><label class="lbl">Stock Qty</label><input v-model.number="form.stock_quantity" type="number" min="0" class="input" /></div>
                <div>
                  <label class="lbl">Category *</label>
                  <select v-model="form.category" class="input">
                    <option v-for="c in categories" :key="c">{{ c }}</option>
                  </select>
                </div>
              </div>
              <div><label class="lbl">Short Description</label><input v-model="form.short_desc" type="text" class="input" /></div>
              <div><label class="lbl">Full Description</label><textarea v-model="form.description" class="input min-h-[80px]" /></div>
              <div><label class="lbl">Image URL</label><input v-model="form.imageUrl" type="url" class="input" placeholder="https://…" /></div>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input v-model="form.is_active" type="checkbox" class="w-4 h-4 rounded accent-[#1a7a4a]" />
                  <span class="text-sm text-[#0f172a]">Active</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input v-model="form.is_featured" type="checkbox" class="w-4 h-4 rounded accent-[#1a7a4a]" />
                  <span class="text-sm text-[#0f172a]">Featured</span>
                </label>
              </div>
            </div>
            <div class="p-5 border-t border-[#e2e8f0] flex justify-end gap-2">
              <button class="btn btn-outline" @click="showModal = false">Cancel</button>
              <button class="btn btn-primary" :disabled="saving" @click="saveProduct">
                {{ saving ? 'Saving…' : 'Save Product' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Products – SWM Admin' })

const admin      = useAdmin()
const products   = ref<any[]>([])
const total      = ref(0)
const loading    = ref(true)
const page       = ref(1)
const limit      = 20
const search     = ref('')
const catFilter  = ref('')
const showModal  = ref(false)
const saving     = ref(false)
const form       = ref<Record<string, any>>({})
const categories = ['Supplements', 'Meal Plans', 'Consultations', 'Wellness']

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchData() }, 380)
}

async function fetchData() {
  loading.value = true
  try {
    const r = await admin.fetchAllProducts({ category: catFilter.value, search: search.value, page: page.value, limit })
    products.value = r.products
    total.value    = r.total
  } finally { loading.value = false }
}

function openModal(p?: any) {
  form.value = p
    ? { ...p, imageUrl: p.images?.[0] ?? '' }
    : { category: 'Supplements', stock_quantity: 0, is_active: true, is_featured: false, imageUrl: '' }
  showModal.value = true
}

async function saveProduct() {
  saving.value = true
  try {
    const { imageUrl, ...rest } = form.value
    await admin.upsertProduct({ ...rest, images: imageUrl ? [imageUrl] : [] })
    showModal.value = false
    await fetchData()
  } finally { saving.value = false }
}

async function toggleActive(p: any) {
  await admin.toggleProductActive(p.id, !p.is_active)
  await fetchData()
}

async function confirmDelete(p: any) {
  if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
    await admin.deleteProduct(p.id)
    await fetchData()
  }
}

onMounted(fetchData)
</script>
