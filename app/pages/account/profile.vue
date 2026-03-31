<template>
  <div>
    <div class="page-hero">
      <div class="wrap">
        <h1 class="h1">My Profile</h1>
        <p class="body-sm text-[#64748b] mt-2">Manage your personal information</p>
      </div>
    </div>

    <section class="section bg-[#f8fafc]">
      <div class="wrap max-w-2xl mx-auto">

        <!-- Account nav -->
        <div class="flex gap-2 mb-6">
            <NuxtLink to="/account/profile" class="btn btn-sm" :class="$route.path === '/account/profile' ? 'btn-primary' : 'btn-outline'">Profile</NuxtLink>
            <NuxtLink to="/account/orders" class="btn btn-sm" :class="$route.path === '/account/orders' ? 'btn-primary' : 'btn-outline'">My Orders</NuxtLink>
            <NuxtLink to="/account/appointments" class="btn btn-sm" :class="$route.path === '/account/appointments' ? 'btn-primary' : 'btn-outline'">My Appointments</NuxtLink>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="card p-8 animate-pulse space-y-4">
          <div class="h-4 bg-[#e2e8f0] rounded w-1/3"/>
          <div class="h-4 bg-[#e2e8f0] rounded w-1/2"/>
          <div class="h-4 bg-[#e2e8f0] rounded w-2/3"/>
        </div>

        <div v-else class="space-y-5">
          <!-- Avatar + name card -->
          <div class="card p-6 flex items-center gap-5">
            <div class="w-16 h-16 rounded-2xl bg-[#1a7a4a] flex items-center justify-center text-white text-2xl font-extrabold shrink-0">
              {{ initials }}
            </div>
            <div>
              <p class="font-extrabold text-[#0f172a] text-lg">{{ form.full_name || 'No name set' }}</p>
              <p class="text-[#64748b] text-sm">{{ user?.email }}</p>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e8f5ee] text-[#1a7a4a] capitalize mt-1 inline-block">{{ profile?.role }}</span>
            </div>
          </div>

          <!-- Success / error banners -->
          <div v-if="success" class="p-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Profile updated successfully!
          </div>
          <div v-if="error" class="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ error }}
          </div>

          <!-- Edit form -->
          <div class="card p-6 space-y-4">
            <h2 class="font-bold text-[#0f172a]">Personal Information</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="lbl">Full Name</label>
                <input v-model="form.full_name" type="text" class="input" placeholder="Jane Doe" />
              </div>
              <div>
                <label class="lbl">Phone Number</label>
                <input v-model="form.phone" type="tel" class="input" placeholder="+254700000000" />
              </div>
              <div>
                <label class="lbl">City</label>
                <input v-model="form.city" type="text" class="input" placeholder="Nairobi" />
              </div>
              <div>
                <label class="lbl">Country</label>
                <input v-model="form.country" type="text" class="input" placeholder="Kenya" />
              </div>
              <div>
                <label class="lbl">Date of Birth</label>
                <input v-model="form.date_of_birth" type="date" class="input" />
              </div>
            </div>

            <button
              class="btn btn-primary gap-2 disabled:opacity-60"
              :disabled="saving"
              @click="saveProfile"
            >
              <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

          <!-- Change password -->
          <div class="card p-6 space-y-4">
            <h2 class="font-bold text-[#0f172a]">Change Password</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="lbl">New Password</label>
                <input v-model="newPassword" type="password" class="input" placeholder="Min 8 characters" minlength="8" />
              </div>
              <div>
                <label class="lbl">Confirm Password</label>
                <input v-model="confirmPassword" type="password" class="input" placeholder="Repeat password" />
              </div>
            </div>
            <div v-if="pwError" class="text-red-600 text-sm">{{ pwError }}</div>
            <div v-if="pwSuccess" class="text-green-700 text-sm">Password updated successfully!</div>
            <button
              class="btn btn-outline gap-2 disabled:opacity-60"
              :disabled="savingPw"
              @click="changePassword"
            >
              {{ savingPw ? 'Updating...' : 'Update Password' }}
            </button>
          </div>

          <!-- Sign out -->
          <div class="card p-6 flex items-center justify-between">
            <div>
              <p class="font-semibold text-[#0f172a]">Sign Out</p>
              <p class="text-sm text-[#64748b]">Sign out of your account on this device</p>
            </div>
            <button class="btn btn-outline text-red-500 border-red-200 hover:bg-red-50" @click="signOut">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'My Profile – SWM Nutrition' })

const supabase = useSupabaseClient()
const router   = useRouter()

const loading  = ref(true)
const saving   = ref(false)
const savingPw = ref(false)
const success  = ref(false)
const error    = ref('')
const pwError  = ref('')
const pwSuccess = ref(false)

const user    = ref<any>(null)
const profile = ref<any>(null)

const form = reactive({
  full_name:     '',
  phone:         '',
  city:          '',
  country:       '',
  date_of_birth: '',
})

const newPassword     = ref('')
const confirmPassword = ref('')

const initials = computed(() => {
  if (!form.full_name) return '?'
  return form.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
})

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  user.value = session.user

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (data) {
    profile.value          = data
    form.full_name         = data.full_name     ?? ''
    form.phone             = data.phone         ?? ''
    form.city              = data.city          ?? ''
    form.country           = data.country       ?? ''
    form.date_of_birth     = data.date_of_birth ?? ''
  }

  loading.value = false
})

async function saveProfile() {
  error.value   = ''
  success.value = false
  saving.value  = true
  try {
    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name:     form.full_name,
        phone:         form.phone,
        city:          form.city,
        country:       form.country,
        date_of_birth: form.date_of_birth || null,
      })
      .eq('id', user.value.id)

    if (err) throw err
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch (e: any) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  pwError.value   = ''
  pwSuccess.value = false

  if (!newPassword.value) return
  if (newPassword.value.length < 8) {
    pwError.value = 'Password must be at least 8 characters.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    pwError.value = 'Passwords do not match.'
    return
  }

  savingPw.value = true
  try {
    const { error: err } = await supabase.auth.updateUser({ password: newPassword.value })
    if (err) throw err
    pwSuccess.value   = true
    newPassword.value     = ''
    confirmPassword.value = ''
    setTimeout(() => { pwSuccess.value = false }, 3000)
  } catch (e: any) {
    pwError.value = e.message
  } finally {
    savingPw.value = false
  }
}

async function signOut() {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>