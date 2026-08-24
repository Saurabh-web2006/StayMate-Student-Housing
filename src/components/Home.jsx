import "./Home.css";
import { useMemo, useState } from "react";
import PGDetails from "./PGDetails";
import Sidebar from "./Sidebar";

import heroRoom from "../assets/hero-room.jpg";
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.jpg";
import pg6 from "../assets/pg6.jpg";
import roommate1 from "../assets/roommate1.jpg";
import roommate2 from "../assets/roommate2.jpg";
import roommate3 from "../assets/roommate3.jpg";
import roommate4 from "../assets/roommate4.jpg";
import rajpuraImg from "../../pictures/rajpura.jpg";
import patialaImg from "../../pictures/patiala.jpg";
import zirakpurImg from "../../pictures/zirakpur.jpg";
 
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
  onSettings,
  savedPGs = [],
  onToggleSaved
}) {
  const [selectedPG, setSelectedPG] = useState(null);
  const [searchTab, setSearchTab] = useState("pg"); 
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Interactive Roommate Matcher state
  const [matcherPrefs, setMatcherPrefs] = useState({
    sleep: "night",
    clean: "neat", 
    food: "any", 
    study: "quiet" 
  });

  // Calculate dynamic match score based on user selection
  const matchScore = useMemo(() => {
    let base = 82;
    if (matcherPrefs.sleep === "night") base += 5;
    if (matcherPrefs.clean === "neat") base += 4;
    if (matcherPrefs.study === "quiet") base += 4;
    if (matcherPrefs.food === "any") base += 3;
    return Math.min(base, 98);
  }, [matcherPrefs]);

  // Dynamic time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const pgData = [
    {
      id: 1,
      name: "Royal Student PG",
      location: "Rajpura, Punjab",
      distance: "1.2 km from campus",
      price: 8000,
      rating: 4.8,
      reviews: 128,
      type: "Boys PG",
      room: "Single Room",
      amenities: ["WiFi", "Food Included", "AC", "Laundry"],
      image: pg1,
      tag: "Most Popular",
      verified: true
    },
    {
      id: 2,
      name: "Green View Homes",
      location: "Rajpura, Punjab",
      distance: "1.5 km from campus",
      price: 9000,
      rating: 4.9,
      reviews: 96,
      type: "Girls PG",
      room: "Single Room",
      amenities: ["High-speed WiFi", "3 Meals Included", "Power Backup", "Security 24/7"],
      image: pg2,
      tag: "Top Rated",
      verified: true
    },
    {
      id: 3,
      name: "Student Hub Co-Living",
      location: "Rajpura, Punjab",
      distance: "2.0 km from campus",
      price: 7500,
      rating: 4.6,
      reviews: 84,
      type: "Co-living",
      room: "Double Sharing",
      amenities: ["WiFi", "AC", "Fitness Area", "Mess"],
      image: pg3,
      tag: "Best Value",
      verified: true
    },
  ];


  // for search submit on pg & roommate
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchTab === "roommate") {
      onRoommates();
    } else {
      onFindPGs();
    }
  };

  const faqs = [
    {
      q: "Are all listings on StayMate 100% verified?",
      a: "Yes! Every property is vetted for genuine student amenities, safety standards, accurate photos, and zero hidden charges before going live."
    },
    {
      q: "Do I have to pay any brokerage or agent commission?",
      a: "No. StayMate connects students directly with verified property hosts and roommates with 0% brokerage fees."
    },
    {
      q: "How does the Roommate Compatibility Matching score work?",
      a: "Our algorithm calculates an affinity score based on your sleep rhythms, study habits, dietary preferences, hygiene standards, and personality overlap."
    },
    {
      q: "Can I schedule a physical or video tour before booking?",
      a: "Absolutely! You can message hosts directly, clarify all details, and request in-person or virtual room visits."
    }
  ];

  /*
   * -----------------------------------------
   * PG DETAILS VIEW
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
        onBookings={onBookings}
        onMessages={onMessages}
        onNotifications={onNotifications}
        onProfile={onProfile}
        onSettings={onSettings}
        onLogout={onLogout}
      />

      {/* =================================
          MAIN CONTENT
      ================================= */}
      <main className="home-main">
        {/* =================================
            TOP BAR
        ================================= */}
        <header className="home-topbar">
          <div className="topbar-left">
            <div className="topbar-status">
              <span className="status-dot"></span>
              <span>18 new verified stays added this week</span>
            </div>
            <div className="topbar-campus-badge">
              📍 Rajpura & Patiala Campus Corridors
            </div>
          </div>

          <div className="topbar-right">
            <button 
              className="quick-action-btn"
              onClick={() => onFindPGs()}
              title="Browse All PGs"
            >
              Explore PGs
            </button>
            <button 
              className="quick-action-btn secondary"
              onClick={onRoommates}
              title="Find Matching Roommates"
            >
              Roommate Match
            </button>

            <div className="user-area" onClick={onProfile} title="View Profile">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{userName}</span>
              <span className="dropdown-arrow">▾</span>
            </div>
          </div>
        </header>

        {/* =================================
            HERO SECTION
        ================================= */}
        <section
          className="home-hero"
          style={{
            backgroundImage: `url(${heroRoom})`
          }}
        >
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-badges-row">
              <div className="hero-trust">
                <span className="check-icon">✓</span>
                Student-First Verified Housing
              </div>
              <div className="hero-zero-brokerage">
                ✨ Zero Brokerage Guarantee
              </div>
            </div>

            <p className="hero-small">
              SMART LIVING • COMPATIBLE ROOMMATES • TRANSPARENT RENT
            </p>

            <h1>
              {greeting}, {userName}! 👋
            </h1>

            <p className="hero-description">
              Find a place that feels like home — verified stays, transparent pricing, and compatible roommates tailored to your campus life.
            </p>

            {/* SEARCH WIDGET CONTAINER */}
            <div className="search-widget-container">
              {/* TABS */}
              <div className="search-widget-tabs">
                <button
                  type="button"
                  className={`search-tab ${searchTab === "pg" ? "active" : ""}`}
                  onClick={() => setSearchTab("pg")}
                >
                  🏡 Find PGs & Flats
                </button>
                <button
                  type="button"
                  className={`search-tab ${searchTab === "roommate" ? "active" : ""}`}
                  onClick={() => setSearchTab("roommate")}
                >
                  👥 Find Roommates
                </button>
              </div>

              {/* SEARCH BAR */}
              <form className="home-search" onSubmit={handleSearchSubmit}>
                <span className="search-icon">
                  {searchTab === "pg" ? "📍" : "🔍"}
                </span>

                <input
                  type="text"
                  placeholder={
                    searchTab === "pg"
                      ? "Search by PG name, location, single room, AC, or food..."
                      : "Search by course, branch, sleep habits, or campus..."
                  }
                  autoComplete="off"
                />

                <button type="submit" className="search-submit-btn">
                  {searchTab === "pg" ? "Find Stays →" : "Find Matches →"}
                </button>
              </form>
            </div>

          </div>

          {/* FLOATING HERO METRIC BADGE */}
          <div className="hero-floating-card">
            <div className="floating-card-avatars">
              <img src={roommate1} alt="Student" />
              <img src={roommate2} alt="Student" />
              <img src={roommate3} alt="Student" />
              <div className="avatar-plus">+480</div>
            </div>
            <div className="floating-card-text">
              <strong>Joined StayMate this semester</strong>
              <span>Verified student network near Chitkara</span>
            </div>
          </div>
        </section>

        {/* =================================
            LIVE STUDENT ACTIVITY STRIP
        ================================= */}
        <div className="activity-banner">
          <div className="activity-ticker">
            <span className="pulse-circle"></span>
            <span className="activity-text">
              <strong>Live Community Pulse:</strong> Aarav connected with a roommate 8m ago • Green View Homes received 5 inquiries today • 4 Single AC Rooms available in Rajpura
            </span>
          </div>
        </div>

        {/* =================================
            TRUST METRICS STRIP
        ================================= */}
        <section className="trust-strip">
          <div className="trust-item">
            <div className="trust-icon-box">🛡️</div>
            <div className="trust-text">
              <strong>100% Verified</strong>
              <span>In-person checked rooms</span>
            </div>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <div className="trust-icon-box">⭐</div>
            <div className="trust-text">
              <strong>4.8 / 5.0 Rating</strong>
              <span>500+ genuine reviews</span>
            </div>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <div className="trust-icon-box">🤝</div>
            <div className="trust-text">
              <strong>94% Match Rate</strong>
              <span>Lifestyle compatibility</span>
            </div>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <div className="trust-icon-box">💸</div>
            <div className="trust-text">
              <strong>₹0 Brokerage</strong>
              <span>Direct owner connect</span>
            </div>
          </div>
        </section>

        {/* =================================
            RECOMMENDED STAYS SECTION
        ================================= */}
        <section className="recommended-section">
          <div className="section-heading">
            <div>
              <div className="section-eyebrow">CURATED SELECTION</div>
              <h2>Recommended Student Stays</h2>
              <p>Hand-picked, high-rated student accommodations around campus.</p>
            </div>

            <div className="heading-actions">
              <button
                className="view-all-btn"
                onClick={() => onFindPGs()}
              >
                View All Listings →
              </button>
            </div>
          </div>



          {/* PG CARDS GRID */}
          <div className="pg-grid">
            {pgData.map((pg) => {
              const isSaved = savedPGs.some((saved) => saved.id === pg.id);

              return (
                <div className="pg-card" key={pg.id}>
                  {/* IMAGE CONTAINER */}
                  <div className="pg-image" onClick={() => setSelectedPG(pg)}>
                    <img src={pg.image} alt={pg.name} loading="lazy" />

                    <div className="pg-badges-overlay">
                      <div className="verified-badge">
                        ✓ Verified
                      </div>
                      {pg.tag && (
                        <div className="highlight-tag">
                          {pg.tag}
                        </div>
                      )}
                    </div>

                    <button
                      className={`heart-button ${isSaved ? "saved" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaved && onToggleSaved(pg);
                      }}
                      aria-label={isSaved ? "Remove from saved" : "Save PG"}
                      title={isSaved ? "Saved" : "Save to wishlist"}
                    >
                      {isSaved ? "♥" : "♡"}
                    </button>

                    <div className="price-floating-chip">
                      ₹{pg.price.toLocaleString()}<span>/mo</span>
                    </div>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="pg-content">
                    <div className="pg-card-header">
                      <div>
                        <h3 onClick={() => setSelectedPG(pg)}>{pg.name}</h3>
                        <p className="pg-location">📍 {pg.location}</p>
                      </div>
                      <div className="pg-rating-badge">
                        ⭐ {pg.rating}
                        <small>({pg.reviews})</small>
                      </div>
                    </div>

                    <div className="pg-distance-chip">
                      <span className="distance-dot"></span>
                      {pg.distance}
                    </div>

                    <div className="pg-meta-chips">
                      <span className="meta-pill type">{pg.type}</span>
                      <span className="meta-pill room">{pg.room}</span>
                    </div>

                    <div className="amenity-preview">
                      {pg.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="amenity-tag">
                          {amenity}
                        </span>
                      ))}
                      {pg.amenities.length > 3 && (
                        <span className="amenity-tag more">
                          +{pg.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="pg-bottom">
                      <div className="price-details">
                        <span className="price-sub">Includes all amenities</span>
                      </div>

                      <div className="card-actions">
                        <button
                          className="details-btn"
                          onClick={() => setSelectedPG(pg)}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================
            INTERACTIVE ROOMMATE MATCHING WIDGET (USP HIGHLIGHT)
        ================================= */}
        <section className="roommate-interactive-section">
          <div className="interactive-container">
            <div className="interactive-left">
              <div className="section-eyebrow accent-light">ROOMMATE COMPATIBILITY ENGINE</div>
              <h2>Find Someone Who Matches Your Daily Rhythm</h2>
              <p>
                Living with the right roommate transforms your college experience. Test our live matching algorithm by choosing your preferences below:
              </p>

              {/* INTERACTIVE TOGGLE BUTTONS */}
              <div className="interactive-controls">
                <div className="pref-group">
                  <span className="pref-label">⏰ Sleep Schedule:</span>
                  <div className="pref-buttons">
                    <button
                      type="button"
                      className={matcherPrefs.sleep === "night" ? "selected" : ""}
                      onClick={() => setMatcherPrefs({ ...matcherPrefs, sleep: "night" })}
                    >
                      🌙 Night Owl (Late sleep)
                    </button>
                    <button
                      type="button"
                      className={matcherPrefs.sleep === "early" ? "selected" : ""}
                      onClick={() => setMatcherPrefs({ ...matcherPrefs, sleep: "early" })}
                    >
                      ☀️ Early Bird (6 AM)
                    </button>
                  </div>
                </div>

                <div className="pref-group">
                  <span className="pref-label">🧹 Cleanliness & Order:</span>
                  <div className="pref-buttons">
                    <button
                      type="button"
                      className={matcherPrefs.clean === "neat" ? "selected" : ""}
                      onClick={() => setMatcherPrefs({ ...matcherPrefs, clean: "neat" })}
                    >
                      ✨ Ultra Neat & Tidy
                    </button>
                    <button
                      type="button"
                      className={matcherPrefs.clean === "relaxed" ? "selected" : ""}
                      onClick={() => setMatcherPrefs({ ...matcherPrefs, clean: "relaxed" })}
                    >
                      🛋️ Chill & Casual
                    </button>
                  </div>
                </div>

                <div className="pref-group">
                  <span className="pref-label">🎧 Study & Music Vibe:</span>
                  <div className="pref-buttons">
                    <button
                      type="button"
                      className={matcherPrefs.study === "quiet" ? "selected" : ""}
                      onClick={() => setMatcherPrefs({ ...matcherPrefs, study: "quiet" })}
                    >
                      🤫 Silent Study Focus
                    </button>
                    <button
                      type="button"
                      className={matcherPrefs.study === "music" ? "selected" : ""}
                      onClick={() => setMatcherPrefs({ ...matcherPrefs, study: "music" })}
                    >
                      🎵 Background Beats
                    </button>
                  </div>
                </div>
              </div>

              <div className="interactive-cta-row">
                <button className="matcher-primary-btn" onClick={onRoommates}>
                  Find Compatible Roommates ({matchScore}% Match) →
                </button>
                <span className="matching-note">⚡ 280+ students ready to connect</span>
              </div>
            </div>

            {/* LIVE SCORE DISPLAY CARD */}
            <div className="interactive-right">
              <div className="match-score-card">
                <div className="score-ring-wrapper">
                  <div className="score-ring">
                    <svg className="score-svg" viewBox="0 0 100 100">
                      <circle className="score-bg" cx="50" cy="50" r="42" />
                      <circle
                        className="score-progress"
                        cx="50"
                        cy="50"
                        r="42"
                        style={{
                          strokeDasharray: 264,
                          strokeDashoffset: 264 - (264 * matchScore) / 100
                        }}
                      />
                    </svg>
                    <div className="score-number-box">
                      <strong>{matchScore}%</strong>
                      <span>Match</span>
                    </div>
                  </div>
                </div>

                <div className="matched-preview-info">
                  <div className="compatibility-tag-status">
                    ✨ Highly Compatible Match
                  </div>
                  <div className="sample-profile-chip">
                    <img src={roommate4} alt="Matched student" />
                    <div>
                      <strong>Aarav Sharma</strong>
                      <span>Chitkara Uni • 3rd Year CSE</span>
                    </div>
                  </div>
                  <div className="matched-tags-list">
                    <span>✓ Sleep sync</span>
                    <span>✓ Noise comfort</span>
                    <span>✓ Clean habits</span>
                  </div>
                  <button className="connect-instant-btn" onClick={onRoommates}>
                    Chat with Aarav & More →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* =================================
            POPULAR STUDENT AREAS
        ================================= */}
        <section className="areas-section">
          <div className="section-heading">
            <div>
              <div className="section-eyebrow">CAMPUS HUBS</div>
              <h2>Popular Student Neighborhoods</h2>
              <p>Explore stays situated conveniently near top academic institutions.</p>
            </div>
          </div>

          <div className="areas-grid">
            <div
              className="area-card area-rajpura"
              onClick={() => onFindPGs("Rajpura")}
              role="button"
              tabIndex={0}
            >
              <img src={rajpuraImg} alt="Rajpura" className="area-image" />
              <div className="area-badge">🔥 Most Popular Hub</div>
              <div className="area-body">
                <span>Rajpura Campus Corridor</span>
                
              </div>
            </div>

            <div
              className="area-card area-patiala"
              onClick={() => onFindPGs("Patiala")}
              role="button"
              tabIndex={0}
            >
              <img src={patialaImg} alt="Patiala" className="area-image" />
              <div className="area-badge">🎓 University Central</div>
              <div className="area-body">
                <span>Patiala City Hub</span>
                
              </div>
            </div>

            <div
              className="area-card area-zirakpur"
              onClick={() => onFindPGs("Zirakpur")}
              role="button"
              tabIndex={0}
            >
              <img src={zirakpurImg} alt="Zirakpur" className="area-image" />
              <div className="area-badge">🏙️ Modern Co-Living</div>
              <div className="area-body">
                <span>Zirakpur Corridor</span>
                
              </div>
            </div>
          </div>
        </section>


        {/* =================================
            WHY STAYMATE (CORE VALUE PROPOSITION)
        ================================= */}
        <section className="why-section">
          <div className="why-header">
            <div>
              <div className="section-eyebrow">DESIGNED FOR STUDENT LIVING</div>
              <h2>Everything You Need Under One Roof</h2>
              <p>
                Say goodbye to unverified brokers, misleading photos, and unpredictable roommate issues. StayMate makes student accommodation seamless, safe, and transparent.
              </p>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>100% In-Person Verified</h3>
              <p>
                Every listing is physically audited for security, hygiene, working amenities, and genuine rent prices.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🧩</div>
              <h3>Smart Lifestyle Matching</h3>
              <p>
                Match with flatmates whose sleeping habits, food preferences, and study routines harmonize with yours.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💸</div>
              <h3>Zero Brokerage, Always</h3>
              <p>
                Connect directly with property managers with complete transparency. No hidden commission or surprise fees.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💬</div>
              <h3>Direct Student Chat</h3>
              <p>
                Message prospective roommates and verified hosts directly to ask questions and finalize arrangements safely.
              </p>
            </div>
          </div>
        </section>

        {/* =================================
            HOW IT WORKS (4 STEPS)
        ================================= */}
        <section className="how-section">
          <div className="section-heading">
            <div>
              <div className="section-eyebrow">SIMPLE & SEAMLESS</div>
              <h2>How StayMate Works in 4 Steps</h2>
              <p>From finding your ideal spot to picking the right people to live with.</p>
            </div>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Search & Filter</h3>
              <p>Explore verified PGs by location, budget, room type, AC, food, and distance from campus.</p>
            </div>

            <div className="step-line"></div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Compare Stays</h3>
              <p>Review real student photos, rent details, verified amenities, and authentic community ratings.</p>
            </div>

            <div className="step-line"></div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Find Your Roommate</h3>
              <p>Match with students based on lifestyle compatibility scores and chat before deciding.</p>
            </div>

            <div className="step-line"></div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Move In with Ease</h3>
              <p>Finalize your stay with complete peace of mind, zero broker hassles, and total transparency.</p>
            </div>
          </div>
        </section>

        {/* =================================
            STUDENT COMMUNITY TESTIMONIALS
        ================================= */}
        <section className="testimonials-section">
          <div className="section-heading">
            <div>
              <div className="section-eyebrow">COMMUNITY VOICES</div>
              <h2>Loved by Students Across Campuses</h2>
              <p>Hear how StayMate simplified accommodation for real university students.</p>
            </div>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Finding a PG near Chitkara without paying ₹5,000 to random brokers felt impossible until I used StayMate. The room was exactly as shown in the photos!"
              </p>
              <div className="testimonial-author">
                <img src={roommate1} alt="Rohan Verma" />
                <div>
                  <strong>Rohan Verma</strong>
                  <span>2nd Year CSE • Chitkara University</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The lifestyle matching is genius. My roommate and I both study late nights and maintain strict cleanliness. We get along effortlessly!"
              </p>
              <div className="testimonial-author">
                <img src={roommate2} alt="Ananya Gupta" />
                <div>
                  <strong>Ananya Gupta</strong>
                  <span>3rd Year BBA • Patiala Campus</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Verified WiFi speeds and 3-meals included info made choosing super straightforward. Saved me hours of wandering in the heat."
              </p>
              <div className="testimonial-author">
                <img src={roommate3} alt="Kabir Singhania" />
                <div>
                  <strong>Kabir Singhania</strong>
                  <span>1st Year MBA • Co-Living Resident</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================
            FREQUENTLY ASKED QUESTIONS
        ================================= */}
        <section className="faq-section">
          <div className="section-heading">
            <div>
              <div className="section-eyebrow">COMMON QUESTIONS</div>
              <h2>Got Questions? We’ve Got Answers.</h2>
              <p>Everything you need to know about discovering stays and roommates.</p>
            </div>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className={`faq-item ${isOpen ? "open" : ""}`}
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                >
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <span className="faq-toggle-icon">{isOpen ? "−" : "+"}</span>
                  </div>
                  {isOpen && <div className="faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================
            FINAL CALL TO ACTION
        ================================= */}
        <section className="final-cta">
          <div className="final-cta-left">
            <span className="cta-eyebrow">CAMPUS LIVING MADE EFFORTLESS</span>
            <h2>Ready to find your ideal student stay?</h2>
            <p>
              Browse hundreds of verified accommodations or find compatible roommates right now.
            </p>
          </div>

          <div className="cta-actions">
            <button className="cta-primary" onClick={() => onFindPGs()}>
              Explore All PGs →
            </button>
            <button className="cta-secondary" onClick={onRoommates}>
              Find Roommate Matches
            </button>
          </div>
        </section>

        {/* =================================
            FOOTER
        ================================= */}
        <footer className="home-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <strong>StayMate</strong>
              <span>Student Housing & Roommate Discovery Platform</span>
            </div>
            <div className="footer-links">
              <button onClick={() => onFindPGs()}>Find PGs</button>
              <button onClick={onRoommates}>Roommates</button>
              <button onClick={onSaved}>Saved Stays ({savedPGs.length})</button>
              <button onClick={onMessages}>Messages</button>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 StayMate. All rights reserved.</span>
            <span>Built with care for students everywhere.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;    
