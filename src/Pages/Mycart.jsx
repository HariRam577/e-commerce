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
      {cartItems && (
        // Card wise list output
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {cartItems.map((product) => (
            <div
              key={product.id}
              className="flex flex-col border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2">
                {product.title ? product.title : product.name}
              </h3>

              {/* ✅ Description truncated to 220 characters */}
              <p className="text-gray-700 mb-4">
                {product.description
                  ? product.description.length > 130
                    ? `${product.description.slice(0, 130)}...`
                    : product.description
                  : ""}
              </p>

              {/* ✅ Price + Add to Cart section fixed at bottom */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                <p className="text-indigo-600 font-bold">${product.price}</p>
                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="bg-red-400 text-white py-2 px-4 rounded hover:bg-red-700 cursor-pointer transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mycart;
