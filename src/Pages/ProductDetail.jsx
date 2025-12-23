import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ShoppingCart, ShoppingBag } from "lucide-react";
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        {/* Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg">
          {/* Image */}
          <div className="rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[420px] object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {product.title}
            </h1>

            <p className="text-indigo-600 dark:text-indigo-400 text-3xl font-bold mb-4">
              ${product.price}
            </p>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Quantity:
              </span>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                -
              </button>
              <span className="font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                +
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
