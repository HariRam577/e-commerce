import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { Sun, MoonStar, LogOut } from "lucide-react";
import { ThemeContext } from "../ContextApi/ThemeContext";

const Appcontents = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/");
  };
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="flex flex-col h-screen ">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4  shadow-lg">
        <h1 className="theme-pill text-2xl font-bold tracking-wide rounded-full bg-white-500 text-white p-2 ">
          HR
        </h1>
        <div className="flex items-center gap-6 ">
          {theme === "light" ? (
            <Sun
              className="w-6 h-6 text-yellow-400 cursor-pointer"
              onClick={toggleTheme}
            />
          ) : (
            <MoonStar
              className="w-6 h-6 text-gray-300 cursor-pointer"
              onClick={toggleTheme}
            />
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer 
             bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 
             dark:bg-gray-900/30 dark:border-white/30 dark:text-white dark:hover:bg-white/20"
          >
            <LogOut className="inline w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64  p-6 flex flex-col shadow-lg">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-3">
            Navigation
          </h2>
          <SideBar />
        </aside>

        {/* Main Content */}
        <main className="flex-1  p-2  overflow-y-auto rounded-tl-3xl shadow-inner">
          <div className="rounded-2xl shadow-md p-6 min-h-[87vh] border border-gray-200">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Appcontents;
