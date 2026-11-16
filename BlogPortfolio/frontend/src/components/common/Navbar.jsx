
import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(
        !!currentUser &&
        currentUser.uid === process.env.REACT_APP_ADMIN_UID
      );
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to logout. Please try again.");
    }
  };

  return (
    <nav className="navbar-container">
      <h2 className="nav-brand" onClick={() => navigate("/home")}>
        Personal<span>.</span>
      </h2>

      <div className="navbar-links">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/blogs" className="nav-link">Blogs</Link>
        <Link to="/home" className="nav-link">About</Link>

        {user ? (
          <>
            {isAdmin && (
              <Link to="/blogs" className="nav-link admin-link">
                Admin
              </Link>
            )}
            <button className="button-style" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="button-style"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="button-style signup-button"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
