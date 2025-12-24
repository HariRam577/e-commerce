import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../Cart/Cartslice"; // Update this path
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const reduxCartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  // Local state for checkout items (can be modified without affecting Redux cart)
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [useLocation, setUseLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

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
  const navigate = useNavigate();

  // Initialize checkout items from Redux cart
  useEffect(() => {
    setCheckoutItems(reduxCartItems);
  }, [reduxCartItems]);

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setOrderResponse(null), 300);
  };

  /* ================================
     🔁 Reverse Geocoding Function
     ================================ */
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
        fullAddress: data.display_name,
      };
    } catch (error) {
      console.error("Reverse geocoding failed", error);
      return null;
    }
  };

  /* ================================
     📍 Get Current Location
     ================================ */
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
          setAddress((prev) => ({
            ...prev,
            street: fetchedAddress.street,
            city: fetchedAddress.city,
            state: fetchedAddress.state,
            pincode: fetchedAddress.pincode,
          }));
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

  /* ================================
     ✏️ Manual Input Change
     ================================ */
  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  /* ================================
     ❌ Remove Item from Checkout (NOT from Redux cart)
     ================================ */
  const handleRemoveFromCheckout = (id) => {
    // Only remove from local checkout state
    const updatedCheckout = checkoutItems.filter((item) => item.id !== id);
    setCheckoutItems(updatedCheckout);
  };

  /* ================================
     🧮 Order Total
     ================================ */
  const totalAmount = checkoutItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  /* ================================
     🛒 Place Order
     ================================ */
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
      items: checkoutItems, // Use checkout items
      address,
      total: totalAmount,
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
          body: JSON.stringify({ order, email: address.email }),
        }
      );

      const data = await res.json();

      setOrderResponse({
        success: data.success,
        message: data.success
          ? "Order placed & confirmation mail sent 📧"
          : "Order placed but mail failed ❌",
        order,
      });

      setShowModal(true);

      // ✅ NOW remove ordered items from Redux cart ONLY on success
      if (data.success) {
        order.items.forEach((item) => {
          dispatch(removeFromCart(item.id));
        });
      }
    } catch (error) {
      setOrderResponse({
        success: false,
        message: "Server error while sending mail ❌",
        order,
      });
      setShowModal(true);
    } finally {
      setPlacingOrder(false);
    }

    // Save order locally
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= Address Section ================= */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Delivery Address
          </h2>

          {/* Use Location */}
          <button
            onClick={handleGetLocation}
            className="w-full mb-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            {loadingLocation ? "Fetching Location..." : "Use Current Location"}
          </button>

          {useLocation && (
            <div className="mb-6 bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg text-sm">
              <MapPin className="inline w-4 h-4 mr-2 text-indigo-600" />
              <span className="font-semibold">Detected Address:</span>
              <p className="mt-1">
                {address.street}, {address.city}, {address.state} -{" "}
                {address.pincode}
              </p>
            </div>
          )}

          <div className="text-center my-4 text-gray-500 font-medium">OR</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center border rounded-lg px-3">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <input
                name="name"
                placeholder="Full Name"
                value={address.name}
                onChange={handleInputChange}
                className="w-full py-2 outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center border rounded-lg px-3">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <input
                name="phone"
                placeholder="Mobile Number"
                value={address.phone}
                onChange={handleInputChange}
                className="w-full py-2 outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center border rounded-lg px-3 md:col-span-2">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <input
                name="email"
                placeholder="Email Address"
                value={address.email}
                onChange={handleInputChange}
                className="w-full py-2 outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center border rounded-lg px-3 md:col-span-2">
              <Home className="w-4 h-4 text-gray-400 mr-2" />
              <input
                name="street"
                placeholder="Street Address"
                value={address.street}
                onChange={handleInputChange}
                className="w-full py-2 outline-none bg-transparent"
              />
            </div>

            <input
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />
          </div>
        </div>

        {/* ================= Order Summary ================= */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {checkoutItems.length === 0 && (
            <p className="text-center text-gray-500">Cart is empty</p>
          )}

          {checkoutItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2 text-sm border-b py-2"
            >
              <div>
                {item.title} × {item.quantity || 1} - ${item.price.toFixed(2)}
              </div>
              <button
                onClick={() => handleRemoveFromCheckout(item.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                title="Remove from checkout only"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold flex justify-center items-center gap-2"
            disabled={placingOrder || checkoutItems.length === 0}
          >
            {placingOrder && <Loader2 className="animate-spin w-5 h-5" />}
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* ================= Order Modal ================= */}
      {showModal && orderResponse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform animate-slideUp">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Order Confirmed
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-4">{orderResponse.message}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order ID:{" "}
                <span className="font-mono font-semibold">
                  {orderResponse.order.id}
                </span>
              </p>
              <p className="text-sm mt-2">
                Thank you for shopping at Shophub 🛒
              </p>
            </div>

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

      {/* ================= Styles ================= */}
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

export default Checkout;
