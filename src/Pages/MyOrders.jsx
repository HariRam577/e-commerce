import React, { useEffect, useState } from "react";
import { PackageCheck, Truck, Clock } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const getStatusIcon = (status) => {
    if (status === "Delivered")
      return <PackageCheck className="text-green-600" />;
    if (status === "Confirmed") return <Truck className="text-blue-600" />;
    return <Clock className="text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">Order ID: #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Items */}
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span>
                      {item.title} × {item.quantity || 1}
                    </span>
                    <span>
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>

                {/* Address */}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold">Delivery Address</p>
                  <p>
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.state} - {order.address.pincode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
