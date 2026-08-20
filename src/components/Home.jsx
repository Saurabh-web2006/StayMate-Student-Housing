import "./Home.css";
import { useState } from "react";
import PGDetails from "./PGDetails";

import logo from "../assets/logo.png";
import heroRoom from "../assets/hero-room.jpg";
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";


function Home({
  userName = "Sanyam",
  onLogout,
  onFindPGs,
  onRoommates,
  onSaved,
  onBookings,
  onMessages,
  onNotifications,
  onProfile,
  onSettings
}) {

  const [selectedPG, setSelectedPG] = useState(null);

  const pgData = [
    {
      id: 1,
      name: "Royal Student PG",
      location: "Rajpura, Punjab",
      distance: "1.2 km from college",
      price: 8000,
      rating: 4.5,
      reviews: 128,
      type: "Boys PG",
      room: "Single",
      amenities: ["WiFi", "Food", "AC"],
      image: pg1
    },

    {
      id: 2,
      name: "Green View Homes",
      location: "Rajpura, Punjab",
      distance: "1.5 km from college",
      price: 9000,
      rating: 4.7,
      reviews: 96,
      type: "Girls PG",
      room: "Single",
      amenities: ["WiFi", "Food", "Laundry"],
      image: pg2
    },

    {
      id: 3,
      name: "Student Hub",
      location: "Rajpura, Punjab",
      distance: "2 km from college",
      price: 7500,
      rating: 4.3,
      reviews: 84,
      type: "Co-living",
      room: "Double",
      amenities: ["WiFi", "AC", "Gym"],
      image: pg3
    }
  ];


  /* =========================
     PG DETAILS
  ========================= */

  if (selectedPG) {

    return (
      <PGDetails
        pg={selectedPG}
        onBack={() => setSelectedPG(null)}
      />
    );

  }


  return (

    <div className="home-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="home-sidebar">

        <div className="home-logo">

          <img
            src={logo}
            alt="StayMate"
          />

          <span>
            Stay<span>Mate</span>
          </span>

        </div>


        <div className="sidebar-menu">

          <button className="sidebar-item active">
            <span>⌂</span>
            Home
          </button>


          <button
            className="sidebar-item"
            onClick={onFindPGs}
          >
            <span>⌕</span>
            Find PGs
          </button>


          <button
            className="sidebar-item"
            onClick={onRoommates}
          >
            <span>♧</span>
            Roommates
          </button>


          <button className="sidebar-item"
            onClick={onSaved}
          >
            <span>♡</span>
            Saved
          </button>


          <button className="sidebar-item"
            onClick={onBookings}
          >
            <span>▣</span>
            My Bookings
          </button>


          <button className="sidebar-item"
            onClick={onMessages}
          >
            <span>◌</span>
            Messages
          </button>


          <button className="sidebar-item"
            onClick={onNotifications}
          >
            <span>♧</span>
            Notifications
          </button>


          <button className="sidebar-item"
            onClick={onProfile}
          >
            <span>◎</span>
            Profile
          </button>


          <button className="sidebar-item"
            onClick={onSettings}
          >
            <span>⚙</span>
            Settings
          </button>

        </div>


        <button
          className="sidebar-logout"
          onClick={onLogout}
        >
          ↪
          Logout
        </button>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="home-main">


        {/* =========================
            TOP BAR
        ========================= */}

        <header className="home-topbar">

          <div></div>

          <div className="user-area">

            <div className="user-avatar">
              {userName.charAt(0)}
            </div>

            <span>
              {userName}
            </span>

            <span className="dropdown-arrow">
              ▾
            </span>

          </div>

        </header>


        {/* =========================
            HERO
        ========================= */}

        <section
          className="home-hero"
          style={{
            backgroundImage: `url(${heroRoom})`
          }}
        >

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <p className="hero-small">
              STUDENT DASHBOARD
            </p>

            <h1>
              Good Morning, {userName}! 👋
            </h1>

            <p className="hero-description">
              Find a place that feels like home.
            </p>


            {/* SEARCH */}

            <div className="home-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search PG, flat or location..."
              />

              <button onClick={onFindPGs}>
                Search
              </button>

            </div>


            {/* QUICK FILTERS */}

            <div className="hero-filters">

              <button>
                Near College
              </button>

              <button>
                PG
              </button>

              <button>
                Single Room
              </button>

              <button>
                Top Rated
              </button>

              <button>
                WiFi
              </button>

              <button>
                Food
              </button>

            </div>

          </div>

        </section>


        {/* =========================
            RECOMMENDED
        ========================= */}

        <section className="recommended-section">

          <div className="section-heading">

            <div>

              <h2>
                Recommended for you
              </h2>

              <p>
                Places that might feel right for you
              </p>

            </div>


            <button
              className="view-all"
              onClick={onFindPGs}
            >
              View All →
            </button>

          </div>


          <div className="pg-grid">

            {pgData.map((pg) => (

              <div
                className="pg-card"
                key={pg.id}
              >

                {/* IMAGE */}

                <div className="pg-image">

                  <img
                    src={pg.image}
                    alt={pg.name}
                  />

                  <button className="heart-button">
                    ♡
                  </button>

                </div>


                {/* CONTENT */}

                <div className="pg-content">

                  <div className="pg-card-title">

                    <h3>
                      {pg.name}
                    </h3>

                    <p>
                      📍 {pg.location}
                    </p>

                  </div>


                  <div className="pg-meta">

                    <span>
                      ⭐ {pg.rating}
                    </span>

                    <span>
                      {pg.type}
                    </span>

                  </div>


                  <div className="pg-bottom">

                    <div>

                      <strong>
                        ₹{pg.price.toLocaleString()}
                      </strong>

                      <span>
                        /month
                      </span>

                    </div>


                    <button
                      onClick={() =>
                        setSelectedPG(pg)
                      }
                    >
                      View Details
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =========================
            ROOMMATE BANNER
        ========================= */}

        <section className="roommate-banner">

          <div className="roommate-banner-content">

            <p>
              ROOMMATE MATCHING
            </p>

            <h2>
              Find Your Perfect Roommate
            </h2>

            <span>
              Match with students based on lifestyle
              compatibility, not just availability.
            </span>


            <div className="compatibility-tags">

              <span>
                Sleep
              </span>

              <span>
                Cleanliness
              </span>

              <span>
                Food
              </span>

              <span>
                Noise
              </span>

            </div>


            <button
              onClick={onRoommates}
            >
              Find My Match →
            </button>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="home-footer">

          <span>
            © 2026 StayMate
          </span>

          <span>
            Find your place. Find your people.
          </span>

        </footer>

      </main>

    </div>
  );
}


export default Home;