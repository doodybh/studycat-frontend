import React, { useEffect } from "react";
import { Link } from "react-router";

function Homepage({ user }) {
  useEffect(() => {
    document.title = "StudyCat";
  }, []);
  return (
    <main className="homepage">
      <section className="hero-section">
        <div className="hero-left">
          <span className="hero-badge">✨ Study • Focus • Customize</span>

          <h1 className="hero-title">
            Turn studying into a cozy little adventure.
          </h1>

          <p className="hero-description">
            Study with your study cat, earn coins and XP, unlock adorable
            cosmetics, decorate your room, and stay motivated while learning.
          </p>

          <div className="hero-buttons">
            {user ? (
              <Link className="primary-home-btn" to="/dashboard">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link className="primary-home-btn" to="/sign-up">
                  Get Started
                </Link>

                <Link className="secondary-home-btn" to="/sign-in">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card">
              <h2>🎓</h2>
              <p>Level Up</p>
            </div>

            <div className="hero-stat-card">
              <h2>🪙</h2>
              <p>Earn Coins</p>
            </div>

            <div className="hero-stat-card">
              <h2>🐱</h2>
              <p>Customize Your Cat</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="real-preview-wrapper">
            <img
              src="/homepage-preview.png"
              alt="Study Cat Preview"
              className="real-preview-image"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Homepage;
