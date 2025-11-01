import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appcontents from "./Menu/Appcontents";
import AboutPage from "./Pages/AboutPage";
import ProductPage from "./Pages/ProductPage";
import UserProfile from "./Pages/UserProfile";
import Login from "./Auth/Login";
import { Provider } from "react-redux";
import { Cartstore } from "./Cart/Cartstore";
import Mycart from "./Pages/Mycart";
import ThemeProvider from "./ContextApi/ThemeContext";

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
              <Route index element={<h2>Welcome Home!</h2>} />
              <Route path="about" element={<AboutPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="user-profile" element={<UserProfile />} />
              <Route path="my-cart" element={<Mycart />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
