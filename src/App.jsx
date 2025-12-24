import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Cartstore } from "./Cart/Cartstore";
import ThemeProvider from "./ContextApi/ThemeContext";
import { AuthProvider, useAuth } from "./ContextApi/AuthContext";
import Login from "./Auth/Login";
import Appcontents from "./Menu/Appcontents"; // ✅ ADDED MISSING IMPORT
import Dashboard from "./Pages/Dashboard";
import AboutPage from "./Pages/AboutPage";
import ProductPage from "./Pages/ProductPage";
import Mycart from "./Pages/Mycart";
import ProductDetail from "./Pages/ProductDetail";
import Checkout from "./Pages/Checkout";
import MyOrders from "./Pages/MyOrders";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
};

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Layout Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Appcontents /> {/* ✅ Now properly imported */}
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="my-cart" element={<Mycart />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="my-orders" element={<MyOrders />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Provider store={Cartstore}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
