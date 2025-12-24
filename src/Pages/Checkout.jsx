import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../Cart/Cartslice";
import { auth } from "../firebase/config";
import {
  MapPin,
  Navigation,
  Home,
  Phone,
  User,
  CheckCircle,
  X,
  ShoppingBag,
  Loader2,
  Trash2,
  Mail,
  Package,
  CreditCard,
  Truck,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const reduxCartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [useLocation, setUseLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setAddress((prev) => ({
          ...prev,
          email: user.email || prev.email,
          name: user.displayName || prev.name,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCheckoutItems(reduxCartItems);
  }, [reduxCartItems]);

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setOrderResponse(null), 300);
  };

  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return {
        street: data.address.road || data.address.neighbourhood || "",
        city:
          data.address.city || data.address.town || data.address.village || "",
        state: data.address.state || "",
        pincode: data.address.postcode || "",
      };
    } catch (error) {
      return null;
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const fetchedAddress = await fetchAddressFromCoords(lat, lng);
        if (fetchedAddress) {
          setAddress((prev) => ({ ...prev, ...fetchedAddress }));
          setUseLocation(true);
        }
        setLoadingLocation(false);
      },
      () => {
        alert("Unable to fetch location");
        setLoadingLocation(false);
      }
    );
  };

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleRemoveFromCheckout = (id) => {
    setCheckoutItems(checkoutItems.filter((item) => item.id !== id));
  };

  const totalAmount = checkoutItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shippingCost = totalAmount > 100 ? 0 : 9.99;
  const tax = totalAmount * 0.1;
  const finalTotal = totalAmount + shippingCost + tax;

  const handlePlaceOrder = async () => {
    if (
      !address.name ||
      !address.phone ||
      !address.email ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }
    if (checkoutItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const order = {
      id: Date.now(),
      userId: currentUser?.uid || "guest",
      userEmail: currentUser?.email || address.email,
      userName: currentUser?.displayName || address.name,
      items: checkoutItems,
      address,
      subtotal: totalAmount,
      shipping: shippingCost,
      tax: tax,
      total: finalTotal,
      status: "Order Placed",
      date: new Date().toLocaleString(),
    };

    setPlacingOrder(true);
    try {
      const res = await fetch(
        "https://e-commerce-express-psi.vercel.app/place-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order,
            email: address.email,
            userId: currentUser?.uid || "guest",
            userName: currentUser?.displayName || address.name,
          }),
        }
      );

      const data = await res.json();
      setOrderResponse({
        success: data.success,
        message: data.success
          ? "Order confirmed! Check your email."
          : "Order placed but email failed.",
        order,
      });
      setShowModal(true);

      if (data.success) {
        order.items.forEach((item) => dispatch(removeFromCart(item.id)));
      }
    } catch (error) {
      setOrderResponse({
        success: false,
        message: "Unable to process order.",
        order,
      });
      setShowModal(true);
    } finally {
      setPlacingOrder(false);
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Address Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Truck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Delivery Address
                </h2>
              </div>

              {currentUser && (
                <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">
                      Logged in as: {currentUser.email}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleGetLocation}
                disabled={loadingLocation}
                className="w-full mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 font-semibold shadow-lg transition-all disabled:opacity-50"
              >
                {loadingLocation ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5" />
                    Use Current Location
                  </>
                )}
              </button>

              {useLocation && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300 mb-1">
                        Location Detected
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {address.street}, {address.city}, {address.state} -{" "}
                        {address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                    Or enter manually
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      name="name"
                      placeholder="John Doe"
                      value={address.name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="phone"
                      placeholder="+1 234 567 8900"
                      value={address.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="email"
                      value={address.email}
                      disabled="true"
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Street *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="street"
                      value={address.street}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <input
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleInputChange}
                  className="px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleInputChange}
                  className="px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                  className="md:col-span-2 px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your information is secure
                </p>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Order Items ({checkoutItems.length})
                </h2>
              </div>
              {checkoutItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {checkoutItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-contain rounded-lg bg-white dark:bg-gray-800"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Qty: {item.quantity || 1}
                        </p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCheckout(item.id)}
                        className="p-2 h-fit hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Summary
                </h2>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        FREE
                      </span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                {totalAmount < 100 && totalAmount > 0 && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Add ${(100 - totalAmount).toFixed(2)} for FREE shipping
                    </p>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                    <span>Total</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || checkoutItems.length === 0}
                className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                  placingOrder || checkoutItems.length === 0
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white hover:shadow-xl hover:scale-[1.02]"
                }`}
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && orderResponse && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-full">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Order Confirmed!
                    </h2>
                    <p className="text-green-100 text-sm">
                      Thank you for shopping
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Order ID
                </p>
                <p className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">
                  #{orderResponse.order.id}
                </p>
              </div>
              <div
                className={`p-4 rounded-xl border ${
                  orderResponse.success
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                }`}
              >
                <p
                  className={`text-sm ${
                    orderResponse.success
                      ? "text-green-700 dark:text-green-300"
                      : "text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {orderResponse.message}
                </p>
              </div>
              {currentUser && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>Sent to {currentUser.email}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate("/products");
                }}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
