import React from "react";
import useFetch from "../CustomHook/useFetch";
import { useDispatch } from "react-redux";
import { addToCart } from "../Cart/Cartslice";

const ProductPage = () => {
  const { data, loading, error } = useFetch(
    "https://fakestoreapi.com/products"
  );
  const dispatch = useDispatch();
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.title} added to cart!`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Products</h3>
        </div>
        <div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-300">
            + Add product
          </button>
        </div>
      </div>
      {loading && <p className="">Loading products...</p>}
      {error && <p>Error loading products: {error.message}</p>}
      {data && (
        // Card wise list output
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {data.map((product) => (
            <div
              key={product.id}
              className="flex flex-col border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>

              {/* ✅ Description truncated to 220 characters */}
              <p className=" mb-4">
                {product.description.length > 130
                  ? `${product.description.slice(0, 130)}...`
                  : product.description}
              </p>

              {/* ✅ Price + Add to Cart section fixed at bottom */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                <p className="text-indigo-600 font-bold">${product.price}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 cursor-pointer transition-colors duration-300"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductPage;
