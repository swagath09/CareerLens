import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="skillsync-container page-load">
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-content">

          {/* Logo */}
          <div className="logo">CareerLens</div>

          {/* Center links (desktop only) */}
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>

          {/* Buttons (always visible) */}
          <div className="nav-buttons">
            <button className="btn-text" onClick={() => navigate("/auth/login")}>
              Login
            </button>

            <button className="btn-primary-sm" onClick={() => navigate("/auth/signup")}>
              Signup
            </button>

          </div>

          {/* Hamburger (mobile only) */}
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </div>

        {/* Mobile menu → ONLY NAV LINKS */}
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
          </div>
        )}
      </nav>



      {/* ================= HERO ================= */}
      <header className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Sync Your Skills. <br />
              <span>Shape Your Career.</span>
            </h1>


            <p>
              Upload your resume and let our AI analyze your skills, detect gaps,
and generate a personalized roadmap tailored to your career goals.
            </p>

            <div className="hero-cta">
              <button className="btn-primary" onClick={() => navigate("/auth")}>
                Analyze Resume
                <span className="icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M14 2v6h6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 12h8M8 16h8M8 8h4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </button>

              <button className="btn-secondary">
                View Roadmap
                <span className="icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Mock Dashboard */}
          <div className="hero-visual">
            <div className="mockup-dashboard">
              <div className="mockup-header">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>

              <div className="mockup-body">
                <SkillBar label="Python Skills" value="85%" />
                <SkillBar label="Cloud Architecture" value="40%" gap />
                <SkillBar label="React.js" value="92%" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= FEATURES ================= */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Everything you need to level up</h2>
          <p>
            Our AI-driven engine provides precision insights into your
            professional growth.
          </p>
        </div>

        <div className="features-grid">
          <Feature icon="🔍" title="Resume Skill Analysis">
            Deep scan of your experience to extract core competencies.
          </Feature>

          <Feature icon="⚠️" title="Skill Gap Detection">
            Compare your profile against industry standards.
          </Feature>

          <Feature icon="🗺️" title="Roadmap Generator">
            Customized learning paths with projects and certifications.
          </Feature>

          <Feature icon="📈" title="Progress Tracking">
            Visual dashboards to monitor your career growth.
          </Feature>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-header">
          <h2>3 Steps to Success</h2>
        </div>

        <div className="steps-container">
          <Step number="01" title="Upload Resume">
            Drop your PDF or DOCX file for AI parsing.
          </Step>

          <Step number="02" title="Analyze Skills">
            Identify strengths and missing skills instantly.
          </Step>

          <Step number="03" title="Get Career Roadmap">
            Receive a step-by-step guide to get hired.
          </Step>
        </div>
      </section>

      <section className="stories-section">
        <h2 className="stories-title">Success Stories from CareerLens Users</h2>

        <div className="stories-grid">

          <div className="story-card">
            <p className="story-text">
              “CareerLens helped me identify missing backend skills in my resume.
              After following the roadmap, I cracked my first internship.”
            </p>

            <div className="story-user">
              <div className="avatar">👤</div>
              <div>
                <h4>Bhavana</h4>
                <span>Internship Secured</span>
              </div>
            </div>
          </div>

          <div className="story-card">
            <p className="story-text">
              “The skill gap analysis was accurate. I focused on React and system
              design, and my interview confidence improved a lot.”
            </p>

            <div className="story-user">
              <div className="avatar">👤</div>
              <div>
                <h4>Sravan</h4>
                <span>Frontend Developer</span>
              </div>
            </div>
          </div>

          <div className="story-card">
            <p className="story-text">
              “Uploading my resume and getting a clear roadmap saved months of
              confusion. CareerLens gave me direction.”

            </p>

            <div className="story-user">
              <div className="avatar">👤</div>
              <div>
                <h4>Saanvi</h4>
                <span>Career Switch Achieved</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Accelerate Your Career?</h2>
          <p>Join thousands of students and professionals who are taking control of their careers using AI-driven resume analysis and personalized skill roadmaps.</p>
          <div className="cta-btn">
            <button className="btn-one" onClick={() => navigate("/auth")}>Get Started Now</button>
            <button className="btn-two">View Sample Roadmap</button>
          </div>
          <p className="line">Built to help you move faster toward your career goals</p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">CareerLens</div>
            <p>Bridging the gap between talent and opportunity.</p>
          </div>

          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CareerLens</p>
        </div>
      </footer>
    </div>
  );
}

/* ================= SMALL INTERNAL COMPONENTS ================= */

function SkillBar({ label, value, gap }) {
  return (
    <div className="analysis-bar">
      <div className="bar-label">{label}</div>
      <div className="bar-bg">
        <div
          className={`bar-fill ${gap ? "gap" : ""}`}
          style={{ width: value }}
        />
      </div>
      {gap && <span className="gap-tag">Gap Detected</span>}
    </div>
  );
}

function Feature({ icon, title, children }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="step-item">
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default Home;
