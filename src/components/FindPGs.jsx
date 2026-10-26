import { useEffect } from "react";
import "./FindPGs.css";

import PGDetails from "./PGDetails";
import Sidebar from "./Sidebar";
import { usePersistentState } from "../utils/usePersistentState";



function FindPGs({
  userName = "Sanyam",
  onHome,
  onRoommates,
  onLogout,
  onMessages,
  onSaved,
  onBookings,
  onNotifications,
  onProfile,
  onSettings,
  savedPGs,
  onToggleSaved,
  onBook,
  initialSearch = "",
  onSearchChange,
  listings = [],
  persistenceKey = "staymate:guest"
}) {

  const [search, setSearch] = usePersistentState(`${persistenceKey}:findPGs:search`, initialSearch);
  const [budget, setBudget] = usePersistentState(`${persistenceKey}:findPGs:budget`, "Any Budget");
  const [roomType, setRoomType] = usePersistentState(`${persistenceKey}:findPGs:roomType`, "Any Room");
  const [pgType, setPgType] = usePersistentState(`${persistenceKey}:findPGs:pgType`, "All");
  const [selectedPG, setSelectedPG] = usePersistentState(`${persistenceKey}:findPGs:selectedPG`, null);

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch, setSearch]);



// PG DATA 

  const pgData = listings;


  //Filtering Logic

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


  //PG Details

  if (selectedPG) {

    return (
      <PGDetails
        pg={selectedPG}
        onBack={() => setSelectedPG(null)}
        onBook={(pg) => {
          setSelectedPG(null);
          onBook?.(pg);
        }}
      />
    );

  }


  return (

    <div className="find-pg-page">


      {/* Sidebar */}

      <Sidebar

        activePage="find"

        onHome={onHome}

        onFindPGs={() => { }}

        onRoommates={onRoommates}

        onSaved={onSaved}

        onBookings={onBookings}

        onMessages={onMessages}

        onNotifications={onNotifications}

        onProfile={onProfile}

        onSettings={onSettings}

        onLogout={onLogout}

      />

      <main className="find-pg-main">

        <header className="find-pg-topbar">

          <div></div>


          <button className="find-pg-profile" onClick={onProfile} type="button" title="View Profile" aria-label={`Open profile for ${userName}`}>

            <span className="find-pg-avatar">
              {userName.charAt(0)}
            </span>

            <span>
              {userName}
            </span>

            <span className="find-pg-arrow">
              ▾
            </span>

          </button>

        </header>

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

        <section className="find-pg-search">

          <div className="find-pg-search-input">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by PG name or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearchChange?.(e.target.value);
              }}
            />

          </div>


          <button className="find-pg-search-button">
            Search
          </button>

        </section>

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

          {filteredPGs.length > 0 ? (

            <div className="find-pg-grid">

              {filteredPGs.map((pg) => (

                <div
                  className="find-pg-card"
                  key={pg.id}
                >

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