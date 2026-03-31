<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-[#0f172a]">Blog Posts</h1>
      <button class="btn btn-primary gap-1.5" @click="openModal()">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Post
      </button>
    </div>

    <div class="flex gap-2 mb-5">
      <select v-model="statusFilter" class="input py-2 text-sm w-40" @change="page = 1; fetchData()">
        <option value="">All statuses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th v-for="h in ['Title','Category','Status','Views','Date','Actions']" :key="h" class="text-left text-xs font-semibold text-[#64748b] px-4 py-3">{{ h }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f1f5f9]">
            <tr v-if="loading"><td colspan="6" class="px-4 py-12 text-center text-[#94a3b8]">Loading…</td></tr>
            <tr v-else-if="!posts.length"><td colspan="6" class="px-4 py-12 text-center text-[#94a3b8]">No posts yet.</td></tr>
            <tr v-for="p in posts" :key="p.id" class="hover:bg-[#f8fafc] transition-colors">
              <td class="px-4 py-3 max-w-[280px]">
                <p class="font-semibold text-[#0f172a] truncate">{{ p.title }}</p>
                <p class="text-xs text-[#94a3b8]">/blog/{{ p.slug }}</p>
              </td>
              <td class="px-4 py-3"><span class="badge badge-green text-[10px]">{{ p.category }}</span></td>
              <td class="px-4 py-3">
                <span class="text-xs font-semibold px-2 py-1 rounded-full capitalize" :class="p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">{{ p.status }}</span>
              </td>
              <td class="px-4 py-3 text-[#64748b]">{{ (p.views ?? 0).toLocaleString() }}</td>
              <td class="px-4 py-3 text-xs text-[#94a3b8] whitespace-nowrap">{{ fmtDate(p.created_at) }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-1.5">
                  <NuxtLink :to="`/blog/${p.slug}`" target="_blank" class="btn btn-outline btn-sm">View</NuxtLink>
                  <button class="btn btn-outline btn-sm" @click="openModal(p)">Edit</button>
                  <button class="btn btn-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" @click="confirmDelete(p)">Del</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3.5 border-t border-[#e2e8f0] flex items-center justify-between">
        <p class="text-xs text-[#64748b]">{{ total }} posts total</p>
        <div class="flex items-center gap-1">
          <button class="btn btn-outline btn-sm" :disabled="page <= 1" @click="page--; fetchData()">← Prev</button>
          <span class="px-3 text-sm text-[#64748b]">{{ page }}</span>
          <button class="btn btn-outline btn-sm" :disabled="posts.length < limit" @click="page++; fetchData()">Next →</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showModal = false">
          <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
              <h2 class="font-bold text-[#0f172a]">{{ form.id ? 'Edit Post' : 'New Post' }}</h2>
              <button class="w-7 h-7 rounded-full bg-[#f8fafc] flex items-center justify-center" @click="showModal = false">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="p-5 space-y-4">
              <div><label class="lbl">Title *</label><input v-model="form.title" type="text" class="input" @input="autoSlug" /></div>
              <div><label class="lbl">Slug</label><input v-model="form.slug" type="text" class="input" /></div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="lbl">Category</label>
                  <select v-model="form.category" class="input">
                    <option v-for="c in cats" :key="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <label class="lbl">Status</label>
                  <select v-model="form.status" class="input">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div><label class="lbl">Excerpt</label><textarea v-model="form.excerpt" class="input min-h-[64px]" /></div>
              <div><label class="lbl">Content (Markdown / HTML)</label><textarea v-model="form.content" class="input min-h-[180px] font-mono text-xs" /></div>
              <div><label class="lbl">Cover Image URL</label><input v-model="form.cover_image" type="url" class="input" placeholder="https://…" /></div>
              <div><label class="lbl">Read Time</label><input v-model="form.read_time" type="text" class="input" placeholder="5 min read" /></div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.featured" type="checkbox" class="w-4 h-4 rounded accent-[#1a7a4a]" />
                <span class="text-sm text-[#0f172a]">Mark as featured post</span>
              </label>
            </div>
            <div class="p-5 border-t border-[#e2e8f0] flex justify-end gap-2">
              <button class="btn btn-outline" @click="showModal = false">Cancel</button>
              <button class="btn btn-primary" :disabled="saving" @click="savePost">
                {{ saving ? 'Saving…' : form.status === 'published' ? 'Publish' : 'Save Draft' }}
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
useHead({ title: 'Blog Posts – SWM Admin' })

const admin      = useAdmin()
const posts      = ref<any[]>([])
const total      = ref(0)
const loading    = ref(true)
const showModal  = ref(false)
const saving     = ref(false)
const page       = ref(1)
const limit      = 20
const statusFilter = ref('')
const form       = ref<Record<string, any>>({ status: 'draft', category: 'Nutrition' })
const cats       = ['Nutrition', 'Wellness', 'Recipes', 'Fitness', 'Lifestyle', 'Sports']

async function fetchData() {
  loading.value = true
  try {
    const r = await admin.fetchAllPosts({ page: page.value, limit, status: statusFilter.value })
    posts.value = r.posts
    total.value = r.total
  } finally { loading.value = false }
}

function openModal(p?: any) {
  form.value = p ? { ...p } : { status: 'draft', category: 'Nutrition', featured: false, content: '' }
  showModal.value = true
}

function autoSlug() {
  if (!form.value.id) {
    form.value.slug = (form.value.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
}

async function savePost() {
  saving.value = true
  try {
    await admin.upsertPost(form.value)
    showModal.value = false
    await fetchData()
  } finally { saving.value = false }
}

async function confirmDelete(p: any) {
  if (confirm(`Delete "${p.title}"?`)) {
    await admin.deletePost(p.id)
    await fetchData()
  }
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(fetchData)
</script>
