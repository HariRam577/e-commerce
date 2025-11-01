import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [activeLink, setActiveLink] = useState("Home");
  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "User Profile", path: "/user-profile" },
    { name: "My Cart", path: "/my-cart" },
  ];
  return (
    <div className="flex flex-col">
      {navigationLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className="block mb-4 hover:cursor-pointer"
          onClick={() => setActiveLink(link.name)}
          style={{
            fontWeight: activeLink === link.name ? "bold" : "normal",
            textDecoration: activeLink === link.name ? "underline" : "none",
          }}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
