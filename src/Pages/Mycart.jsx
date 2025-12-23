import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, AlertTriangle, Trash2, ShoppingBag } from "lucide-react";
import { removeFromCart } from "../Cart/Cartslice";
import { useNavigate } from "react-router-dom";

const Mycart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [removedProduct, setRemovedProduct] = useState(null);
  const navigate = useNavigate();

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product.id));
    setRemovedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setRemovedProduct(null), 300);
  };
  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate("/checkout");
  };
  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">My Cart</h3>
        {cartItems.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Total: ${totalPrice.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6">
          {cartItems.map((product) => (
            <div
              key={product.id}
              className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative w-full h-56 sm:h-64 overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  {product.title ? product.title : product.name}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                  {product.description
                    ? product.description.length > 130
                      ? `${product.description.slice(0, 130)}...`
                      : product.description
                    : ""}
                </p>

                {/* Price + Remove button */}
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
                      onClick={() => handleRemoveFromCart(product)}
                      className="bg-red-500 hover:bg-red-600 active:scale-95 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-svg-download-png-1800917.png"
            alt="Cart Empty"
            className="w-64 sm:w-80 md:w-96 mb-6"
          />
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Your cart is empty!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
            Add some products to see them here.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </button>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showModal && removedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform animate-slideUp">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Removed from Cart
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
                    src={removedProduct.image}
                    alt={removedProduct.title}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {removedProduct.title || removedProduct.name}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 font-bold text-lg">
                    ${removedProduct.price}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    This item has been removed from your cart.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate("/products");
                }}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
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
    </div>
  );
};

export default Mycart;
