// src/components/admin/Topbar.tsx
import React from "react";

const Topbar: React.FC = () => {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-end px-6 fixed left-64 right-0 top-0">
      <div className="flex items-center space-x-4">
        <span className="font-medium">Admin</span>
        <img
          src="/assets/default-profile.png"
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Topbar;
