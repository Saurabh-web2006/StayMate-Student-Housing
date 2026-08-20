import { useState } from "react";
import "./Saved.css";

import Sidebar from "./Sidebar";
import PGDetails from "./PGDetails";

function Saved({
  userName = "Sanyam",
  onHome,
  onFindPGs,
  onRoommates,
  onMessages,
  onBookings,
  onNotifications,
  onProfile,
  onSettings,
  onLogout,
  savedPGs = [],
  onToggleSaved
}) {

  const [selectedPG, setSelectedPG] = useState(null);

  //PG Details

  if (selectedPG) {

    return (
      <PGDetails
        pg={selectedPG}
        onBack={() => setSelectedPG(null)}
      />
    );

  }


  return (

    <div className="saved-page">

     {/* Sidebar */}

      <Sidebar

        activePage="saved"

        onHome={onHome}

        onFindPGs={onFindPGs}

        onRoommates={onRoommates}

        onSaved={() => {}}

        onBookings={onBookings}

        onMessages={onMessages}

        onNotifications={onNotifications}

        onProfile={onProfile}

        onSettings={onSettings}

        onLogout={onLogout}

      />

      <main className="saved-main">

        <header className="saved-topbar">

          <div className="saved-user">

            <div className="saved-avatar">
              {userName.charAt(0)}
            </div>

            <span>
              {userName}
            </span>

            <span>
              ▾
            </span>

          </div>

        </header>

        <section className="saved-heading">

          <p>
            YOUR SAVED PLACES
          </p>

          <h1>
            Places you've saved.
          </h1>

          <span>
            Keep your favourite stays in one place
            so you can compare them later.
          </span>

        </section>

        <div className="saved-results-header">

          <div>

            <h2>
              Saved PGs
            </h2>

            <p>
              {savedPGs.length} saved stays
            </p>

          </div>

        </div>

        {savedPGs.length > 0 ? (

          <div className="saved-grid">

            {savedPGs.map((pg) => (

              <div
                className="saved-card"
                key={pg.id}
              >

                <div className="saved-image">

                  <img
                    src={pg.image}
                    alt={pg.name}
                  />

                  <button
                    className="saved-heart"
                    onClick={() =>
                      onToggleSaved(pg)
                    }
                    title="Remove from saved"
                  >
                    ♥
                  </button>

                </div>

                <div className="saved-card-content">

                  <h3>
                    {pg.name}
                  </h3>

                  <p className="saved-location">
                    📍 {pg.location}
                  </p>

                  <div className="saved-meta">

                    <span>
                      ⭐ {pg.rating}
                    </span>

                    <span>
                      {pg.type}
                    </span>

                    <span>
                      {pg.room} Room
                    </span>

                  </div>

                  <div className="saved-amenities">

                    {pg.amenities.map(
                      (amenity, index) => (

                        <span key={index}>
                          {amenity}
                        </span>

                      )
                    )}

                  </div>

                  <div className="saved-bottom">

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

          <div className="saved-empty">

            <div className="saved-empty-icon">
              ♡
            </div>

            <h2>
              No saved PGs yet
            </h2>

            <p>
              When you find a place you like,
              save it here to easily find it later.
            </p>

            <button
              onClick={onFindPGs}
            >
              Explore PGs →
            </button>

          </div>

        )}

        <footer className="saved-footer">

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


export default Saved;