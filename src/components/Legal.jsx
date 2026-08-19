import "./Legal.css";
import logo from "../assets/logo.png";

function Legal({ onBack }) {
  return (
    <div className="legal-page">

      {/* HEADER */}

      <header className="legal-header">

        <div className="legal-logo">

          <img src={logo} alt="StayMate Logo" />

          <div>
            Stay<span>Mate</span>
          </div>

        </div>

        <button
          className="legal-back"
          onClick={onBack}
        >
          ← Back to Login
        </button>

      </header>


      {/* CONTENT */}

      <main className="legal-content">

        <div className="legal-title">

          <span>StayMate</span>

          <h1>
            Terms & Privacy
          </h1>

          <p>
            Last updated: August 2026
          </p>

        </div>


        {/* =========================
            TERMS OF SERVICE
        ========================= */}

        <div className="legal-section">

          <div className="section-label">
            TERMS OF SERVICE
          </div>

          <h2>
            Terms of Service
          </h2>


          <div className="legal-block">

            <h3>1. Acceptance of Terms</h3>

            <p>
              Welcome to StayMate. By creating an account
              or using our platform, you agree to these
              Terms of Service. If you do not agree with
              these terms, please do not use StayMate.
            </p>

          </div>


          <div className="legal-block">

            <h3>2. Using StayMate</h3>

            <p>
              StayMate helps students discover PG
              accommodations, connect with potential
              roommates and explore housing options.
            </p>

            <p>
              You agree to provide accurate information
              and use the platform only for lawful
              purposes.
            </p>

          </div>


          <div className="legal-block">

            <h3>3. User Accounts</h3>

            <p>
              You are responsible for maintaining the
              confidentiality of your account information.
              You should notify us if you believe your
              account has been accessed without your
              permission.
            </p>

          </div>


          <div className="legal-block">

            <h3>4. PG Listings</h3>

            <p>
              Information about PGs and accommodations
              may be provided by property owners or other
              users. While StayMate aims to provide
              reliable information, users should verify
              important details before making a booking.
            </p>

          </div>


          <div className="legal-block">

            <h3>5. Roommate Connections</h3>

            <p>
              StayMate may help users discover potential
              roommates based on their preferences.
              Compatibility suggestions are provided for
              convenience and do not guarantee a successful
              roommate relationship.
            </p>

          </div>


          <div className="legal-block">

            <h3>6. Prohibited Activities</h3>

            <p>
              Users must not misuse the platform, provide
              fraudulent information, harass other users,
              attempt unauthorized access or use StayMate
              for illegal activities.
            </p>

          </div>

        </div>


        {/* =========================
            PRIVACY POLICY
        ========================= */}

        <div className="legal-section">

          <div className="section-label privacy-label">
            PRIVACY POLICY
          </div>

          <h2>
            Privacy Policy
          </h2>


          <div className="legal-block">

            <h3>1. Information We Collect</h3>

            <p>
              When you create a StayMate account, we may
              collect information such as your name, email
              address, phone number and college information.
            </p>

          </div>


          <div className="legal-block">

            <h3>2. How We Use Your Information</h3>

            <p>
              We use your information to provide and
              improve StayMate services, personalize your
              experience, help you discover PGs and
              connect you with compatible roommates.
            </p>

          </div>


          <div className="legal-block">

            <h3>3. Profile Information</h3>

            <p>
              Information you choose to add to your profile
              may be visible to other users depending on
              the features you use.
            </p>

          </div>


          <div className="legal-block">

            <h3>4. Location Information</h3>

            <p>
              If you choose to use location-based features,
              StayMate may use your location to help you
              discover accommodations near your college
              or preferred area.
            </p>

          </div>


          <div className="legal-block">

            <h3>5. Data Security</h3>

            <p>
              We take reasonable measures to protect your
              information from unauthorized access, loss
              or misuse.
            </p>

          </div>


          <div className="legal-block">

            <h3>6. Information Sharing</h3>

            <p>
              We do not sell your personal information.
              Information may be shared when necessary to
              provide requested services or when required
              by applicable law.
            </p>

          </div>


          <div className="legal-block">

            <h3>7. Your Choices</h3>

            <p>
              You may review or update certain information
              associated with your account. You may also
              contact StayMate support regarding questions
              about your personal information.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Legal;