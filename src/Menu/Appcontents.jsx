import React, { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { Sun, MoonStar, LogOut, Menu, X } from "lucide-react";
import { ThemeContext } from "../ContextApi/ThemeContext";

const Appcontents = ({ setIsLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 shadow-lg">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <h1 className="theme-pill text-xl sm:text-2xl font-bold tracking-wide rounded-full bg-white-500 text-white p-2">
          HR
        </h1>

        <div className="flex items-center gap-3 sm:gap-6">
          {theme === "light" ? (
            <Sun
              className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 cursor-pointer"
              onClick={toggleTheme}
            />
          ) : (
            <MoonStar
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 cursor-pointer"
              onClick={toggleTheme}
            />
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-all duration-300 cursor-pointer 
             bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 
             dark:bg-gray-900/30 dark:border-white/30 dark:text-white dark:hover:bg-white/20
             text-sm sm:text-base"
          >
            <LogOut className="inline w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-64 p-4 sm:p-6 flex flex-col shadow-lg
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            bg-white dark:bg-gray-900
          `}
        >
          <div className="flex justify-between items-center mb-6 lg:block">
            <h2 className="text-base sm:text-lg font-semibold border-b border-gray-700 pb-3">
              Navigation
            </h2>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <SideBar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto rounded-tl-3xl shadow-inner">
          <div className="rounded-2xl shadow-md p-3 sm:p-4 md:p-6 min-h-[87vh] border border-gray-200">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Appcontents;