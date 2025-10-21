import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import EatOut from "./components/EatOut";
import ViewSummary from "./components/ViewSummary";
import Subscriptions from "./components/Subscriptions";

import "./styles/styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/eatout" element={<EatOut />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/viewsummary" element={<ViewSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
