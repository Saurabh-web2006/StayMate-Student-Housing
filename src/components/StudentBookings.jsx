import Sidebar from "./Sidebar";
import "./StudentBookings.css";

function StudentBookings({
  userName,
  bookings,
  error,
  onHome,
  onFindPGs,
  onRoommates,
  onSaved,
  onBookings,
  onMessages,
  onNotifications,
  onProfile,
  onSettings,
  onLogout,
}) {
  return (
    <div className="student-bookings-page">
      <Sidebar
        activePage="bookings"
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

      <main className="student-bookings-main">
        <header className="student-bookings-topbar">
          <div>
            <span className="student-bookings-title">My Bookings</span>
            <span className="student-bookings-subtitle">Your stay requests in one place</span>
          </div>
          <button className="student-bookings-user" onClick={onProfile} type="button" title="View Profile" aria-label={`Open profile for ${userName}`}>
            <span className="student-bookings-avatar">{userName.charAt(0).toUpperCase()}</span>
            {userName}
          </button>
        </header>

        <div className="student-bookings-content">
          <section className="student-bookings-intro">
            <p className="student-bookings-eyebrow">YOUR STAYS</p>
            <h1>Booking requests</h1>
            <p>Track the places you’ve requested to book and their current status.</p>
          </section>

          <div className="student-bookings-count">
            <span>Requests</span>
            <strong>{bookings.length}</strong>
          </div>

          {error && <div className="student-bookings-error" role="alert">{error}</div>}

          {bookings.length ? (
            <div className="student-bookings-list">
              {bookings.map((booking) => (
                <article className="student-booking-card" key={booking.id}>
                  <img className="student-booking-image" src={booking.image} alt={booking.name} />
                  <div className="student-booking-info">
                    <span className="student-booking-type">{booking.type}</span>
                    <h2>{booking.name}</h2>
                    <p className="student-booking-location">📍 {booking.location}</p>
                    <p className="student-booking-date">
                      Requested {new Date(booking.requestedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="student-booking-summary">
                    <strong>₹{Number(booking.price).toLocaleString("en-IN")}<span>/month</span></strong>
                    <span className={`student-booking-status ${booking.status || "pending"}`}><span /> {(booking.status || "pending").replace(/^./, (letter) => letter.toUpperCase())}</span>
                    <span className="student-booking-room">{booking.room} room</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <section className="student-bookings-empty">
              <div className="student-bookings-empty-icon">⌂</div>
              <h2>No booking requests yet</h2>
              <p>When you request to book a stay, it will appear here so you can keep track of it.</p>
              <button type="button" onClick={onFindPGs}>Explore available stays <span>→</span></button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentBookings;
