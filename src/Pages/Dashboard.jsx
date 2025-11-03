import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  TrendingUp,
  Zap,
  Package,
  ArrowRight,
  Search,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Cart/Cartslice";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const categories = [
    { id: "all", name: "All Products", icon: Package },
    { id: "trending", name: "Trending", icon: TrendingUp },
    { id: "deals", name: "Hot Deals", icon: Zap },
  ];

  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 234,
      badge: "Trending",
      category: "trending",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 449.99,
      originalPrice: 599.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 456,
      badge: "Hot Deal",
      category: "deals",
    },
    {
      id: 3,
      name: "Laptop Backpack",
      price: 79.99,
      originalPrice: 129.99,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 189,
      badge: "Best Seller",
      category: "all",
    },
    {
      id: 4,
      name: "Minimalist Sneakers",
      price: 129.99,
      originalPrice: 179.99,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 312,
      badge: "New",
      category: "trending",
    },
    {
      id: 5,
      name: "Designer Sunglasses",
      price: 199.99,
      originalPrice: 299.99,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 156,
      badge: "Hot Deal",
      category: "deals",
    },
    {
      id: 6,
      name: "Portable Speaker",
      price: 89.99,
      originalPrice: 149.99,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 278,
      badge: "Trending",
      category: "trending",
    },
  ];

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCartList = (product) => {
    dispatch(addToCart(product));
    alert(`${product.name} added to cart!`);
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-theme text-black dark:bg-theme-dark dark:text-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-theme text-black dark:bg-theme-dark dark:text-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Fall Sale 2024
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Up to 50% off on selected items
            </p>
            <button className="bg-theme text-black dark:bg-theme-dark dark:text-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-lg">
              Shop Now <ArrowRight className="inline w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-theme text-black dark:bg-theme-dark dark:text-white">
        <div className="bg-theme text-black dark:bg-theme-dark dark:text-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition whitespace-nowrap ${
                      activeCategory === category.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-theme text-black dark:bg-theme-dark dark:text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.badge}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-theme text-black dark:bg-theme-dark dark:text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlist.includes(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold  mb-2 line-clamp-1">
                  {product.name}
                </h3>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </div>

                <button
                  onClick={() => addToCartList(product)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
