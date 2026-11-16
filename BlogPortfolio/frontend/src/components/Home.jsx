
import React from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import BlogProfileImage from "../assets/Blog Website Design.jpg";
import CSS from "../assets/css-3.png";
import HTML from "../assets/html.png";
import DB from "../assets/data-server.png";
import JS from "../assets/js.png";
import REACTICON from "../assets/physics.png";
import NODE from "../assets/node-js.png";

import P1 from "../assets/p1.jpg";
import P2 from "../assets/p2.png";
import P3 from "../assets/p3.png";

import BlogImage from "../assets/blogImage.png";
import Footer from "./common/Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="home-container">
        <div className="home-hero">

          <div className="hero-content">
            <p className="hero-label">
              Welcome to my portfolio
            </p>

            <h1 className="hero-title">
              Hello, I'm
              <br />
              <span>Jacky Thomas</span>
            </h1>

            <p className="hero-description">
              I create beautiful and responsive websites
              with a focus on clean design and meaningful
              user experiences. Explore my work and discover
              what I can create for you.
            </p>

            <button
              className="hero-button"
              onClick={() => navigate("/contact")}
            >
              Let's Connect →
            </button>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={BlogProfileImage}
              className="hero-image"
              alt="Portfolio profile"
            />
          </div>

        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section">
        <div className="home-container">
          <p className="section-eyebrow">
            Technologies I Work With
          </p>

          <div className="tech-icons">
            <img src={HTML} alt="HTML" />
            <img src={CSS} alt="CSS" />
            <img src={JS} alt="JavaScript" />
            <img src={REACTICON} alt="React" />
            <img src={DB} alt="Database" />
            <img src={NODE} alt="Node.js" />
          </div>
        </div>
      </section>

      {/* Services and Statistics */}
      <section className="home-container">
        <div className="services-section">

          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">6+</h3>
              <p className="stat-label">
                Projects Completed
              </p>
            </div>

            <div className="stat-card">
              <h3 className="stat-number">3.5+</h3>
              <p className="stat-label">
                Years of Learning & Experience
              </p>
            </div>
          </div>

          <div className="services-content">
            <p className="section-eyebrow">
              What I Do
            </p>

            <h2 className="services-title">
              My Creative
              <br />
              <span>Services</span>
            </h2>

            <p className="services-description">
              I enjoy building responsive websites,
              creating interactive user interfaces and
              bringing ideas to life through technology.
              Take a look at my work and get to know my skills.
            </p>
          </div>

        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="home-container">

          <p className="section-eyebrow text-center">
            My Work
          </p>

          <h2 className="section-heading">
            Selected <span>Projects</span>
          </h2>

          <p className="section-description">
            A glimpse of the projects I've been working on.
          </p>

          <div className="project-grid">
            <div className="project-card">
              <img src={P1} alt="Project one" />
            </div>

            <div className="project-card">
              <img src={P2} alt="Project two" />
            </div>

            <div className="project-card">
              <img src={P3} alt="Project three" />
            </div>
          </div>

        </div>
      </section>

      {/* Blog Introduction */}
      <section className="home-container">
        <div className="home-blog-section">

          <div>
            <img
              src={BlogImage}
              className="home-blog-image"
              alt="Writing and technology"
            />
          </div>

          <div className="blog-intro-content">
            <p className="section-eyebrow">
              From My Journal
            </p>

            <h2 className="blog-intro-title">
              Thoughts &
              <br />
              <span>Ideas Worth Sharing</span>
            </h2>

            <p className="blog-intro-description">
              I enjoy writing about technology,
              development and the things I learn along
              the way. Visit my blog to explore my stories
              and experiences.
            </p>

            <button
              className="hero-button"
              onClick={() => navigate("/blogs")}
            >
              Explore My Blogs →
            </button>
          </div>

        </div>
      </section>

      <Footer />

    </div>
  );
}

export default Home;
