// import "./RoleSelection.css";
// import logo from "../assets/logo.png";

// function RoleSelection({ onProceedToLogin, onProceedToOwner }) {
//   return (
//     <div className="role-page">
//       <div className="role-card">
//         <div className="role-logo">
//           <img src={logo} alt="StayMate Logo" />
//           <span>Stay<strong>Mate</strong></span>
//         </div>

//         <h2>Welcome to StayMate</h2>
//         <p className="role-subtitle">Please select how you want to use the app</p>

//         <div className="role-buttons">
//           <button className="role-btn customer-btn" onClick={onProceedToLogin}>
//             <span className="btn-icon">👨‍🎓</span>
//             <div className="btn-text">
//               <h3>I am a Customer</h3>
//               <p>Looking for a place to stay</p>
//             </div>
//             <span className="btn-arrow">→</span>
//           </button>

//           <button className="role-btn client-btn" onClick={onProceedToOwner}>
//             <span className="btn-icon">🏠</span>
//             <div className="btn-text">
//               <h3>I am a Property Owner</h3>
//               <p>Looking to list my property</p>
//             </div>
//             <span className="btn-arrow">→</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RoleSelection;


import "./RoleSelection.css";
import logo from "../assets/logo.png";

function RoleSelection({ onProceedToLogin, onProceedToOwner }) {
  return (
    <div className="role-page">
      <div className="role-card">
        <div className="role-logo">
          <img src={logo} alt="StayMate Logo" />
          <span>
            Stay<strong>Mate</strong>
          </span>
        </div>

        <h2>Welcome to StayMate</h2>
        <p className="role-subtitle">
          Please select how you want to use the app
        </p>

        <div className="role-buttons">
          <button className="role-btn customer-btn" onClick={onProceedToLogin}>
            <span className="btn-icon">👨‍🎓</span>
            <div className="btn-text">
              <h3>I am a Customer</h3>
              <p>Looking for a place to stay</p>
            </div>
            <span className="btn-arrow">→</span>
          </button>

          <button className="role-btn client-btn" onClick={onProceedToOwner}>
            <span className="btn-icon">🏠</span>
            <div className="btn-text">
              <h3>I am a Property Owner</h3>
              <p>Looking to list my property</p>
            </div>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
