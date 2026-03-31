// middleware/admin.ts
// Protects /admin/** – checks Supabase session + profile.role
export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()

  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    // Not logged in → go to login with redirect back
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // Check the user's role in profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || !['admin', 'staff'].includes(profile.role)) {
    // Logged in but not admin → redirect home with error
    return navigateTo('/?unauthorized=1')
  }

  // All good – let them through
})
