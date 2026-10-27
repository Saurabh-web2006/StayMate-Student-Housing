import "./PGDetails.css";
import { useState } from "react";

import logo from "../assets/logo.png";

function PGDetails({ pg, onBack, onBook, onContactOwner }) {
  const [contactError, setContactError] = useState("");
  const [contactingOwner, setContactingOwner] = useState(false);
  if (!pg) {
    return null;
  }

  return (
    <div className="pg-details-page">

      {/* NavBar */}

      <nav className="pg-details-navbar">

        <div className="pg-details-logo">
          <img src={logo} alt="StayMate" />

          <span>
            Stay<span>Mate</span>
          </span>
        </div>

        <button
          className="details-back"
          onClick={onBack}
        >
          ← Back to PGs
        </button>

      </nav>

      <main className="pg-details-main">

        <div className="details-image">

          <img
            src={pg.image}
            alt={pg.name}
          />

          <div className="details-verified">
            ✓ Verified PG
          </div>

        </div>


        {/* Information */}

        <div className="details-content">

          <div className="details-heading">

            <div>

              <p className="details-label">
                {pg.type}
              </p>

              <h1>
                {pg.name}
              </h1>

              <p className="details-location">
                📍 {pg.location}
              </p>

              <p className="details-distance">
                {pg.distance}
              </p>

            </div>


            <div className="details-rating">

              ⭐ {pg.rating}

              <span>
                ({pg.reviews} reviews)
              </span>

            </div>

          </div>


          {/* Price */}

          <div className="details-price-box">

            <div>

              <span className="details-price">
                ₹{pg.price.toLocaleString()}
              </span>

              <span className="details-month">
                /month
              </span>

            </div>

            <span className="details-room">
              {pg.room} Room
            </span>

          </div>


          {/* About */}

          <section className="details-section">

            <h2>
              About this PG
            </h2>

            <p>
              {pg.name} offers comfortable and convenient
              accommodation for students. Located {pg.distance.toLowerCase()},
              this PG provides a safe and student-friendly
              environment.
            </p>

          </section>


          {/* Amenities */}

          <section className="details-section">

            <h2>
              Amenities
            </h2>

            <div className="details-amenities">

              {pg.amenities.map((amenity, index) => (

                <div
                  className="amenity-card"
                  key={index}
                >
                  ✓ {amenity}
                </div>

              ))}

            </div>

          </section>


          {/* Actions */}

          <div className="details-actions">

            <button className="contact-button" type="button" disabled={contactingOwner || !onContactOwner} onClick={async () => {
              setContactingOwner(true);
              setContactError("");
              try { await onContactOwner(pg); }
              catch (error) { setContactError(error.message || "Could not open a conversation with this owner."); }
              finally { setContactingOwner(false); }
            }}>
              {contactingOwner ? "Opening messages…" : "Contact Owner"}
            </button>

            <button className="book-button" onClick={() => onBook?.(pg)}>
              Request to Book →
            </button>

          </div>
          {contactError && <p role="alert" className="details-contact-error">{contactError}</p>}

        </div>

      </main>

    </div>
  );
}

export default PGDetails;
