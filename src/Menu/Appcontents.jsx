import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Sidemenu from "../Components/Sidemenu";

const Appcontents = ({ setIsLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setIsLoggedIn={setIsLoggedIn}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidemenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 bg-theme dark:bg-theme-dark text-black dark:text-white p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="rounded-2xl shadow-md p-4 sm:p-6 min-h-[87vh] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Appcontents;
