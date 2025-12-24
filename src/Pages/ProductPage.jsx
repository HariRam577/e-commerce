import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  CheckCircle,
  ShoppingCart,
  ShoppingBag,
  User,
  Star,
} from "lucide-react";
import { auth, db } from "../firebase/config";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import useFetch from "../CustomHook/useFetch";

const ProductPage = () => {
  const { data, loading, error } = useFetch(
    "https://fakestoreapi.com/products"
  );
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserCart(user.uid);
      } else {
        setCartItems([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserCart = async (userId) => {
    try {
      const cartRef = collection(db, `users/${userId}/cart`);
      const snapshot = await getDocs(cartRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleAddToCart = async (product) => {
    if (!currentUser) {
      alert("Please sign in to add items to cart");
      navigate("/login");
      return;
    }

    const isExist = cartItems.some((item) => item.id === product.id);
    if (isExist) {
      alert("Product already in cart");
      return;
    }

    try {
      await setDoc(
        doc(db, `users/${currentUser.uid}/cart`, product.id.toString()),
        {
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString(),
        }
      );

      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
      setAddedProduct(product);
      setShowModal(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart");
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Our Products
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Discover our curated collection
              </p>
            </div>
            {/* 
            <div className="flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="hidden sm:inline">
                    {currentUser.email.split("@")[0]}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => navigate("/my-cart")}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-3 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading products...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
            <p className="font-semibold">Error loading products</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((product) => {
              const isInCart = cartItems.some((item) => item.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 p-6">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.rating && (
                      <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {product.rating.rate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 min-h-[3rem]">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Actions */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          ${product.price}
                        </span>
                        {product.rating && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {product.rating.count} reviews
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBuyNow(product)}
                          className="flex-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-2.5 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 text-sm font-semibold"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isInCart}
                          className={`px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            isInCart
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                              : "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
                          }`}
                          title={isInCart ? "Already in cart" : "Add to cart"}
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showModal && addedProduct && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Added to Cart
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cartItems.length}{" "}
                      {cartItems.length === 1 ? "item" : "items"} in cart
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-lg flex-shrink-0 p-2">
                  <img
                    src={addedProduct.image}
                    alt={addedProduct.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                    {addedProduct.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Quantity: 1
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ${addedProduct.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate("/my-cart");
                }}
                className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
