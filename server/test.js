const axios = require("axios");

const API_URL = "https://e-commerce-sooty-xi.vercel.app/server/place-order";

async function testOrder() {
  try {
    const res = await axios.post(API_URL, {
      email: "test@example.com",
      order: {
        id: "ORD12345",
        total: 999,
        status: "Order Placed",
        address: {
          name: "Hari Ram",
          phone: "9876543210",
          street: "12 Gandhi Street",
          city: "Chennai",
          state: "TN",
          pincode: "600001",
        },
        items: [
          { title: "Test Product", price: 499, quantity: 1 },
          { title: "Another Item", price: 250, quantity: 2 },
        ],
      },
    });

    console.log("✅ Success Response:");
    console.log(res.data);
  } catch (err) {
    console.log("❌ Error Response:");

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }
  }
}

testOrder();
