import { useState } from "react";
import "./ForgotPassword.css";

import logo from "../assets/logo.png";

function ForgotPassword({ onBackToLogin }) {

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="forgot-page">

            <div className="forgot-card">

                {/* LOGO */}

                <div className="forgot-logo">
                    <img src={logo} alt="StayMate Logo" />

                    <div>
                        Stay<span>Mate</span>
                    </div>
                </div>


                {!submitted ? (

                    <>
                        <div className="forgot-icon">
                            🔐
                        </div>

                        <h1>
                            Forgot your password?
                        </h1>

                        <p className="forgot-description">
                            No worries! Enter the email address or phone
                            number associated with your account and we'll
                            help you reset your password.
                        </p>


                        <form onSubmit={handleSubmit}>

                            <div className="forgot-input-group">

                                <label>
                                    Email or Phone Number
                                </label>

                                <div className="forgot-input">

                                    <span>✉</span>

                                    <input
                                        type="text"
                                        placeholder="Enter your email or phone number"
                                        required
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="reset-button"
                            >
                                <span>Send Reset Link</span>
                                <span className="reset-arrow">→</span>
                            </button>

                        </form>


                        <button
                            className="back-login"
                            onClick={onBackToLogin}
                        >
                            ← Back to Login
                        </button>

                    </>

                ) : (

                    <div className="success-message">

                        <div className="success-icon">
                            ✓
                        </div>

                        <h1>
                            Check your inbox
                        </h1>

                        <p>
                            If an account exists with the information
                            you provided, we've sent instructions to
                            reset your password.
                        </p>

                        <button
                            className="forgot-button"
                            onClick={onBackToLogin}
                        >
                            Back to Login
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default ForgotPassword;