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
        <h1 class="text-2xl font-extrabold text-[#0f172a]">Set New Password</h1>
        <p class="text-[#64748b] text-sm mt-1">Choose a strong password for your account</p>
      </div>

      <div class="card p-7">
        <!-- Success state -->
        <div v-if="success" class="text-center py-4">
          <div class="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-[#1a7a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 class="font-bold text-[#0f172a] mb-2">Password Updated!</h3>
          <p class="text-[#64748b] text-sm mb-5">Your password has been changed successfully.</p>
          <NuxtLink to="/login" class="btn btn-primary">Sign In</NuxtLink>
        </div>

        <!-- Invalid / expired link -->
        <div v-else-if="invalidLink" class="text-center py-4">
          <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="font-bold text-[#0f172a] mb-2">Link Expired</h3>
          <p class="text-[#64748b] text-sm mb-5">This reset link is invalid or has expired. Please request a new one.</p>
          <NuxtLink to="/forgot-password" class="btn btn-primary">Request New Link</NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="updatePassword" class="space-y-4">
          <!-- Error -->
          <div v-if="error" class="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <div>
            <label class="lbl" for="password">New Password</label>
            <div class="relative">
              <input
                id="password" v-model="password"
                :type="showPw ? 'text' : 'password'"
                placeholder="Min 8 characters"
                class="input pr-11" required minlength="8"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]" @click="showPw = !showPw">
                <svg v-if="!showPw" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div>
            <label class="lbl" for="confirm">Confirm Password</label>
            <div class="relative">
              <input
                id="confirm" v-model="confirm"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Repeat your password"
                class="input pr-11" required
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]" @click="showConfirm = !showConfirm">
                <svg v-if="!showConfirm" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <!-- Password strength -->
          <div v-if="password" class="space-y-1">
            <div class="flex gap-1">
              <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all"
                :class="strength >= i ? strengthColor : 'bg-[#e2e8f0]'" />
            </div>
            <p class="text-xs" :class="strengthColor.replace('bg-', 'text-')">{{ strengthLabel }}</p>
          </div>

          <button type="submit" class="btn btn-primary btn-full btn-lg gap-2 disabled:opacity-60" :disabled="loading">
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'Updating…' : 'Update Password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Reset Password – SWM Nutrition' })

const supabase   = useSupabaseClient()
const router     = useRouter()

const password    = ref('')
const confirm     = ref('')
const loading     = ref(false)
const error       = ref('')
const success     = ref(false)
const invalidLink = ref(false)
const showPw      = ref(false)
const showConfirm = ref(false)

// Check session on mount — Supabase sets session from URL hash automatically
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    invalidLink.value = true
  }
})

// Password strength
const strength = computed(() => {
  const p = password.value
  if (!p) return 0
  let s = 0
  if (p.length >= 8)              s++
  if (/[A-Z]/.test(p))            s++
  if (/[0-9]/.test(p))            s++
  if (/[^A-Za-z0-9]/.test(p))     s++
  return s
})

const strengthColor = computed(() => {
  if (strength.value <= 1) return 'bg-red-400'
  if (strength.value === 2) return 'bg-amber-400'
  if (strength.value === 3) return 'bg-blue-400'
  return 'bg-[#1a7a4a]'
})

const strengthLabel = computed(() => {
  if (strength.value <= 1) return 'Weak'
  if (strength.value === 2) return 'Fair'
  if (strength.value === 3) return 'Good'
  return 'Strong'
})

async function updatePassword() {
  error.value = ''

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    const { error: err } = await supabase.auth.updateUser({ password: password.value })
    if (err) throw err
    success.value = true
    setTimeout(() => router.push('/login'), 2000)
  } catch (e: any) {
    error.value = e.message ?? 'Failed to update password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>