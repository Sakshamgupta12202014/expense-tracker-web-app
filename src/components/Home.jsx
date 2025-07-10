import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to SmartExpense</h1>
        <p>Track your spending, take control of your budget, and save more.</p>
        <Link to="/expenses">
          <button className="cta-button">Start Tracking</button>
        </Link>
      </section>

      <section className="features">
        <h2>Why Choose SmartExpense?</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>💰 Simple Expense Tracking</h3>
            <p>Add, view, and manage your expenses with ease.</p>
          </div>
          <div className="card">
            <h3>📊 Visual Insights</h3>
            <p>Understand your spending habits with clean charts.</p>
          </div>
          <div className="card">
            <h3>🔒 Secure & Private</h3>
            <p>Your data stays safe and confidential.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2025 SmartExpense. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
