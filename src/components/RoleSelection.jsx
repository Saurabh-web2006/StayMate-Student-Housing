import { useState } from "react";
import "./RoleSelection.css";
import logo from "../assets/logo.png";

function RoleSelection({ onProceedToLogin }) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleClientClick = () => {
    
    setShowComingSoon(true);
    
    setTimeout(() => {
      setShowComingSoon(false);
    }, 3000);
  };

  return (
    <div className="role-page">
      <div className="role-card">
        
        <div className="role-logo">
          <img src={logo} alt="StayMate Logo" />
          <span>Stay<strong>Mate</strong></span>
        </div>

        <h2>Welcome to StayMate</h2>
        <p className="role-subtitle">Please select how you want to use the app</p>

        <div className="role-buttons">
          {/* Customer Button - Proceeds to Login */}
          <button className="role-btn customer-btn" onClick={onProceedToLogin}>
            <span className="btn-icon">👨‍🎓</span>
            <div className="btn-text">
              <h3>I am a Customer</h3>
              <p>Looking for a place to stay</p>
            </div>
            <span className="btn-arrow">→</span>
          </button>

          {/* Client Button - Shows Coming Soon */}
          <button className="role-btn client-btn" onClick={handleClientClick}>
            <span className="btn-icon">🏠</span>
            <div className="btn-text">
              <h3>I am a Property Owner</h3>
              <p>Looking to list my property</p>
            </div>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Coming Soon Alert Message */}
        {showComingSoon && (
          <div className="coming-soon-alert">
            🚀 <strong>Feature Coming Soon!</strong> We are currently building the ultimate dashboard for property owners. Stay tuned!
          </div>
        )}

      </div>
    </div>
  );
}

export default RoleSelection;