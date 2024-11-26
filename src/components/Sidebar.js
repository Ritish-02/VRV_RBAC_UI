import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/roles">Roles</Link>
        </li>
        <li>
          <Link to="/permissions">Permissions</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
