// import { useState } from "react";
// import "./Login.css";

// import logo from "../assets/logo.png";

// function Login({
//   onGetStarted,
//   onForgotPassword,
//   onLegal,
//   onLogin,
//   onBack // Added onBack prop
// }) {
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     onLogin();
//   };

//   return (
//     <div className="auth-page">

     

//       <div className="login-left">

//         <div className="staymate-logo">
//           <img src={logo} alt="StayMate Logo" />

//           <div>
//             Stay<span>Mate</span>
//           </div>
//         </div>

//         <div className="login-hero">

//           <h1>
//             Find a place
//             <br />
//             <span>you’ll love to call home.</span>
//           </h1>

//           <p>
//             Verified PGs, comfortable stays and compatible
//             <br />
//             roommates — all in one place for students.
//           </p>

//           <div className="login-features">

//             <div className="login-feature">
//               <div className="feature-icon blue">
//                 ✓
//               </div>

//               <div>
//                 <h3>Verified & Trusted</h3>
//                 <p>
//                   All PG listings are verified for your
//                   <br />
//                   safety and peace of mind.
//                 </p>
//               </div>
//             </div>

//             <div className="login-feature">
//               <div className="feature-icon green">
//                 ♧
//               </div>

//               <div>
//                 <h3>Find Compatible Roommates</h3>
//                 <p>
//                   Match with students based on lifestyle
//                   <br />
//                   and preferences.
//                 </p>
//               </div>
//             </div>

//             <div className="login-feature">
//               <div className="feature-icon purple">
//                 ⌂
//               </div>

//               <div>
//                 <h3>Easy & Convenient</h3>
//                 <p>
//                   Search, connect and book PGs
//                   <br />
//                   in just a few steps.
//                 </p>
//               </div>
//             </div>

//           </div>

//         </div>

//       </div>



//       <div className="login-right">

        

//         <div className="staymate-login-card">
        
          
//           <button type="button" className="back-button" onClick={onBack}>
//             ← Back
//           </button>

//           <h2>
//             Welcome to <span>StayMate</span>
//           </h2>

//           <p className="login-subtitle">
//             Let's get you started 👋
//           </p>

//           <div className="login-tab">
//             Login
//           </div>

//           <form onSubmit={handleLogin}>

           
//             <div className="form-group">
//               <label>
//                 Email or Phone Number
//               </label>

//               <div className="input-container">
//                 <span className="input-icon">
//                   ✉
//                 </span>

//                 <input
//                   type="text"
//                   placeholder="Enter your email or phone number"
//                   required
//                 />
//               </div>
//             </div>

           
//             <div className="form-group">
//               <label>
//                 Password
//               </label>

//               <div className="input-container">
//                 <span className="input-icon">
//                   🔒
//                 </span>

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   required
//                 />

//                 <button
//                   type="button"
//                   className="password-toggle"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? "🙈" : "👁"}
//                 </button>
//               </div>
//             </div>

           
//             <div className="forgot-password">
//               <button
//                 type="button"
//                 className="forgot-link"
//                 onClick={onForgotPassword}
//               >
//                 <span>🔐</span>
//                 Forgot Password?
//                 <span className="forgot-arrow">
//                   →
//                 </span>
//               </button>
//             </div>

            
//             <button
//               type="submit"
//               className="auth-button"
//             >
//               Login
//               <span>→</span>
//             </button>

//           </form>

          
//           <div className="auth-divider"></div>

//           <div className="switch-auth">
//             Don't have an account?
//             <button type="button" onClick={onGetStarted}>
//               Get Started
//             </button>
//           </div>

          
//           <div className="legal-box">
//             <div className="legal-shield">
//               🛡️
//             </div>

//             <div className="legal-content">
//               <p className="legal-main-text">
//                 Your privacy matters to us
//               </p>

//               <p className="legal-sub-text">
//                 By continuing, you agree to our
//               </p>

//               <div className="legal-links">
//                 <button
//                   type="button"
//                   onClick={onLegal}
//                 >
//                   Terms of Service
//                 </button>

//                 <span>•</span>

//                 <button
//                   type="button"
//                   onClick={onLegal}
//                 >
//                   Privacy Policy
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Login;



import { useState } from "react";
import "./Login.css";
import FormInput from '../components/FormInput'; 




import logo from "../assets/logo.png";
import { validateIdentifier, validatePassword } from "./utils/validation";

function Login({
  onGetStarted,
  onForgotPassword,
  onLegal,
  onLogin,
  onBack
}) {
  
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const validateField = (name, value) => {
    if (name === "identifier") return validateIdentifier(value);
    if (name === "password") return validatePassword(value);
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const identifierError = validateIdentifier(formData.identifier);
    const passwordError = validatePassword(formData.password);

    if (identifierError || passwordError) {
      setErrors({
        identifier: identifierError,
        password: passwordError,
      });
      return;
    }

    onLogin(formData);
  };

  return (
    <div className="auth-page">
      <div className="login-left">
        <div className="staymate-logo">
          <img src={logo} alt="StayMate Logo" />
          <div>
            Stay<span>Mate</span>
          </div>
        </div>

        <div className="login-hero">
          <h1>
            Find a place
            <br />
            <span>you’ll love to call home.</span>
          </h1>

          <p>
            Verified PGs, comfortable stays and compatible
            <br />
            roommates — all in one place for students.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <div className="feature-icon blue">✓</div>
              <div>
                <h3>Verified & Trusted</h3>
                <p>
                  All PG listings are verified for your
                  <br />
                  safety and peace of mind.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon green">♧</div>
              <div>
                <h3>Find Compatible Roommates</h3>
                <p>
                  Match with students based on lifestyle
                  <br />
                  and preferences.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon purple">⌂</div>
              <div>
                <h3>Easy & Convenient</h3>
                <p>
                  Search, connect and book PGs
                  <br />
                  in just a few steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="staymate-login-card">
          <button type="button" className="back-button" onClick={onBack}>
            ← Back
          </button>

          <h2>
            Welcome to <span>StayMate</span>
          </h2>

          <p className="login-subtitle">Let's get you started 👋</p>

          <div className="login-tab">Login</div>

          <form onSubmit={handleLogin} noValidate>
            <FormInput
              label="Email or Phone Number"
              name="identifier"
              type="text"
              icon="✉"
              placeholder="Enter your email or phone number"
              value={formData.identifier}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.identifier}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              icon="🔒"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />

            <div className="forgot-password">
              <button
                type="button"
                className="forgot-link"
                onClick={onForgotPassword}
              >
                <span>🔐</span>
                Forgot Password?
                <span className="forgot-arrow">→</span>
              </button>
            </div>

            <button type="submit" className="auth-button">
              Login
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider"></div>

          <div className="switch-auth">
            Don't have an account?
            <button type="button" onClick={onGetStarted}>
              Get Started
            </button>
          </div>

          <div className="legal-box">
            <div className="legal-shield">🛡️</div>
            <div className="legal-content">
              <p className="legal-main-text">Your privacy matters to us</p>
              <p className="legal-sub-text">By continuing, you agree to our</p>

              <div className="legal-links">
                <button type="button" onClick={onLegal}>
                  Terms of Service
                </button>
                <span>•</span>
                <button type="button" onClick={onLegal}>
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
