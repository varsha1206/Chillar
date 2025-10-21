import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="title">
        <header>
          <h2>Hi Varshaww</h2>
          <h1><span className="chillar">CHILLAR</span></h1>
        </header>
        <img src="/pfp.jpg" alt="Logo" className="logo-circle" />
      </div>
      <div className="menu-grid">
        <button className="button" onClick={() => navigate("/eatout")}>
          Eat Out
        </button>
        <button className="button" onClick={() => navigate("/subscriptions")}>
          Subscriptions
        </button>
        <button className="button" onClick={() => navigate("/travel")}>
          Travel
        </button>
        <button className="button" onClick={() => navigate("/viewsummary")}>
          View Summary
        </button>
      </div>
    </div>
  );
}
