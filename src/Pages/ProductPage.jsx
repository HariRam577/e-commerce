import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, CheckCircle, ShoppingCart } from "lucide-react";
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
  const navigate = useNavigate()

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setAddedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setAddedProduct(null), 300);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Products</h3>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          Error loading products: {error.message}
        </div>
      )}

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
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {product.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {product.description.length > 130
                  ? `${product.description.slice(0, 130)}...`
                  : product.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                  ${product.price}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Modal */}
      {showModal && addedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform animate-slideUp">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Added to Cart!
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Product Details */}
            <div className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={addedProduct.image}
                    alt={addedProduct.title}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {addedProduct.title}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    ${addedProduct.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate("/my-cart");
                }}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductPage;