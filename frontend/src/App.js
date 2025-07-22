import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import GroceryUploadPage from "./components/Grocery";
import EatOut from "./components/EatOut";
import ViewSummary from "./components/ViewSummary";

import "./styles/styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/grocery-upload" element={<GroceryUploadPage />} />
        <Route path="/eatout" element={<EatOut />} />
        <Route path="/viewsummary" element={<ViewSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
