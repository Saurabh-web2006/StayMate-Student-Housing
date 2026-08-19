import { useState } from "react";
import "./Signup.css";

import logo from "../assets/logo.png";

function Signup({
  onLogin,
  onLegal
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleSignup = (e) => {
    e.preventDefault();

    alert("Account created!");
  };

  return (
    <div className="signup-page">

      {/* LEFT SIDE */}

      <div className="signup-left">

        <div className="signup-logo">
          <img src={logo} alt="StayMate Logo" />

          <div>
            Stay<span>Mate</span>
          </div>
        </div>


        <div className="signup-hero">

          <h1>
            Your new home
            <br />
            <span>starts here.</span>
          </h1>

          <p>
            Join StayMate and discover comfortable PGs,
            <br />
            trusted listings and compatible roommates.
          </p>


          <div className="signup-benefits">

            <div className="signup-benefit">

              <div className="benefit-number">
                01
              </div>

              <div>
                <h3>Create your profile</h3>

                <p>
                  Tell us a little about yourself.
                </p>
              </div>

            </div>


            <div className="signup-benefit">

              <div className="benefit-number">
                02
              </div>

              <div>
                <h3>Find your perfect stay</h3>

                <p>
                  Explore PGs near your college.
                </p>
              </div>

            </div>


            <div className="signup-benefit">

              <div className="benefit-number">
                03
              </div>

              <div>
                <h3>Connect with roommates</h3>

                <p>
                  Find students with similar lifestyles.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="signup-right">

        <div className="signup-card">

          <h2>
            Create your <span>StayMate</span> account
          </h2>

          <p className="signup-subtitle">
            Let's get you started 🚀
          </p>


          <form onSubmit={handleSignup}>

            {/* NAME */}

            <div className="signup-form-group">

              <label>
                Full Name
              </label>

              <div className="signup-input">

                <span>
                  ♙
                </span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="signup-form-group">

              <label>
                Email or Phone Number
              </label>

              <div className="signup-input">

                <span>
                  ✉
                </span>

                <input
                  type="text"
                  placeholder="Enter your email or phone number"
                  required
                />

              </div>

            </div>


            {/* COLLEGE */}

            <div className="signup-form-group">

              <label>
                College / University
              </label>

              <div className="signup-input">

                <span>
                  🎓
                </span>

                <input
                  type="text"
                  placeholder="Enter your college"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="signup-form-group">

              <label>
                Password
              </label>

              <div className="signup-input">

                <span>
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  required
                />

                <button
                  type="button"
                  className="signup-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="signup-form-group">

              <label>
                Confirm Password
              </label>

              <div className="signup-input">

                <span>
                  🔒
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  required
                />

                <button
                  type="button"
                  className="signup-eye"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              className="signup-button"
            >
              Create Account
              <span>→</span>
            </button>

          </form>


          <div className="signup-divider"></div>


          <div className="signup-switch">

            Already have an account?

            <button onClick={onLogin}>
              Login
            </button>

          </div>

        </div>


        <div className="legal-box">

          <div className="legal-shield">
            🛡️
          </div>

          <div className="legal-content">

            <p className="legal-main-text">
              Your privacy matters to us
            </p>

            <p className="legal-sub-text">
              By creating an account, you agree to our
            </p>

            <div className="legal-links">

              <button
                type="button"
                onClick={onLegal}
              >
                Terms of Service
              </button>

              <span>•</span>

              <button
                type="button"
                onClick={onLegal}
              >
                Privacy Policy
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;