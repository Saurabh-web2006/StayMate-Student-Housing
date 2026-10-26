// import { useState } from "react";
// import "./Signup.css";

// import logo from "../assets/logo.png";

// function Signup({
//   onLogin,
//   onLegal
// }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] =
//     useState(false);

//   const handleSignup = (e) => {
//     e.preventDefault();

//     alert("Account created!");
//   };

//   return (
//     <div className="signup-page">

      
//       <div className="signup-left">

//         <div className="signup-logo">
//           <img src={logo} alt="StayMate Logo" />

//           <div>
//             Stay<span>Mate</span>
//           </div>
//         </div>


//         <div className="signup-hero">

//           <h1>
//             Your new home
//             <br />
//             <span>starts here.</span>
//           </h1>

//           <p>
//             Join StayMate and discover comfortable PGs,
//             <br />
//             trusted listings and compatible roommates.
//           </p>


//           <div className="signup-benefits">

//             <div className="signup-benefit">

//               <div className="benefit-number">
//                 01
//               </div>

//               <div>
//                 <h3>Create your profile</h3>

//                 <p>
//                   Tell us a little about yourself.
//                 </p>
//               </div>

//             </div>


//             <div className="signup-benefit">

//               <div className="benefit-number">
//                 02
//               </div>

//               <div>
//                 <h3>Find your perfect stay</h3>

//                 <p>
//                   Explore PGs near your college.
//                 </p>
//               </div>

//             </div>


//             <div className="signup-benefit">

//               <div className="benefit-number">
//                 03
//               </div>

//               <div>
//                 <h3>Connect with roommates</h3>

//                 <p>
//                   Find students with similar lifestyles.
//                 </p>
//               </div>

//             </div>

//           </div>

//         </div>

//       </div>


     

//       <div className="signup-right">

//         <div className="signup-card">

//           <h2>
//             Create your <span>StayMate</span> account
//           </h2>

//           <p className="signup-subtitle">
//             Let's get you started 🚀
//           </p>


//           <form onSubmit={handleSignup}>

            

//             <div className="signup-form-group">

//               <label>
//                 Full Name
//               </label>

//               <div className="signup-input">

//                 <span>
//                   ♙
//                 </span>

//                 <input
//                   type="text"
//                   placeholder="Enter your full name"
//                   required
//                 />

//               </div>

//             </div>


           

//             <div className="signup-form-group">

//               <label>
//                 Email or Phone Number
//               </label>

//               <div className="signup-input">

//                 <span>
//                   ✉
//                 </span>

//                 <input
//                   type="text"
//                   placeholder="Enter your email or phone number"
//                   required
//                 />

//               </div>

//             </div>


            

//             <div className="signup-form-group">

//               <label>
//                 College / University
//               </label>

//               <div className="signup-input">

//                 <span>
//                   🎓
//                 </span>

//                 <input
//                   type="text"
//                   placeholder="Enter your college"
//                   required
//                 />

//               </div>

//             </div>


            

//             <div className="signup-form-group">

//               <label>
//                 Password
//               </label>

//               <div className="signup-input">

//                 <span>
//                   🔒
//                 </span>

//                 <input
//                   type={
//                     showPassword
//                       ? "text"
//                       : "password"
//                   }
//                   placeholder="Create a password"
//                   required
//                 />

//                 <button
//                   type="button"
//                   className="signup-eye"
//                   onClick={() =>
//                     setShowPassword(!showPassword)
//                   }
//                 >
//                   {showPassword
//                     ? "🙈"
//                     : "👁"}
//                 </button>

//               </div>

//             </div>


            

//             <div className="signup-form-group">

//               <label>
//                 Confirm Password
//               </label>

//               <div className="signup-input">

//                 <span>
//                   🔒
//                 </span>

//                 <input
//                   type={
//                     showConfirmPassword
//                       ? "text"
//                       : "password"
//                   }
//                   placeholder="Confirm your password"
//                   required
//                 />

//                 <button
//                   type="button"
//                   className="signup-eye"
//                   onClick={() =>
//                     setShowConfirmPassword(
//                       !showConfirmPassword
//                     )
//                   }
//                 >
//                   {showConfirmPassword
//                     ? "🙈"
//                     : "👁"}
//                 </button>

//               </div>

//             </div>


            

//             <button
//               type="submit"
//               className="signup-button"
//             >
//               Create Account
//               <span>→</span>
//             </button>

//           </form>


//           <div className="signup-divider"></div>


//           <div className="signup-switch">

//             Already have an account?

//             <button onClick={onLogin}>
//               Login
//             </button>

//           </div>

//         </div>


//         <div className="legal-box">

//           <div className="legal-shield">
//             🛡️
//           </div>

//           <div className="legal-content">

//             <p className="legal-main-text">
//               Your privacy matters to us
//             </p>

//             <p className="legal-sub-text">
//               By creating an account, you agree to our
//             </p>

//             <div className="legal-links">

//               <button
//                 type="button"
//                 onClick={onLegal}
//               >
//                 Terms of Service
//               </button>

//               <span>•</span>

//               <button
//                 type="button"
//                 onClick={onLegal}
//               >
//                 Privacy Policy
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Signup;


import { useState } from "react";
import "./Signup.css";
import FormInput from '../components/FormInput'; 

import logo from "../assets/logo.png";
import {
  validateRequired,
  validateIdentifier,
  validatePassword,
  validateConfirmPassword,
} from "./utils/validation";

function Signup({ onLogin, onLegal, onAccountCreated }) {
  const [submitError, setSubmitError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "",
    college: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    identifier: "",
    college: "",
    password: "",
    confirmPassword: "",
  });

  // Validate a single field by name
  const validateField = (name, value, currentFormData = formData) => {
    switch (name) {
      case "fullName":
        return validateRequired(value, "Full name");
      case "identifier":
        return validateIdentifier(value);
      case "college":
        return validateRequired(value, "College / University");
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(currentFormData.password, value);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    if (submitError) setSubmitError("");

    
    const updatedErrors = { ...errors };
    const hasCurrentError = Array.isArray(errors[name])
      ? errors[name].length > 0
      : Boolean(errors[name]);

    if (hasCurrentError) {
      updatedErrors[name] = validateField(name, value, updatedFormData);
    }

     if (name === "password" && (updatedFormData.confirmPassword || errors.confirmPassword)) {
      updatedErrors.confirmPassword = validateConfirmPassword(
        value,
        updatedFormData.confirmPassword
      );
    }

    setErrors(updatedErrors);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: validateRequired(formData.fullName, "Full name"),
      identifier: validateIdentifier(formData.identifier),
      college: validateRequired(formData.college, "College / University"),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
    };

    const hasAnyError = Object.values(newErrors).some((err) =>
      Array.isArray(err) ? err.length > 0 : Boolean(err)
    );

    if (hasAnyError) {
      setErrors(newErrors);
      return;
    }

    setSubmitError("");
    setIsCreatingAccount(true);
    try {
      await onAccountCreated(formData);
    } catch (error) {
      setSubmitError(error.message || "We couldn't create your account. Please try again.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <div className="signup-page">
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
              <div className="benefit-number">01</div>
              <div>
                <h3>Create your profile</h3>
                <p>Tell us a little about yourself.</p>
              </div>
            </div>

            <div className="signup-benefit">
              <div className="benefit-number">02</div>
              <div>
                <h3>Find your perfect stay</h3>
                <p>Explore PGs near your college.</p>
              </div>
            </div>

            <div className="signup-benefit">
              <div className="benefit-number">03</div>
              <div>
                <h3>Connect with roommates</h3>
                <p>Find students with similar lifestyles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-card">
          <h2>
            Create your <span>StayMate</span> account
          </h2>

          <p className="signup-subtitle">Let's get you started 🚀</p>

          <form onSubmit={handleSignup} noValidate>
            <FormInput
              label="Full Name"
              name="fullName"
              type="text"
              icon="♙"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              groupClass="signup-form-group"
              containerClass="signup-input"
              iconClass=""
            />

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
              groupClass="signup-form-group"
              containerClass="signup-input"
              iconClass=""
            />

            <FormInput
              label="College / University"
              name="college"
              type="text"
              icon="🎓"
              placeholder="Enter your college"
              value={formData.college}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.college}
              groupClass="signup-form-group"
              containerClass="signup-input"
              iconClass=""
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              icon="🔒"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              groupClass="signup-form-group"
              containerClass="signup-input"
              iconClass=""
              toggleClass="signup-eye"
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              icon="🔒"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              groupClass="signup-form-group"
              containerClass="signup-input"
              iconClass=""
              toggleClass="signup-eye"
            />

            {submitError && <p className="signup-submit-error" role="alert">{submitError}</p>}

            <button type="submit" className="signup-button" disabled={isCreatingAccount}>
              {isCreatingAccount ? "Creating account..." : "Create Account"}
              <span>→</span>
            </button>
          </form>

          <div className="signup-divider"></div>

          <div className="signup-switch">
            Already have an account?
            <button type="button" onClick={onLogin}>
              Login
            </button>
          </div>
        </div>

        <div className="legal-box">
          <div className="legal-shield">🛡️</div>

          <div className="legal-content">
            <p className="legal-main-text">Your privacy matters to us</p>

            <p className="legal-sub-text">
              By creating an account, you agree to our
            </p>

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
  );
}

export default Signup;