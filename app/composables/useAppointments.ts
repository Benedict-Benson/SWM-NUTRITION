import { ref } from 'vue'

export function useAppointments() {
  const supabase = useSupabaseClient()
  const loading  = ref(false)
  const error    = ref<string | null>(null)

  async function bookAppointment({
    clientName, clientEmail, clientPhone,
    serviceType, mode = 'virtual',
    scheduledAt, durationMins = 60, notes,
  }: any) {
    loading.value = true
    error.value   = null
    try {
      const user  = useSupabaseUser()
      const start = new Date(scheduledAt)
      const end   = new Date(start.getTime() + durationMins * 60000)

      const { data: conflicts } = await supabase
        .from('appointments')
        .select('id')
        .gte('scheduled_at', new Date(start.getTime() - 90 * 60000).toISOString())
        .lte('scheduled_at', end.toISOString())
        .in('status', ['pending', 'confirmed'])

      if (conflicts && conflicts.length > 0) {
        return { success: false, error: 'That time slot is already booked. Please choose another.' }
      }

      const { data, error: err } = await supabase
        .from('appointments')
        .insert({
          user_id:       user.value?.id ?? null,
          client_name:   clientName,
          client_email:  clientEmail,
          client_phone:  clientPhone,
          service_type:  serviceType,
          mode,
          scheduled_at:  scheduledAt,
          duration_mins: durationMins,
          notes,
          status:        'pending',
        })
        .select()
        .single()

      if (err) throw err
      return { success: true, appointment: data }
    } catch (e: any) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableSlots(date: string) {
    const allSlots = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']
    const { data: booked } = await supabase
      .from('appointments')
      .select('scheduled_at')
      .gte('scheduled_at', `${date}T00:00:00`)
      .lte('scheduled_at', `${date}T23:59:59`)
      .in('status', ['pending', 'confirmed'])

    const bookedTimes = (booked ?? []).map((a: any) => a.scheduled_at.slice(11, 16))
    return allSlots.map(time => ({ time, available: !bookedTimes.includes(time) }))
  }

  async function fetchMyAppointments() {
    const user = useSupabaseUser()
    if (!user.value) return []
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.value.id)
      .order('scheduled_at', { ascending: false })
    return data ?? []
  }

  async function cancelAppointment(id: string) {
    const { error: err } = await supabase
      .from('appointments')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)
    if (err) return { success: false, error: err.message }
    return { success: true }
  }

  async function fetchAllAppointments({ status = '', page = 1, limit = 20 } = {}) {
    const from = (page - 1) * limit
    let query = supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .order('scheduled_at', { ascending: false })
      .range(from, from + limit - 1)

    if (status) query = query.eq('status', status)

    const { data, count, error: err } = await query
    if (err) return { appointments: [], total: 0 }
    return { appointments: data ?? [], total: count ?? 0 }
  }

  async function updateAppointmentStatus(
    id: string,
    status: string,
    { adminNotes, meetingLink }: { adminNotes?: string; meetingLink?: string } = {}
  ) {
    const updates: any = { status, updated_at: new Date().toISOString() }
    if (adminNotes)  updates.admin_notes  = adminNotes
    if (meetingLink) updates.meeting_link = meetingLink

    const { data, error: err } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) return { success: false, error: err.message }
    return { success: true, data }
  }

  return {
    loading, error,
    bookAppointment, fetchAvailableSlots,
    fetchMyAppointments, cancelAppointment,
    fetchAllAppointments, updateAppointmentStatus,
  }
}