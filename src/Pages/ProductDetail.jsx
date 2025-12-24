import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ShoppingCart,
  ShoppingBag,
  Star,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";
import { addToCart } from "../Cart/Cartslice";
import useFetch from "../CustomHook/useFetch";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const { data, loading, error } = useFetch(
    "https://fakestoreapi.com/products"
  );

  const product =
    data?.find((p) => p.id === Number(id)) || location.state?.product;

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const isExist = cartItems.some((item) => item.id === product.id);
    if (isExist) {
      alert("Product already in Cart");
    } else {
      dispatch(addToCart({ ...product, quantity }));
      navigate("/my-cart");
    }
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Products</span>
        </button>

        {/* Main Product Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 lg:p-10 shadow-xl transition-colors duration-200">
          {/* Product Image Section */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8 flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <img
              src={product.image}
              alt={product.title}
              className="w-full max-w-md h-[400px] object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full capitalize">
                {product.category}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {product.rating.rate} ({product.rating.count})
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                ${product.price}
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                20% OFF
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Quality Assured</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 py-4">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                Quantity:
              </span>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold transition-colors duration-200"
                >
                  −
                </button>
                <span className="px-6 py-2 font-bold text-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Trust Badge */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  100% Secure Checkout
                </span>{" "}
                • SSL Encrypted • Money-back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
