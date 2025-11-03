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


    </div>
  );
};

export default Mycart;
