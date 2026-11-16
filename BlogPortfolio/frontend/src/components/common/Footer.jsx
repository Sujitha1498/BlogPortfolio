
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-brand">
          Personal<span>.</span>
        </h2>

        <p className="footer-description">
          Sharing thoughts, ideas, and experiences through words.
        </p>

        <div className="footer-divider"></div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Personal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
