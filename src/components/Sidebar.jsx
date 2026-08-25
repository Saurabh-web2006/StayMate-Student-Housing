import { useState, useEffect } from "react";
import "./Sidebar.css";
import logo from "../assets/logo.png";

function Sidebar({
  activePage,
  onHome,
  onFindPGs,
  onRoommates,
  onSaved,
  onBookings,
  onMessages,
  onNotifications,
  onProfile,
  onSettings,
  onLogout
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
  const stored = localStorage.getItem("sidebarCollapsed");
  return stored ? JSON.parse(stored) : false;
});
 
  return (
    <aside
      className={`home-sidebar ${
        isCollapsed ? "collapsed" : ""
      }`} 
    >



      <div className="home-logo">

        <img
          src={logo}
          alt="StayMate"
        />

        <span>
          Stay<span>Mate</span>
        </span>

      </div>




      <button
        className="sidebar-toggle"
        onClick={() => {
          const newState = !isCollapsed;
          setIsCollapsed(newState);
          localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
        }}
        type="button"
        aria-label={
          isCollapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
      >
        <span className="toggle-arrow">
          {isCollapsed ? "›" : "‹"}
        </span>
      </button>




      <div className="sidebar-menu">


        <button
          className={`sidebar-item ${
            activePage === "home"
              ? "active"
              : ""
          }`}
          onClick={onHome}
          type="button"
        >
          <span>🏠</span>
          <label>Home</label>
        </button>


        <button
          className={`sidebar-item ${
            activePage === "find"
              ? "active"
              : ""
          }`}
          onClick={onFindPGs}
          type="button"
        >
          <span>🔍</span>
          <label>Find PGs</label>
        </button>




        <button
          className={`sidebar-item ${
            activePage === "roommates"
              ? "active"
              : ""
          }`}
          onClick={onRoommates}
          type="button"
        >
          <span>👥</span>
          <label>Roommates</label>
        </button>



        <button
          className={`sidebar-item ${
            activePage === "saved"
              ? "active"
              : ""
          }`}
          onClick={onSaved}
          type="button"
        >
          <span>♡</span>
          <label>Saved</label>
        </button>



        <button
          className={`sidebar-item ${
            activePage === "bookings"
              ? "active"
              : ""
          }`}
          onClick={onBookings}
          type="button"
        >
          <span>📋</span>
          <label>My Bookings</label>
        </button>



        <button
          className={`sidebar-item ${
            activePage === "messages"
              ? "active"
              : ""
          }`}
          onClick={onMessages}
          type="button"
        >
          <span>💬</span>
          <label>Messages</label>
        </button>



        <button
          className={`sidebar-item ${
            activePage === "notifications"
              ? "active"
              : ""
          }`}
          onClick={onNotifications}
          type="button"
        >
          <span>🔔</span>
          <label>Notifications</label>
        </button>


        

        <button
          className={`sidebar-item ${
            activePage === "profile"
              ? "active"
              : ""
          }`}
          onClick={onProfile}
          type="button"
        >
          <span>👤</span>
          <label>Profile</label>
        </button>


        

        <button
          className={`sidebar-item ${
            activePage === "settings"
              ? "active"
              : ""
          }`}
          onClick={onSettings}
          type="button"
        >
          <span>⚙</span>
          <label>Settings</label>
        </button>

      </div>


    

      <button
        className="sidebar-logout"
        onClick={onLogout}
        type="button"
      >
        <span className="logout-icon">
          🚪
        </span>

        <label>
          Logout
        </label>
      </button>

    </aside>
  );
}

export default Sidebar;