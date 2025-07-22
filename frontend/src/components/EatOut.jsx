// src/pages/EatOut.jsx

import React, { useState } from "react";

const restaurantData = {
  "The Dubliner": [
    { name: "Dubliner Fries", price: 6.90 },
    { name: "Veggie Basket", price: 15.90 },
    { name: "Juice", price: 3.70 }
  ],
  "Cafe Bairro": [
    { name: "Cappuccino", price: 3.90 },
    { name: "Espresso", price: 2.60 },
    { name: "Kuchen", price: 5 }
  ],
  "Deer Cafe": [
    { name: "Cappuccino", price: 3.90 },
    { name: "Espresso", price: 2.70 },
  ],
  "Puro": [
    { name: "Gelato (T.O.)", price: 2 },
    { name: "Gelato", price: 2.5 },
    { name: "Espresso", price: 2.60 },
    { name: "Tiramisu", price: 4.5 }
  ],
  "L'osteria": [
    { name: "Pizza Margherita", price: 10.95 },
    { name: "Penne Arrabbiata", price: 13.90 }
  ],
  "Schulzi": [
    { name: "Pizza Margherita", price: 9.95 },
    { name: "Juice/Soda", price: 3.7 }
  ],
  "Burger Me": [
    { name: "Sandeep Discount", price: 3 },
    { name: "Sandeep Meal", price: 5 }
  ]
};

export default function EatOut() {
  const [totals, setTotals] = useState({});
  const [customInputs, setCustomInputs] = useState({});
  const [customPrices, setCustomPrices] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [successMessage, setSuccessMessage] = useState("");


const handleAdd = (place, item) => {
  setTotals(prev => ({
    ...prev,
    [place]: (prev[place] || 0) + item.price
  }));

  setSelectedItems(prev => {
    const existing = prev[place] || [];
    return {
      ...prev,
      [place]: [...existing, item]
    };
  });
};

  const handleCustomSubmit = (place) => {
    const item = customInputs[place];
    const price = parseFloat(customPrices[place]);
    if (item && !isNaN(price)) {
      setTotals(prev => ({
        ...prev,
        [place]: (prev[place] || 0) + price
      }));
      setCustomInputs({ ...customInputs, [place]: "" });
      setCustomPrices({ ...customPrices, [place]: "" });
      setSelectedItems(prev => {
        const existing = prev[place] || [];
        return {
            ...prev,
            [place]: [...existing, { name: item, price }]
        };
        });
    }
  };

  const getTotal = () => {
    return Object.values(totals).reduce((sum, val) => sum + val, 0);
  };

  const handleSubmit = () => {
    setShowConfirm(true);
  };

const confirmSubmission = () => {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const flattenedItems = Object.entries(selectedItems).flatMap(([place, items]) =>
    items.map(item => ({
      RESTAURANT: `${place}`,
      ORDER: item.name,
      PRICE: item.price,
      DATE: `${today}`
    }))
  );

  fetch("http://localhost:8000/submit-expense", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flattenedItems),
  })
    .then(res => {
      if (res.ok) {
        setSuccessMessage("Your expense was noted successfully!");
        setShowConfirm(false);
        setShowConfirm(false);
        setTotals({});
        setSelectedItems({});
      } else {
      res.text().then(text => {
        setSuccessMessage("Submission failed. Please try again.");
        alert("Failed to submit: " + text);
      });
    }
    });
};

  return (
    <div className="eatout-container">
      <h1>Eat Out</h1>
      {Object.entries(restaurantData).map(([place, items]) => (
        <div className="restaurant-box" key={place}>
          <h2>{place}</h2>
          <div className="meal-buttons">
            {items.map((item) => (
              <button
                key={item.name}
                onClick={() => handleAdd(place, item)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="custom-entry">
            <input
              type="text"
              placeholder="Custom meal"
              value={customInputs[place] || ""}
              onChange={(e) =>
                setCustomInputs({ ...customInputs, [place]: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="€"
              value={customPrices[place] || ""}
              onChange={(e) =>
                setCustomPrices({ ...customPrices, [place]: e.target.value })
              }
            />
            <button onClick={() => handleCustomSubmit(place)}>Add</button>
          </div>
        </div>
      ))}

      <footer className="footer">
        <h3>Total Spent: €{getTotal().toFixed(2)}</h3>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </footer>
      {successMessage && (
  <div className="success-alert">
    {successMessage}
  </div>
)}
      {showConfirm && (
  <div className="modal">
    <div className="modal-content">
      <h3>Confirm Your Expenses</h3>
      {Object.entries(selectedItems).map(([place, items]) => (
        <div key={place} className="confirm-section">
          <h4>{place}</h4>
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {item.name} - €{item.price}
              </li>
            ))}
          </ul>
          <p><strong>Subtotal: €{totals[place].toFixed(2)}</strong></p>
        </div>
      ))}
      <h4>Total: €{getTotal().toFixed(2)}</h4>
      <div className="modal-actions">
        <button className="confirm" onClick={confirmSubmission}>Confirm</button>
        <button className="cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
