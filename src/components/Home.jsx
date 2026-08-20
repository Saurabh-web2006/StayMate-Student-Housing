
import "./Home.css";
import { useMemo, useState } from "react";
import PGDetails from "./PGDetails";
import Sidebar from "./Sidebar";

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
<<<<<<< HEAD
  onMessages,
  savedPGs = [],
  onToggleSaved
=======
  onBookings,
  onMessages,
  onNotifications,
  onProfile,
  onSettings
>>>>>>> 7270f639777e7dcb61dbb2c5e889101fafa63c5b
}) {
  const [selectedPG, setSelectedPG] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

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

  /*
   * -----------------------------------------
   * FILTERED RECOMMENDATIONS
   * -----------------------------------------
   */

  const filteredPGs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return pgData.filter((pg) => {
      const matchesSearch =
        !query ||
        pg.name.toLowerCase().includes(query) ||
        pg.location.toLowerCase().includes(query) ||
        pg.type.toLowerCase().includes(query) ||
        pg.amenities.some((item) =>
          item.toLowerCase().includes(query)
        );

      let matchesFilter = true;

      switch (activeFilter) {
        case "Near College":
          matchesFilter = parseFloat(pg.distance) <= 1.5;
          break;

        case "Single Room":
          matchesFilter = pg.room === "Single";
          break;

        case "Top Rated":
          matchesFilter = pg.rating >= 4.5;
          break;

        case "WiFi":
          matchesFilter = pg.amenities.includes("WiFi");
          break;

        case "Food":
          matchesFilter = pg.amenities.includes("Food");
          break;

        case "PG":
          matchesFilter = true;
          break;

        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  /*
   * -----------------------------------------
   * QUICK FILTER HANDLER
   * -----------------------------------------
   */

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  /*
   * -----------------------------------------
   * PG DETAILS
   * -----------------------------------------
   */

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

      {/* =================================
          SIDEBAR
      ================================= */}

      <Sidebar
        activePage="home"
        onHome={() => {}}
        onFindPGs={onFindPGs}
        onRoommates={onRoommates}
        onSaved={onSaved}
        onBookings={() => {
          alert("My Bookings page coming soon!");
        }}
        onMessages={onMessages}
        onNotifications={() => {
          alert("Notifications page coming soon!");
        }}
        onProfile={() => {
          alert("Profile page coming soon!");
        }}
        onSettings={() => {
          alert("Settings page coming soon!");
        }}
        onLogout={onLogout}
      />

<<<<<<< HEAD
      {/* =================================
=======
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
>>>>>>> 7270f639777e7dcb61dbb2c5e889101fafa63c5b
          MAIN CONTENT
      ================================= */}

      <main className="home-main">

        {/* =================================
            TOP BAR
        ================================= */}

        <header className="home-topbar">

          <div className="topbar-status">
            <span className="status-dot"></span>
            <span>Student community</span>
          </div>

          <div className="user-area">

            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <span>{userName}</span>

            <span className="dropdown-arrow">
              ▾
            </span>

          </div>

        </header>


        {/* =================================
            HERO
        ================================= */}

        <section
          className="home-hero"
          style={{
            backgroundImage: `url(${heroRoom})`
          }}
        >

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <div className="hero-trust">
              <span>✓</span>
              Student-focused accommodation discovery
            </div>

            <p className="hero-small">
              YOUR STUDENT HOME, SIMPLIFIED
            </p>

            <h1>
              Good Morning, {userName}! 👋
            </h1>

            <p className="hero-description">
              Find a place that feels like home — and people
              you will actually enjoy living with.
            </p>

            {/* SEARCH */}

            <div className="home-search">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PG, flat, amenity or location..."
              />

              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

              <button onClick={onFindPGs}>
                Search
              </button>

            </div>


            {/* QUICK FILTERS */}

            <div className="hero-filters">

              {[
                "Near College",
                "PG",
                "Single Room",
                "Top Rated",
                "WiFi",
                "Food"
              ].map((filter) => (
                <button
                  key={filter}
                  className={
                    activeFilter === filter
                      ? "active"
                      : ""
                  }
                  onClick={() => handleFilter(filter)}
                >
                  {filter}
                </button>
              ))}

            </div>

          </div>

        </section>


        {/* =================================
            TRUST STATS
        ================================= */}

        <section className="trust-strip">

          <div className="trust-item">
            <strong>100+</strong>
            <span>Student stays</span>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <strong>4.6★</strong>
            <span>Average rating</span>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <strong>Verified</strong>
            <span>Student-first listings</span>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <strong>24/7</strong>
            <span>Discover & connect</span>
          </div>

        </section>


        {/* =================================
            RECOMMENDED
        ================================= */}

        <section className="recommended-section">

          <div className="section-heading">

            <div>
              <div className="section-eyebrow">
                CURATED FOR YOU
              </div>

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


          {/* ACTIVE FILTER */}

          {activeFilter !== "All" && (
            <div className="active-filter-row">

              <span>
                Showing:
              </span>

              <button
                onClick={() => setActiveFilter("All")}
              >
                {activeFilter} ×
              </button>

            </div>
          )}


          <div className="pg-grid">

            {filteredPGs.length > 0 ? (

              filteredPGs.map((pg) => {

                const isSaved = savedPGs.some(
                  (saved) => saved.id === pg.id
                );

                return (

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

                      <div className="verified-badge">
                        ✓ Verified
                      </div>

                      <button
                        className={`heart-button ${
                          isSaved ? "saved" : ""
                        }`}
                        onClick={() =>
                          onToggleSaved &&
                          onToggleSaved(pg)
                        }
                        aria-label={
                          isSaved
                            ? "Remove from saved"
                            : "Save PG"
                        }
                      >
                        {isSaved ? "♥" : "♡"}
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


                      <div className="pg-distance">
                        <span>
                          ◉
                        </span>

                        {pg.distance}
                      </div>


                      <div className="pg-meta">

                        <span>
                          ⭐ {pg.rating}
                          <small>
                            ({pg.reviews})
                          </small>
                        </span>

                        <span>
                          {pg.type}
                        </span>

                      </div>


                      <div className="amenity-preview">

                        {pg.amenities.map((amenity) => (
                          <span key={amenity}>
                            {amenity}
                          </span>
                        ))}

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

                );
              })

            ) : (

              <div className="no-results">

                <div className="no-results-icon">
                  ⌕
                </div>

                <h3>
                  No stays found
                </h3>

                <p>
                  Try another search or remove the
                  current filter.
                </p>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                >
                  Clear Filters
                </button>

              </div>

            )}

          </div>

        </section>


        {/* =================================
            POPULAR AREAS
        ================================= */}

        <section className="areas-section">

          <div className="section-heading">

            <div>

              <div className="section-eyebrow">
                EXPLORE AROUND YOU
              </div>

              <h2>
                Popular student areas
              </h2>

              <p>
                Explore accommodation around popular
                university corridors.
              </p>

            </div>

          </div>


          <div className="areas-grid">

            <button
              className="area-card area-large"
              onClick={() => onFindPGs("Rajpura")}
            >
              <span>Rajpura</span>
              <small>
                Near Chitkara University
              </small>
              <strong>
                Explore stays →
              </strong>
            </button>


            <button
              className="area-card"
              onClick={() => onFindPGs("Patiala")}
            >
              <span>Patiala</span>
              <small>
                Student-friendly stays
              </small>
              <strong>
                Explore →
              </strong>
            </button>


            <button
              className="area-card"
              onClick={() => onFindPGs("Zirakpur")}
            >
              <span>Zirakpur</span>
              <small>
                Connected living
              </small>
              <strong>
                Explore →
              </strong>
            </button>

          </div>

        </section>


        {/* =================================
            WHY STAYMATE
        ================================= */}

        <section className="why-section">

          <div className="why-header">

            <div>

              <div className="section-eyebrow">
                BUILT FOR STUDENTS
              </div>

              <h2>
                More than just finding a room.
              </h2>

              <p>
                StayMate brings accommodation, compatibility
                and communication together in one student-first
                experience.
              </p>

            </div>

          </div>


          <div className="benefits-grid">

            <div className="benefit-card">

              <div className="benefit-icon">
                ✓
              </div>

              <h3>
                Verified stays
              </h3>

              <p>
                Discover listings with transparent pricing,
                amenities, photos and student-focused details.
              </p>

            </div>


            <div className="benefit-card">

              <div className="benefit-icon">
                ♡
              </div>

              <h3>
                Lifestyle matching
              </h3>

              <p>
                Find roommates based on sleep, cleanliness,
                food and noise preferences.
              </p>

            </div>


            <div className="benefit-card">

              <div className="benefit-icon">
                ₹
              </div>

              <h3>
                Transparent choices
              </h3>

              <p>
                Compare rent, room type, amenities and
                location before making a decision.
              </p>

            </div>


            <div className="benefit-card">

              <div className="benefit-icon">
                →
              </div>

              <h3>
                One connected platform
              </h3>

              <p>
                Save properties, discover roommates and
                communicate without jumping between apps.
              </p>

            </div>

          </div>

        </section>


        {/* =================================
            HOW IT WORKS
        ================================= */}

        <section className="how-section">

          <div className="section-heading">

            <div>

              <div className="section-eyebrow">
                SIMPLE BY DESIGN
              </div>

              <h2>
                Find your place in four steps
              </h2>

              <p>
                From first search to finding the right
                people to live with.
              </p>

            </div>

          </div>


          <div className="steps-container">

            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <h3>
                Discover
              </h3>

              <p>
                Search stays based on location, budget,
                room type and amenities.
              </p>

            </div>


            <div className="step-line"></div>


            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <h3>
                Compare
              </h3>

              <p>
                Review rent, facilities, distance,
                ratings and property details.
              </p>

            </div>


            <div className="step-line"></div>


            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <h3>
                Match
              </h3>

              <p>
                Discover students whose lifestyle fits
                naturally with yours.
              </p>

            </div>


            <div className="step-line"></div>


            <div className="step-card">

              <div className="step-number">
                04
              </div>

              <h3>
                Move in
              </h3>

              <p>
                Connect, discuss the details and make
                your student living decision.
              </p>

            </div>

          </div>

        </section>


        {/* =================================
            ROOMMATE BANNER
        ================================= */}

        <section className="roommate-banner">

          <div className="roommate-banner-content">

            <p>
              ROOMMATE MATCHING
            </p>

            <h2>
              Find someone who fits your lifestyle.
            </h2>

            <span>
              Because a good roommate is about more than
              sharing the rent. Match with students based
              on everyday habits and living preferences.
            </span>


            <div className="compatibility-tags">

              <span>
                Sleep schedule
              </span>

              <span>
                Cleanliness
              </span>

              <span>
                Food habits
              </span>

              <span>
                Noise tolerance
              </span>

            </div>


            <button
              onClick={onRoommates}
            >
              Find My Match →
            </button>

          </div>


          <div className="compatibility-preview">

            <div className="match-circle">
              <strong>
                92%
              </strong>

              <span>
                Match
              </span>
            </div>

            <div className="match-info">

              <span>
                Lifestyle compatibility
              </span>

              <strong>
                Very compatible
              </strong>

              <small>
                Sleep · Food · Cleanliness · Noise
              </small>

            </div>

          </div>

        </section>


        {/* =================================
            FINAL CTA
        ================================= */}

        <section className="final-cta">

          <div>

            <span>
              YOUR NEXT HOME IS CLOSER THAN YOU THINK
            </span>

            <h2>
              Ready to find your place?
            </h2>

            <p>
              Explore student-friendly stays or discover
              your next roommate today.
            </p>

          </div>


          <div className="cta-actions">

            <button
              className="cta-primary"
              onClick={onFindPGs}
            >
              Explore PGs →
            </button>

            <button
              className="cta-secondary"
              onClick={onRoommates}
            >
              Find a Roommate
            </button>

          </div>

        </section>


        {/* =================================
            FOOTER
        ================================= */}

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

