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
        <h1 class="text-2xl font-extrabold text-[#0f172a]">Forgot Password?</h1>
        <p class="text-[#64748b] text-sm mt-1">Enter your email and we'll send you a reset link</p>
      </div>

      <div class="card p-7">
        <!-- Success state -->
        <div v-if="sent" class="text-center py-4">
          <div class="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3 class="font-bold text-[#0f172a] mb-2">Check your email</h3>
          <p class="text-[#64748b] text-sm mb-1">We sent a password reset link to:</p>
          <p class="font-semibold text-[#0f172a] text-sm mb-5">{{ email }}</p>
          <p class="text-xs text-[#94a3b8] mb-5">Didn't receive it? Check your spam folder or try again.</p>
          <div class="flex gap-3 justify-center">
            <button class="btn btn-outline btn-sm" @click="sent = false">Try Again</button>
            <NuxtLink to="/login" class="btn btn-primary btn-sm">Back to Login</NuxtLink>
          </div>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="sendReset" class="space-y-4">
          <!-- Error -->
          <div v-if="error" class="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <div>
            <label class="lbl" for="email">Email Address</label>
            <input
              id="email" v-model="email" type="email"
              placeholder="you@example.com"
              class="input" required autocomplete="email"
            />
          </div>

          <button type="submit" class="btn btn-primary btn-full btn-lg gap-2 disabled:opacity-60" :disabled="loading">
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'Sending…' : 'Send Reset Link' }}
          </button>

          <p class="text-center text-sm text-[#64748b]">
            Remember your password?
            <NuxtLink to="/login" class="text-[#1a7a4a] font-semibold hover:underline">Sign in</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Forgot Password – SWM Nutrition' })

const supabase = useSupabaseClient()
const config   = useRuntimeConfig()

const email   = ref('')
const loading = ref(false)
const error   = ref('')
const sent    = ref(false)

async function sendReset() {
  error.value   = ''
  loading.value = true
  try {
    const siteUrl     = config.public.siteUrl || 'http://localhost:3000'
    const redirectTo  = `${siteUrl}/reset-password`

    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.value.trim(),
      { redirectTo }
    )
    if (err) throw err
    sent.value = true
  } catch (e: any) {
    error.value = e.message ?? 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>