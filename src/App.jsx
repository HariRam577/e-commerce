import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appcontents from "./Menu/Appcontents";
import AboutPage from "./Pages/AboutPage";
import ProductPage from "./Pages/ProductPage";
import Login from "./Auth/Login";
import { Provider } from "react-redux";
import { Cartstore } from "./Cart/Cartstore";
import Mycart from "./Pages/Mycart";
import ThemeProvider from "./ContextApi/ThemeContext";
import Dashboard from "./Pages/Dashboard";
import ProductDetail from "./Pages/ProductDetail";
import Checkout from "./Pages/Checkout";
import MyOrders from "./Pages/MyOrders";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue === "true" ? true : false;
  });

  return (
    <ThemeProvider>
      <Provider store={Cartstore}>
        <BrowserRouter>
          <Routes>
            {/* Layout route */}
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Appcontents setIsLoggedIn={setIsLoggedIn} />
                ) : (
                  <Login setIsLoggedIn={setIsLoggedIn} />
                )
              }
            >
              {/* Nested routes inside layout */}
              <Route index element={<Dashboard />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="my-cart" element={<Mycart />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
