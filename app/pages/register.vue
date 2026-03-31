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
        <h1 class="text-2xl font-extrabold text-[#0f172a]">Create an account</h1>
        <p class="text-[#64748b] text-sm mt-1">Start your wellness journey today</p>
      </div>

      <div class="card p-7">
        <!-- Error banner -->
        <div v-if="error" class="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ error }}
        </div>

        <!-- Success banner -->
        <div v-if="success" class="mb-5 p-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Account created! Redirecting...
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Full name -->
          <div>
            <label class="lbl" for="fullName">Full Name</label>
            <input
              id="fullName" v-model="fullName" type="text"
              placeholder="Jane Doe"
              class="input" required autocomplete="name"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="lbl" for="email">Email Address</label>
            <input
              id="email" v-model="email" type="email"
              placeholder="you@example.com"
              class="input" required autocomplete="email"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="lbl" for="phone">Phone Number</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-sm font-medium">+254</span>
              <input
                id="phone" v-model="phone" type="tel"
                placeholder="7XX XXX XXX"
                class="input pl-14" required autocomplete="tel"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="lbl" for="password">Password</label>
            <div class="relative">
              <input
                id="password" v-model="password"
                :type="showPw ? 'text' : 'password'"
                placeholder="••••••••"
                class="input pr-11" required autocomplete="new-password"
                minlength="8"
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
            <p class="text-xs text-[#94a3b8] mt-1">Minimum 8 characters</p>
          </div>

          <!-- Confirm password -->
          <div>
            <label class="lbl" for="confirmPassword">Confirm Password</label>
            <div class="relative">
              <input
                id="confirmPassword" v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="••••••••"
                class="input pr-11" required autocomplete="new-password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                @click="showConfirm = !showConfirm"
              >
                <svg v-if="!showConfirm" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="text-center text-sm text-[#64748b] mt-5">
          Already have an account?
          <NuxtLink to="/login" class="text-[#1a7a4a] font-semibold hover:underline">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Register – SWM Nutrition' })

const router   = useRouter()
const supabase = useSupabaseClient()

const fullName       = ref('')
const email          = ref('')
const phone          = ref('')
const password       = ref('')
const confirmPassword = ref('')
const loading        = ref(false)
const error          = ref('')
const success        = ref(false)
const showPw         = ref(false)
const showConfirm    = ref(false)

async function handleRegister() {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }

  loading.value = true
  try {
    const { error: authErr } = await supabase.auth.signUp({
      email:    email.value.trim(),
      password: password.value,
      options: {
        data: {
          full_name: fullName.value.trim(),
          phone:     `+254${phone.value.replace(/\s/g, '')}`,
          role:      'client',
        },
      },
    })

    if (authErr) throw authErr

    // Update phone in profiles table (trigger only sets full_name + role)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({
        phone: `+254${phone.value.replace(/\s/g, '')}`,
      }).eq('id', user.id)
    }

    success.value = true
    setTimeout(() => router.push('/'), 1500)
  } catch (e: any) {
    error.value = e.message === 'User already registered'
      ? 'An account with this email already exists.'
      : e.message
  } finally {
    loading.value = false
  }
}
</script>