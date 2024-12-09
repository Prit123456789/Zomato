import { createClient } from '@supabase/supabase-js'

export interface Order {
  id: string;
  restaurantName: string;
  dish: string;
  originalPrice: number;
  discountedPrice: number;
  distance: number;
  description: string;
  image: string;
  restaurantRating: number;
  estimatedDeliveryTime: number;
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function getNearbyDiscountedOrders(lat: number, lon: number): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('canceled_orders')
      .select('*')
      .filter('status', 'eq', 'available')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Filter orders based on distance (simplified)
    return data.filter((order: Order) => {
      const distance = calculateDistance(lat, lon, order.lat, order.lon)
      return distance <= 5 // Within 5 km
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Simplified distance calculation (Haversine formula)
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export async function placeOrder(orderId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({ order_id: orderId, user_id: userId, status: 'placed' })

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error placing order:', error)
    return false
  }
}

