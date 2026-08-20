import "./RoommateProfile.css";

import logo from "../assets/logo.png";

function RoommateProfile({ person, onBack }) {

  if (!person) {
    return null;
  }

  return (
    <div className="roommate-profile-page">

      {/* ================= NAVBAR ================= */}

      <nav className="roommate-profile-navbar">

        <div className="roommate-profile-logo">

          <img src={logo} alt="StayMate" />

          <span>
            Stay<span>Mate</span>
          </span>

        </div>

        <button
          className="profile-back-button"
          onClick={onBack}
        >
          ← Back to Roommates
        </button>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="roommate-profile-main">

        {/* PROFILE HEADER */}

        <section className="profile-header">

          <div className="profile-avatar">
            <img
              src={person.avatar}
              alt={person.name}
            />
          </div>

          <div className="profile-basic-info">

            <p className="profile-label">
              ROOMMATE PROFILE
            </p>

            <h1>
              {person.name}
            </h1>

            <p>
              {person.age} years • {person.course}
            </p>

            <p>
              🎓 {person.college}
            </p>

            <p>
              📍 Looking for a room in {person.location}
            </p>

          </div>

          <div className="profile-match">

            <strong>
              {person.compatibility}%
            </strong>

            <span>
              Compatibility
            </span>

          </div>

        </section>


        {/* ================= CONTENT ================= */}

        <div className="profile-content">


          {/* ABOUT */}

          <section className="profile-section">

            <h2>
              About {person.name.split(" ")[0]}
            </h2>

            <p>
              Hi! I'm {person.name.split(" ")[0]}, currently studying
              {` ${person.course}`} at {person.college}.
              I'm looking for a comfortable and friendly place
              to stay with someone who has a compatible lifestyle.
            </p>

          </section>


          {/* LIFESTYLE */}

          <section className="profile-section">

            <h2>
              Lifestyle & Preferences
            </h2>

            <div className="profile-preferences">

              <div className="preference-card">

                <span>
                  🌙
                </span>

                <div>
                  <small>
                    Lifestyle
                  </small>

                  <strong>
                    {person.lifestyle}
                  </strong>
                </div>

              </div>


              <div className="preference-card">

                <span>
                  ✨
                </span>

                <div>
                  <small>
                    Cleanliness
                  </small>

                  <strong>
                    {person.cleanliness}
                  </strong>
                </div>

              </div>


              <div className="preference-card">

                <span>
                  🍴
                </span>

                <div>
                  <small>
                    Food Preference
                  </small>

                  <strong>
                    {person.food}
                  </strong>
                </div>

              </div>


              <div className="preference-card">

                <span>
                  💰
                </span>

                <div>
                  <small>
                    Monthly Budget
                  </small>

                  <strong>
                    ₹{person.budget.toLocaleString()}
                  </strong>
                </div>

              </div>

            </div>

          </section>


          {/* COMPATIBILITY */}

          <section className="profile-section">

            <h2>
              Compatibility
            </h2>

            <div className="compatibility-box">

              <div className="compatibility-top">

                <div>

                  <strong>
                    {person.compatibility}% Match
                  </strong>

                  <p>
                    You and {person.name.split(" ")[0]} have
                    similar living preferences.
                  </p>

                </div>

                <div className="match-circle">
                  {person.compatibility}%
                </div>

              </div>


              <div className="compatibility-bar">

                <div
                  style={{
                    width: `${person.compatibility}%`
                  }}
                ></div>

              </div>

            </div>

          </section>


          {/* LOCATION & BUDGET */}

          <section className="profile-section">

            <h2>
              Looking For
            </h2>

            <div className="looking-grid">

              <div>
                <span>
                  📍 Location
                </span>

                <strong>
                  {person.location}
                </strong>
              </div>

              <div>
                <span>
                  💰 Budget
                </span>

                <strong>
                  ₹{person.budget.toLocaleString()} / month
                </strong>
              </div>

              <div>
                <span>
                  👤 Gender
                </span>

                <strong>
                  {person.gender}
                </strong>
              </div>

            </div>

          </section>


          {/* ACTIONS */}

          <div className="profile-actions">

            <button className="save-profile-button">
              ♡ Save Profile
            </button>

            <button className="connect-button">
              Connect with {person.name.split(" ")[0]} →
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default RoommateProfile;