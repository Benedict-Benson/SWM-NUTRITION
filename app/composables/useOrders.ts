// composables/useOrders.ts
import type { Order } from '~/types/shop'

export function useOrders() {
  const supabase = useSupabaseClient()
  const user     = useSupabaseUser()
  const loading  = ref(false)

  async function fetchMyOrders(): Promise<Order[]> {
    if (!user.value) return []
    loading.value = true
    try {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(id,name,quantity,price,image,subtotal)')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })
      return (data ?? []) as Order[]
    } finally {
      loading.value = false
    }
  }

  async function fetchOrder(id: string): Promise<Order | null> {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(id,name,quantity,price,image,subtotal)')
      .eq('id', id)
      .single()
    return data as Order | null
  }

  async function fetchOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(id,name,quantity,price,image,subtotal)')
      .eq('order_number', orderNumber)
      .single()
    return data as Order | null
  }

  return { loading, fetchMyOrders, fetchOrder, fetchOrderByNumber }
}
