
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error.code);

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Invalid email or password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;

        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-card">

        <p className="login-eyebrow">
          Welcome Back
        </p>

        <h2 className="login-title">
          Login to <span>Personal</span>
        </h2>

        <p className="login-description">
          Welcome back! Sign in to continue exploring
          stories, ideas and experiences.
        </p>

        <div className="login-field">
          <label className="login-label">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="login-field">
          <label className="login-label">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <p className="login-error">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="login-button"
        >
          {loading ? "Logging in..." : "Login →"}
        </button>

        <p className="login-register">
          New here?

          <button
            type="button"
            onClick={() => navigate("/signup")}
          >
            Create an account
          </button>
        </p>

      </form>
    </div>
  );
}

export default Login;
