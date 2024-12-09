'use client'

import { useState, useEffect } from 'react';
import { getNearbyDiscountedOrders, Order } from '../../services/orderService';
import OrderCard from '../../components/OrderCard';
import SearchFilter from '../../components/SearchFilter';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signIn, signOut, signUp } = useAuth();
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    let geolocationWatchId: number;

    const getLocation = () => {
      if ("geolocation" in navigator) {
        setLoading(true);
        geolocationWatchId = navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            setLocationError(null);
            setLoading(false);
          },
          (error) => {
            console.error('Error getting user location:', error);
            setLocationError(`Unable to get your location: ${error.message}. Using default location.`);
            setUserLocation({ lat: 51.5074, lon: -0.1278 }); // Default to London
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser. Using default location.');
        setUserLocation({ lat: 51.5074, lon: -0.1278 }); // Default to London
        setLoading(false);
      }
    };

    getLocation();

    return () => {
      if (geolocationWatchId) {
        navigator.geolocation.clearWatch(geolocationWatchId);
      }
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchOrders();
    }
  }, [userLocation]);

  const fetchOrders = async () => {
    if (!userLocation) return;
    setLoading(true);
    try {
      const nearbyOrders = await getNearbyDiscountedOrders(userLocation.lat, userLocation.lon);
      setOrders(nearbyOrders);
      setFilteredOrders(nearbyOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch nearby orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = orders.filter(
      (order) =>
        order.dish.toLowerCase().includes(query.toLowerCase()) ||
        order.restaurantName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleFilter = (maxPrice: number, maxDistance: number) => {
    const filtered = orders.filter(
      (order) => order.discountedPrice <= maxPrice && order.distance <= maxDistance
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nearby Discounted Orders</h1>
      {locationError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{locationError}</p>
        </div>
      )}
      {user ? (
        <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded-md mb-4">
          Sign Out
        </button>
      ) : (
        <div className="mb-4">
          <button onClick={() => signIn('user@example.com', 'password')} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
            Sign In
          </button>
          <button onClick={() => signUp('newuser@example.com', 'password')} className="bg-green-500 text-white px-4 py-2 rounded-md">
            Sign Up
          </button>
        </div>
      )}
      <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
      {loading ? (
        <p>Loading nearby orders...</p>
      ) : filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))
      ) : (
        <p>No nearby discounted orders available.</p>
      )}
    </div>
  );
}

