import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom

function Sidebar() {
  // Function to determine the class names based on the isActive parameter
  const getNavLinkClass = ({ isActive }) => {
    return `block py-2.5 px-4 rounded transition duration-200 ${
      isActive ? "bg-slate-700" : "hover:bg-slate-700"
    }`;
  };

  return (
    <div className="sidebar w-64 space-y-6 py-7 px-2 bg-slate-800 fixed inset-y-0">
      <nav className="mt-10">
        {/* Use NavLink instead of Link for active styling */}
        <NavLink
          to="/" // Assuming you want this to link to the homepage
          className={getNavLinkClass} // Use the function to dynamically set the class
        >
          Home
        </NavLink>
        <NavLink
          to="/profile" // Adjust the path as needed
          className={getNavLinkClass} // Use the function to dynamically set the class
        >
          Profile
        </NavLink>
        <NavLink
          to="/wallet" // Adjust the path as needed
          className={getNavLinkClass} // Use the function to dynamically set the class
        >
          Wallet
        </NavLink>
        <NavLink
          to="/settings" // Adjust the path as needed
          className={getNavLinkClass} // Use the function to dynamically set the class
        >
          Settings
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
