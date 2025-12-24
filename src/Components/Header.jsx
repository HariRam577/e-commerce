import React, { useContext, useEffect, useState } from "react";
import {
  Menu,
  X,
  MoonStar,
  Sun,
  LogOut,
  ShoppingCart,
  Search,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ContextApi/ThemeContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const Header = ({ isSidebarOpen, toggleSidebar, setIsLoggedIn }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  // Listen for auth state changes and fetch cart
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserCart(currentUser.uid);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user cart from Firebase
  const fetchUserCart = async (userId) => {
    try {
      const cartRef = collection(db, `users/${userId}/cart`);
      const snapshot = await getDocs(cartRef);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCartItems([]);
      if (setIsLoggedIn) {
        setIsLoggedIn(false);
      }
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get first letter of user's name or email
  const getUserInitial = () => {
    if (!user) return "";
    const name = user.displayName || user.email;
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 bg-white dark:bg-gray-800 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 sm:px-6 lg:px-10">
        <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full bg-white dark:bg-gray-800 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 sm:px-6 lg:px-10 py-3 transition-all duration-300">
      {/* Left Section — Menu + Logo */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          )}
        </button>

        {/* Logo / Brand */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white select-none cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          ShopHub
        </h1>
      </div>

      {/* Middle Section — Search Bar (hidden on small screens) */}
      <div className="hidden md:flex items-center w-full max-w-md bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 focus-within:ring-2 ring-indigo-500 dark:ring-indigo-400 transition-all">
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 bg-transparent outline-none px-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
        />
      </div>

      {/* Right Section — Theme Toggle + Cart + User Avatar + Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Sun className="w-5 h-5 text-yellow-600" />
          ) : (
            <MoonStar className="w-5 h-5 text-indigo-400" />
          )}
        </button>

        {/* Cart Button */}
        <button
          onClick={() => navigate("/my-cart")}
          className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 font-semibold w-5 h-5 flex items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-xs shadow-sm">
              {cartItems.length}
            </span>
          )}
        </button>

        {/* User Avatar or Login Button */}
        {user ? (
          <div className="relative group">
            {/* User Avatar Circle */}
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 border-2 border-white/20"
              title={user.displayName || user.email}
            >
              {getUserInitial()}
            </button>

            {/* User Dropdown Tooltip */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg py-2 shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-semibold text-sm">
                    {user.displayName || "User"}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </div>
              </div>
              <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Cart Items</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {cartItems.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Guest user - Login button
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
          >
            Sign In
          </button>
        )}

        {/* Logout Button (Desktop) */}
        {user && (
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline text-sm">Logout</span>
          </button>
        )}

        {/* Mobile Logout Icon (only show if user logged in and sidebar open) */}
        {user && isSidebarOpen && (
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
