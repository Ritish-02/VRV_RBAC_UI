import React from "react";
import "./Navbar.css";

function Navbar({ onSearch }) {
  return (
    <div className="navbar">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-bar"
      />
      <div className="admin-profile">
        <img
          src="https://via.placeholder.com/40"
          alt="Admin Profile"
          className="admin-avatar"
        />
        <span>Admin</span>
      </div>
    </div>
  );
}

export default Navbar;
