import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import GroceryUploadPage from "./components/Grocery";

import "./styles/styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/grocery-upload" element={<GroceryUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
