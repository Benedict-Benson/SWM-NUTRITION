<template>
  <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-5">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 mb-5">
          <div class="w-10 h-10 rounded-xl bg-[#1a7a4a] flex items-center justify-center">
            <span class="text-white font-extrabold text-sm">SW</span>
          </div>
          <span class="font-bold text-[#0f172a] text-lg">SWM Nutrition</span>
        </NuxtLink>
        <h1 class="text-2xl font-extrabold text-[#0f172a]">Welcome back</h1>
        <p class="text-[#64748b] text-sm mt-1">Sign in to your account</p>
      </div>

      <div class="card p-7">
        <!-- Error banner -->
        <div v-if="error" class="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="lbl" for="email">Email Address</label>
            <input
              id="email" v-model="email" type="email"
              placeholder="you@example.com"
              class="input" required autocomplete="email"
            />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="lbl mb-0" for="password">Password</label>
              <NuxtLink to="/forgot-password" class="text-xs text-[#1a7a4a] hover:underline">Forgot password?</NuxtLink>
            </div>
            <div class="relative">
              <input
                id="password" v-model="password"
                :type="showPw ? 'text' : 'password'"
                placeholder="••••••••"
                class="input pr-11" required autocomplete="current-password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                @click="showPw = !showPw"
              >
                <svg v-if="!showPw" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary btn-full btn-lg gap-2 disabled:opacity-60"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-sm text-[#64748b] mt-5">
          Don't have an account?
          <NuxtLink to="/register" class="text-[#1a7a4a] font-semibold hover:underline">Sign up</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Login – SWM Nutrition' })

const route    = useRoute()
const router   = useRouter()
const supabase = useSupabaseClient()

const email    = ref('')
const password = ref('')
const loading  = ref(false)
const error    = ref('')
const showPw   = ref(false)

async function handleLogin() {
  error.value   = ''
  loading.value = true
  try {
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email:    email.value.trim(),
      password: password.value,
    })
    if (authErr) throw authErr

    // Check if redirect param set (e.g. came from /admin)
    const redirect = route.query.redirect as string
    if (redirect) {
      router.push(redirect)
      return
    }

    // Fetch profile role to decide where to send them
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single()

    if (profile?.role === 'admin' || profile?.role === 'staff') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message === 'Invalid login credentials'
      ? 'Invalid email or password. Please try again.'
      : e.message
  } finally {
    loading.value = false
  }
}
</script>