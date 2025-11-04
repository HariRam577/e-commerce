import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Info, Package, ShoppingCart } from "lucide-react";

const SideBar = () => {
  const location = useLocation();
  
  const navigationLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Products", path: "/products", icon: Package },
    { name: "My Cart", path: "/my-cart", icon: ShoppingCart },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col space-y-2">
      {navigationLinks.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.path);
        
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              active
                ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;