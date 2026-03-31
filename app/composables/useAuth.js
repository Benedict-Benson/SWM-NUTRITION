// composables/useAuth.js
// Handles sign-up, sign-in, sign-out and reactive current user.

export function useAuth() {
  const supabase = useSupabase()
  const user     = useState('auth_user',    () => null)
  const profile  = useState('auth_profile', () => null)
  const loading  = ref(false)

  // ── Bootstrap: load session on mount ──────────────────────
  async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      user.value = session.user
      await fetchProfile(session.user.id)
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      user.value    = session?.user ?? null
      profile.value = null
      if (session?.user) await fetchProfile(session.user.id)
    })
  }

  // ── Profile ───────────────────────────────────────────────
  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    profile.value = data
  }

  // ── Sign Up ───────────────────────────────────────────────
  async function signUp({ email, password, fullName, phone }) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } },
      })
      if (error) throw error

      // Update profile with extra fields
      if (data.user) {
        await supabase.from('profiles').upsert({
          id:        data.user.id,
          full_name: fullName,
          phone,
        })
      }
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ── Sign In ───────────────────────────────────────────────
  async function signIn({ email, password }) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ── Sign Out ──────────────────────────────────────────────
  async function signOut() {
    await supabase.auth.signOut()
    user.value    = null
    profile.value = null
    await navigateTo('/')
  }

  // ── Update Profile ────────────────────────────────────────
  async function updateProfile(updates) {
    if (!user.value) return { success: false, error: 'Not authenticated' }
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.value.id)
      .select()
      .single()
    if (error) return { success: false, error: error.message }
    profile.value = data
    return { success: true, data }
  }

  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isStaff = computed(() => ['admin', 'staff'].includes(profile.value?.role))

  return { user, profile, loading, init, signUp, signIn, signOut, updateProfile, isAdmin, isStaff }
}