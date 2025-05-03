import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getRestaurantById } from '../services/restaurantService';
import {
  addToFavorites,
  removeFromFavorites,
  getFavoriteRestaurants
} from '../services/favoriteService';
import { useCart } from '../context/CartContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantById(id);
        setRestaurant(data);

        if (data.menu && data.menu.length > 0) {
          const categories = [...new Set(data.menu.map(item => item.category))];
          if (categories.length > 0) {
            setActiveCategory(categories[0]);
          }
        }
      } catch (err) {
        setError('Failed to load restaurant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoriteStatus = async () => {
      try {
        const response = await getFavoriteRestaurants();
        const favorites = response.favoriteRestaurants || [];
        console.log('Favorites Response:', favorites);
        setIsFavorite(favorites.some(fav => fav === id));
      } catch (error) {
        console.error('Failed to fetch favorites', error);
        setIsFavorite(false); 
      }
    };

    fetchRestaurant();
    fetchFavoriteStatus();
  }, [id]);

  const handleAddToCart = (menuItem) => {
    addToCart(menuItem, restaurant);
    toast.success(`Added ${menuItem.name} to cart!`);
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(restaurant._id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(restaurant._id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const getMenuCategories = () => {
    if (!restaurant || !restaurant.menu) return [];
    return [...new Set(restaurant.menu.map(item => item.category))];
  };

  const getMenuItemsByCategory = (category) => {
    if (!restaurant || !restaurant.menu) return [];
    return restaurant.menu.filter(item => item.category === category);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-xl">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Restaurant Hero */}
      <div className="relative">
        <div className="h-64 sm:h-80 w-full">
          <img
            src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
                <p className="text-white text-lg">{restaurant.cuisine}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(Math.floor(restaurant.rating || 4))].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-white">{restaurant.rating || "4.5"}</span>
                  </div>
                  <span className="mx-2 text-white">•</span>
                  <span className="text-white">{restaurant.isAvailable !== false ? "Open Now" : "Closed"}</span>
                </div>
              </motion.div>
              
              <motion.button
                onClick={toggleFavorite}
                className="p-2 rounded-full bg-white text-red-500 shadow-md focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex space-x-4 mb-8">
          {getMenuCategories().map((category) => (
            <button
              key={category}
              className={`text-xl ${category === activeCategory ? 'text-indigo-500' : 'text-gray-700'}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {getMenuItemsByCategory(activeCategory).map((item) => (
            <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-xl">{item.name}</h3>
                <p className="text-gray-500">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-lg">${item.price}</span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
