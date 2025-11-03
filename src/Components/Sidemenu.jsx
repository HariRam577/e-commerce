import React from "react";
import SideBar from "../Menu/SideBar";
import { X } from "lucide-react";

const Sidemenu = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen lg:h-auto w-64 sm:w-72 
          bg-white dark:bg-gray-900 text-black dark:text-white 
          flex flex-col shadow-lg shadow-gray-300 dark:shadow-gray-900 
          border-r border-gray-200 dark:border-gray-800 
          transform transition-transform duration-300 ease-in-out
          z-30 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 lg:mb-4 p-4 lg:p-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-3 flex-1">
            Navigation
          </h2>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ml-2"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        {/* Scrollable menu */}
        <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <SideBar />
        </nav>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          © {new Date().getFullYear()} ShopHub
        </div>
      </aside>
    </>
  );
};

export default Sidemenu;