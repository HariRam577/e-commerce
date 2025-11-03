import React, { useContext } from "react";
import {
  Menu,
  X,
  MoonStar,
  Sun,
  LogOut,
  ShoppingCart,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeContext } from "../ContextApi/ThemeContext";

const Header = ({ isSidebarOpen, toggleSidebar, setIsLoggedIn }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full bg-theme text-black dark:bg-theme-dark dark:text-white backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm px-4 sm:px-6 lg:px-10 py-3 transition-all duration-300">
      {/* Left Section — Menu + Logo */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 select-none cursor-pointer"
        >
          ShopHub
        </h1>
      </div>

      {/* Middle Section — Search Bar (hidden on small screens) */}
      <div className="hidden md:flex items-center w-1/3 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 focus-within:ring-2 ring-indigo-400 transition-all">
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 bg-transparent outline-none px-3 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
        />
      </div>

      {/* Right Section — Theme Toggle + Cart + Logout */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-110 transition-all"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonStar className="w-5 h-5 text-blue-300" />
          )}
        </button>

        {/* Cart Button */}
        <button
          onClick={() => navigate("/my-cart")}
          className="relative group p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 font-semibold w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
              {cartItems.length}
            </span>
          )}
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
            Cart
          </span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        {/* Mobile Logout Icon */}
        {isSidebarOpen && (
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white hover:scale-105 transition-all"
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
