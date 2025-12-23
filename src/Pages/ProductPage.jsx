// ProductPage.jsx - with working modal and Buy Now
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, CheckCircle, ShoppingCart, ShoppingBag } from "lucide-react";
import { addToCart } from "../Cart/Cartslice";
import useFetch from "../CustomHook/useFetch";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const { data, loading, error } = useFetch(
    "https://fakestoreapi.com/products"
  );
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleAddToCart = (product) => {
    const isExist = cartItems.some((val) => val.id === product.id);
    if (isExist) {
      alert("Product already in Cart");
    } else {
      dispatch(addToCart(product));
      setAddedProduct(product);
      setShowModal(true);
    }
  };

  const handleBuyNow = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setAddedProduct(null), 300);
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Products</h3>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          Error loading products: {error.message}
        </div>
      )}

      {/* Product Grid */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {data.map((product) => (
            <div
              key={product.id}
              className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
                {product.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {product.description.length > 130
                  ? `${product.description.slice(0, 130)}...`
                  : product.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 gap-2">
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                  ${product.price}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-200 flex items-center gap-2 text-sm font-semibold"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 flex items-center gap-1 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Modal */}
      {showModal && addedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slideUp">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Added to Cart
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex gap-4">
              <img
                src={addedProduct.image}
                alt={addedProduct.title}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                  {addedProduct.title}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                  ${addedProduct.price}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate("/my-cart");
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
