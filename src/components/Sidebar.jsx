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
  return (
    <aside className="home-sidebar">

      {/* ================= LOGO ================= */}

      <div className="home-logo">

        <img
          src={logo}
          alt="StayMate"
        />

        <span>
          Stay<span>Mate</span>
        </span>

      </div>


      {/* ================= MENU ================= */}

      <div className="sidebar-menu">

        <button
          className={
            activePage === "home"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onHome}
        >
          <span>⌂</span>
          Home
        </button>


        <button
          className={
            activePage === "find"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onFindPGs}
        >
          <span>⌕</span>
          Find PGs
        </button>


        <button
          className={
            activePage === "roommates"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onRoommates}
        >
          <span>♧</span>
          Roommates
        </button>


        <button
          className={
            activePage === "saved"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onSaved}
        >
          <span>♡</span>
          Saved
        </button>


        <button
          className={
            activePage === "bookings"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onBookings}
        >
          <span>▣</span>
          My Bookings
        </button>


        <button
          className={
            activePage === "messages"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onMessages}
        >
          <span>◌</span>
          Messages
        </button>


        <button
          className={
            activePage === "notifications"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onNotifications}
        >
          <span>♧</span>
          Notifications
        </button>


        <button
          className={
            activePage === "profile"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onProfile}
        >
          <span>◎</span>
          Profile
        </button>


        <button
          className={
            activePage === "settings"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={onSettings}
        >
          <span>⚙</span>
          Settings
        </button>

      </div>


      {/* ================= LOGOUT ================= */}

      <button
        className="sidebar-logout"
        onClick={onLogout}
      >
        ↪
        <span>Logout</span>
      </button>

    </aside>
  );
}

export default Sidebar;