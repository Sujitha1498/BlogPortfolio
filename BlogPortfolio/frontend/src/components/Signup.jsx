
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account created successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Signup error:", error.code);

      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/weak-password":
          setError("Please choose a stronger password.");
          break;

        default:
          setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <form onSubmit={handleSubmit} className="signup-card">

        <p className="signup-eyebrow">
          Join the Community
        </p>

        <h2 className="signup-title">
          Create Your <span>Account</span>
        </h2>

        <p className="signup-description">
          Join us to explore stories, share ideas and
          become part of our growing community.
        </p>

        <div className="signup-field">
          <label className="signup-label">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="signup-field">
          <label className="signup-label">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="signup-input"
            placeholder="Create a password"
          />
        </div>

        <div className="signup-field">
          <label className="signup-label">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="signup-input"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <p className="signup-error">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="signup-button"
        >
          {loading ? "Creating account..." : "Create Account →"}
        </button>

        <p className="signup-login">
          Already have an account?

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login here
          </button>
        </p>

      </form>
    </div>
  );
}

export default Signup;
