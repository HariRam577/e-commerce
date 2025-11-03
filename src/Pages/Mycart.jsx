import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../Cart/Cartslice";

const Mycart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const handleRemoveFromCart = (productId) => {
    console.log("clicked", productId);

    dispatch(removeFromCart(productId));
    alert(`Product with id ${productId} removed from cart!`);
  };
  return (
    <div>
      <h3>My Cart</h3>
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
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm sm:text-base">
                    ${product.price}
                  </p>
                  <button
                    onClick={() => handleRemoveFromCart(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Remove
                  </button>
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
        </div>
      )}

      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ShopHub
              </h3>
              <p className="text-gray-400">
                Your trusted online shopping destination
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Shipping
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4 text-sm">
                Subscribe for updates and deals
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Mycart;
