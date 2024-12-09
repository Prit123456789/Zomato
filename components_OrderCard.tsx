import { Order } from '../services/orderService';
import { useState } from 'react';
import { placeOrder } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isOrdering, setIsOrdering] = useState(false);
  const { user } = useAuth();

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please sign in to place an order');
      return;
    }

    setIsOrdering(true);
    try {
      const success = await placeOrder(order.id, user.id);
      if (success) {
        alert('Order placed successfully!');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      alert('Error placing order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex">
        <img src={order.image} alt={order.dish} className="w-24 h-24 object-cover rounded-md mr-4" />
        <div>
          <h2 className="text-xl font-semibold">{order.restaurantName}</h2>
          <p className="text-gray-600">{order.dish}</p>
          <p className="text-sm text-gray-500 mt-1">{order.description}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{order.restaurantRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-gray-500 line-through">₹{order.originalPrice}</span>
          <span className="text-green-600 font-bold ml-2">₹{order.discountedPrice}</span>
        </div>
        <span className="text-blue-600">{order.distance.toFixed(1)} km away</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-600">Estimated delivery: {order.estimatedDeliveryTime} mins</span>
        <button
          onClick={handlePlaceOrder}
          disabled={isOrdering}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          {isOrdering ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

