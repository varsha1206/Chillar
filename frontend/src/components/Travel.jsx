import React, { useState } from "react";
import "../styles/Travel.css";

const travelModes = ["FlixBus", "Lufthansa", "AirIndia", "Indigo", "Train", "Car"];

export default function Travel() {
  const [formData, setFormData] = useState({
    mode_name: "",
    from: "",
    destination: "",
    departure_date: "",
    arrival_date: "",
    price: ""
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/add_travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccessMsg("Travel record saved successfully!");
        setFormData({
          mode_name: "",
          from: "",
          destination: "",
          departure_date: "",
          arrival_date: "",
          price: ""
        });
      } else {
        setSuccessMsg("Failed to save record.");
      }
    } catch (err) {
      setSuccessMsg("Error: " + err.message);
    }
  };

  return (
    <div className="travel-container">
      <h1>Travel Records</h1>

      <div className="travel-form">
        <label>Mode of Travel:</label>
        <select name="mode_name" value={formData.mode_name} onChange={handleChange}>
          <option value="">Select Mode</option>
          {travelModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
        </select>

        <label>From:</label>
        <input name="from" value={formData.from} onChange={handleChange} placeholder="Departure city" />

        <label>Destination:</label>
        <input name="destination" value={formData.destination} onChange={handleChange} placeholder="Arrival city" />

        <label>Departure Date:</label>
        <input type="date" name="departure_date" value={formData.departure_date} onChange={handleChange} />

        <label>Arrival Date:</label>
        <input type="date" name="arrival_date" value={formData.arrival_date} onChange={handleChange} />

        <label>Price (€):</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} />

        <button onClick={handleSubmit}>Record Travel</button>
      </div>

      {successMsg && <div className="success-msg">{successMsg}</div>}
    </div>
  );
}
