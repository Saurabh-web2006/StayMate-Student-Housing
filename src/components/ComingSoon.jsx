import "./ComingSoon.css";
import Sidebar from "./Sidebar";


/* ============================
   PAGE CONFIG
============================ */

const PAGE_CONFIG = {

  bookings: {
    title: "My Bookings",
    icon: "📋",
    heading: "Bookings",
    description:
      "Track all your PG bookings, view payment history, and manage your reservations — all in one place.",
    features: [
      { icon: "🏠", label: "Booking History" },
      { icon: "💳", label: "Payment Tracking" },
      { icon: "📅", label: "Check-in Dates" },
      { icon: "⭐", label: "Rate Your Stay" }
    ],
    progress: 65
  },

  notifications: {
    title: "Notifications",
    icon: "🔔",
    heading: "Notifications",
    description:
      "Stay updated with real-time alerts on bookings, messages, price drops, and new PG listings near you.",
    features: [
      { icon: "📩", label: "Booking Alerts" },
      { icon: "💬", label: "Message Alerts" },
      { icon: "📉", label: "Price Drops" },
      { icon: "🆕", label: "New Listings" }
    ],
    progress: 50
  },

  profile: {
    title: "Profile",
    icon: "👤",
    heading: "Profile",
    description:
      "Manage your personal info, preferences, and verification status to help PG owners know you better.",
    features: [
      { icon: "📝", label: "Edit Info" },
      { icon: "✅", label: "Verification" },
      { icon: "🎓", label: "College Details" },
      { icon: "🔒", label: "Privacy Settings" }
    ],
    progress: 40
  },

  settings: {
    title: "Settings",
    icon: "⚙️",
    heading: "Settings",
    description:
      "Customize your StayMate experience — from notification preferences to theme and account security.",
    features: [
      { icon: "🌙", label: "Theme Options" },
      { icon: "🔐", label: "Account Security" },
      { icon: "🌐", label: "Language" },
      { icon: "📱", label: "Notifications" }
    ],
    progress: 35
  }

};


/* ============================
   COMPONENT
============================ */

function ComingSoon({
  pageKey = "bookings",
  userName = "Sanyam",
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

  const config = PAGE_CONFIG[pageKey] || PAGE_CONFIG.bookings;


  return (

    <div className="coming-soon-page">


      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar

        activePage={pageKey}

        onHome={onHome}

        onFindPGs={onFindPGs}

        onRoommates={onRoommates}

        onSaved={onSaved}

        onBookings={onBookings}

        onMessages={onMessages}

        onNotifications={onNotifications}

        onProfile={onProfile}

        onSettings={onSettings}

        onLogout={onLogout}

      />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="coming-soon-main">


        {/* TOP BAR */}

        <header className="coming-soon-topbar">

          <span className="page-title">
            {config.title}
          </span>

          <div className="user-area">

            <div className="user-avatar">
              {userName.charAt(0)}
            </div>

            <span>
              {userName}
            </span>

          </div>

        </header>


        {/* COMING SOON CONTENT */}

        <div className="coming-soon-content">


          {/* ANIMATED ICON */}

          <div className="coming-soon-icon-container">

            <div className="coming-soon-icon-ring"></div>

            <div className="coming-soon-icon-circle">
              <span className="icon-emoji">
                {config.icon}
              </span>
            </div>

          </div>


          {/* BADGE */}

          <span className="coming-soon-badge">
            Coming Soon
          </span>


          {/* HEADING */}

          <h1>
            <span className="highlight">
              {config.heading}
            </span>{" "}
            is on the way
          </h1>


          {/* DESCRIPTION */}

          <p className="coming-soon-description">
            {config.description}
          </p>


          {/* FEATURE PILLS */}

          <div className="coming-soon-features">
            {config.features.map((feat, idx) => (

              <div
                className="feature-pill"
                key={idx}
              >
                <span className="pill-icon">
                  {feat.icon}
                </span>
                {feat.label}
              </div>

            ))}
          </div>


          {/* BACK BUTTON */}

          <button
            className="coming-soon-back-btn"
            onClick={onHome}
          >
            ← Back to Home
          </button>


          {/* PROGRESS BAR */}

          <div className="coming-soon-progress">

            <div className="progress-label">
              <span>Development Progress</span>
              <span>{config.progress}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${config.progress}%`
                }}
              ></div>
            </div>

          </div>


        </div>

      </main>

    </div>
  );
}


export default ComingSoon;
