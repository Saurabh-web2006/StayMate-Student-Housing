import { useState } from "react";
import "./FindPGs.css";

import PGDetails from "./PGDetails";
import Sidebar from "./Sidebar";

import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.jpg";
import pg6 from "../assets/pg6.jpg";


function FindPGs({
  userName = "Sanyam",
  onHome,
  onRoommates,
  onLogout,
  onSaved,
  savedPGs,
  onToggleSaved
}) {

  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("Any Budget");
  const [roomType, setRoomType] = useState("Any Room");
  const [pgType, setPgType] = useState("All");
  const [selectedPG, setSelectedPG] = useState(null);


  /* =========================
     PG DATA
  ========================= */

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
    },

    {
      id: 4,
      name: "Campus Comfort",
      location: "Near Chitkara University",
      distance: "800 m from college",
      price: 10500,
      rating: 4.8,
      reviews: 152,
      type: "Boys PG",
      room: "Single",
      amenities: ["WiFi", "Food", "AC"],
      image: pg4
    },

    {
      id: 5,
      name: "Urban Nest",
      location: "Rajpura, Punjab",
      distance: "2.5 km from college",
      price: 7000,
      rating: 4.2,
      reviews: 67,
      type: "Girls PG",
      room: "Double",
      amenities: ["WiFi", "Food", "Laundry"],
      image: pg5
    },

    {
      id: 6,
      name: "The Student Residence",
      location: "Patiala Road",
      distance: "3 km from college",
      price: 8500,
      rating: 4.6,
      reviews: 113,
      type: "Co-living",
      room: "Triple",
      amenities: ["WiFi", "Food", "Gym"],
      image: pg6
    }

  ];


  /* =========================
     FILTERING
  ========================= */

  const filteredPGs = pgData.filter((pg) => {

    const matchesSearch =
      pg.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      pg.location
        .toLowerCase()
        .includes(search.toLowerCase());


    const matchesBudget =
      budget === "Any Budget" ||

      (budget === "Under ₹8,000" &&
        pg.price < 8000) ||

      (budget === "₹8,000 - ₹10,000" &&
        pg.price >= 8000 &&
        pg.price <= 10000) ||

      (budget === "Above ₹10,000" &&
        pg.price > 10000);


    const matchesRoom =
      roomType === "Any Room" ||
      pg.room === roomType;


    const matchesPGType =
      pgType === "All" ||
      pg.type === pgType;


    return (
      matchesSearch &&
      matchesBudget &&
      matchesRoom &&
      matchesPGType
    );

  });


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


  /* =========================
     PAGE
  ========================= */

  return (

    <div className="find-pg-page">


      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar

        activePage="find"

        onHome={onHome}

        onFindPGs={() => { }}

        onRoommates={onRoommates}

        onSaved={onSaved}

        onBookings={() => {
          alert("My Bookings page coming soon!");
        }}

        onMessages={() => {
          alert("Messages page coming soon!");
        }}

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


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="find-pg-main">


        {/* =========================
            TOP BAR
        ========================= */}

        <header className="find-pg-topbar">

          <div></div>


          <div className="find-pg-profile">

            <div className="find-pg-avatar">
              {userName.charAt(0)}
            </div>

            <span>
              {userName}
            </span>

            <span className="find-pg-arrow">
              ▾
            </span>

          </div>

        </header>


        {/* =========================
            HEADER
        ========================= */}

        <section className="find-pg-heading">

          <p className="find-pg-label">
            FIND YOUR STAY
          </p>

          <h1>
            Find a PG that feels like home.
          </h1>

          <p>
            Explore verified PGs and student accommodations
            near your college.
          </p>

        </section>


        {/* =========================
            SEARCH
        ========================= */}

        <section className="find-pg-search">

          <div className="find-pg-search-input">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by PG name or location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <button className="find-pg-search-button">
            Search
          </button>

        </section>


        {/* =========================
            FILTERS
        ========================= */}

        <section className="filters-panel">


          <div className="filter-item">

            <label>
              Budget
            </label>

            <select
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
            >

              <option>
                Any Budget
              </option>

              <option>
                Under ₹8,000
              </option>

              <option>
                ₹8,000 - ₹10,000
              </option>

              <option>
                Above ₹10,000
              </option>

            </select>

          </div>


          <div className="filter-item">

            <label>
              Room Type
            </label>

            <select
              value={roomType}
              onChange={(e) =>
                setRoomType(e.target.value)
              }
            >

              <option>
                Any Room
              </option>

              <option>
                Single
              </option>

              <option>
                Double
              </option>

              <option>
                Triple
              </option>

            </select>

          </div>


          <div className="filter-item">

            <label>
              PG Type
            </label>

            <select
              value={pgType}
              onChange={(e) =>
                setPgType(e.target.value)
              }
            >

              <option>
                All
              </option>

              <option>
                Boys PG
              </option>

              <option>
                Girls PG
              </option>

              <option>
                Co-living
              </option>

            </select>

          </div>


          <button
            className="clear-filters"

            onClick={() => {

              setBudget("Any Budget");

              setRoomType("Any Room");

              setPgType("All");

              setSearch("");

            }}
          >
            Clear Filters
          </button>

        </section>


        {/* =========================
            RESULTS
        ========================= */}

        <section className="pg-results">


          <div className="results-header">

            <div>

              <h2>
                Available PGs
              </h2>

              <p>
                {filteredPGs.length} stays found
              </p>

            </div>


            <select className="sort-select">

              <option>
                Sort: Recommended
              </option>

              <option>
                Highest Rated
              </option>

              <option>
                Price: Low to High
              </option>

              <option>
                Price: High to Low
              </option>

            </select>

          </div>


          {/* =========================
              CARDS
          ========================= */}

          {filteredPGs.length > 0 ? (

            <div className="find-pg-grid">

              {filteredPGs.map((pg) => (

                <div
                  className="find-pg-card"
                  key={pg.id}
                >


                  {/* IMAGE */}

                  <div className="pg-image">

                    <img
                      src={pg.image}
                      alt={pg.name}
                    />


                    <button
                      className={`pg-heart ${savedPGs.some((saved) => saved.id === pg.id)
                          ? "saved"
                          : ""
                        }`}
                      onClick={() => onToggleSaved(pg)}
                    >
                      {savedPGs.some((saved) => saved.id === pg.id)
                        ? "♥"
                        : "♡"}
                    </button>

                  </div>


                  {/* CONTENT */}

                  <div className="find-pg-card-content">


                    <div className="find-pg-card-title">

                      <h3>
                        {pg.name}
                      </h3>

                      <p>
                        📍 {pg.location}
                      </p>

                    </div>


                    <div className="find-pg-distance">
                      {pg.distance}
                    </div>


                    <div className="find-pg-details">

                      <span className="find-pg-rating">
                        ⭐ {pg.rating}

                        <small>
                          ({pg.reviews})
                        </small>

                      </span>


                      <span>
                        {pg.room} Room
                      </span>


                      <span>
                        {pg.type}
                      </span>

                    </div>


                    <div className="amenities">

                      {pg.amenities.map(
                        (amenity, index) => (

                          <span key={index}>
                            {amenity}
                          </span>

                        )
                      )}

                    </div>


                    <div className="find-pg-card-bottom">

                      <div>

                        <strong>
                          ₹{pg.price.toLocaleString()}
                        </strong>

                        <small>
                          /month
                        </small>

                      </div>


                      <button
                        onClick={() =>
                          setSelectedPG(pg)
                        }
                      >
                        View Details →
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="no-results">

              <div>
                🔍
              </div>

              <h3>
                No PGs found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

              <button
                onClick={() => {

                  setBudget("Any Budget");

                  setRoomType("Any Room");

                  setPgType("All");

                  setSearch("");

                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


export default FindPGs;