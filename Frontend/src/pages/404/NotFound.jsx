import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
      <p className="text-gray-600 mb-6">
        Your visited page not found. You may go to the home page.
      </p>
      <Link to="/">
        <button className="px-6 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition-all">
          Back to home page
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
s