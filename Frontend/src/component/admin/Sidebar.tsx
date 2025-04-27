// src/components/admin/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Products", path: "/admin/products" },
    { label: "Users", path: "/admin/users" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md fixed left-0 top-0 flex flex-col">
      <div className="text-2xl font-bold text-center py-6 border-b">Admin</div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block py-2 px-4 rounded hover:bg-gray-100 ${
              location.pathname === item.path ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
