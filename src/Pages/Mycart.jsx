import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Package,
  CreditCard,
} from "lucide-react";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserCart(user.uid);
      } else {
        setCurrentUser(null);
        setCartItems([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserCart = async (userId) => {
    try {
      setLoading(true);
      const cartRef = collection(db, `users/${userId}/cart`);
      const snapshot = await getDocs(cartRef);
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingId(itemId);
    try {
      await updateDoc(
        doc(db, `users/${currentUser.uid}/cart`, String(itemId)),
        { quantity: newQuantity }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          String(item.id) === String(itemId)
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("Remove this item from your cart?")) return;

    setUpdatingId(itemId);
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/cart`, String(itemId)));
      setCartItems((prev) =>
        prev.filter((item) => String(item.id) !== String(itemId))
      );
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? (subtotal >= 50 ? 0 : 5.99) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign in to view cart
            </h2>
            <p className="text-gray-600 mb-8">
              Access your saved items and checkout securely
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 ">
            <button
              onClick={() => navigate("/products")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 "
              aria-label="Back to products"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 text-gray-900 dark:text-gray-100" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 text-gray-900 dark:text-gray-100">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-600 mt-0.5 text-gray-900 dark:text-gray-100">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-3 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Discover our products and add items to get started
            </p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 ">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 relative dark:bg-gray-800"
                >
                  {updatingId === item.id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-3 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 text-gray-900 dark:text-gray-100">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 font-medium text-gray-900 dark:text-gray-100">
                            Qty:
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-lg text-gray-900 dark:text-gray-100">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 || updatingId === item.id
                              }
                              className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-gray-600 text-gray-900 dark:text-gray-100" />
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[3rem] text-center text-gray-900 dark:text-gray-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updatingId === item.id}
                              className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-gray-600 text-gray-900 dark:text-gray-100" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 text-gray-900 dark:text-gray-100">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500 ">
                              ${item.price.toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updatingId === item.id}
                        className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8 dark:bg-gray-800">
                <h2 className="text-lg font-bold text-gray-900 mb-6 text-gray-900 dark:text-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 text-gray-900 dark:text-gray-100">
                    <span>Subtotal</span>
                    <span className="font-semibold ">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-gray-900 dark:text-gray-100">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 ">
                      Free shipping on orders over $50
                    </p>
                  )}
                  <div className="flex justify-between text-gray-600 text-gray-900 dark:text-gray-100">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 ">
                    <div className="flex justify-between text-gray-900 text-gray-900 dark:text-gray-100">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full mt-3 bg-white text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600 text-gray-900 dark:text-gray-100">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Secure checkout powered by Stripe</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Customer support available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCart;
