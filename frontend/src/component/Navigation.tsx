import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import React from "react";

function Navigation() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = () => {
    // Clear user session data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to login page
    navigate("/login");
  };

  // Check if the token exists in localStorage
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="w-screen absolute top-0 bg-gray-900 z-50">
      <nav className="mx2 md:mx-10 p-4 flex justify-between items-center text-white font-semibold">
        <h1 className="text-2xl">Task Manager</h1>
        <div className="flex gap-4">
          {/* Conditionally render the Logout button */}
          {isLoggedIn && (
            <button
              onClick={handleLogout} // Call handleLogout on button click
              className="text-lg px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
