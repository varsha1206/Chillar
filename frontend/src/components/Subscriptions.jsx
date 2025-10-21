// src/pages/Subscriptions.jsx
import React, { useState, useEffect } from "react";
import "../styles/subscriptions.css";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/subscriptions");
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const handleAdd = async () => {
    if (!newName || !newPrice) return;
    await fetch("http://127.0.0.1:8000/subscriptions/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, price: parseFloat(newPrice) })
    });
    setNewName("");
    setNewPrice("");
    fetchSubscriptions();
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/subscriptions/delete/${id}`, {
      method: "DELETE"
    });
    fetchSubscriptions();
  };

  const handleEdit = async (id) => {
    if (!editPrice) return;
    await fetch(`http://127.0.0.1:8000/subscriptions/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: parseFloat(editPrice) })
    });
    setEditId(null);
    setEditPrice("");
    fetchSubscriptions();
  };

  return (
    <div className="subscriptions-container">
      <h1>Subscriptions</h1>

      {subscriptions.length === 0 ? (
        <p className="empty-text">No subscriptions found.</p>
      ) : (
        subscriptions.map((sub) => (
          <div className="subscription-card" key={sub.id}>
            <h2>{sub.name}</h2>
            {editId === sub.id ? (
              <div className="edit-mode">
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="New price"
                />
                <button className="save-btn" onClick={() => handleEdit(sub.id)}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="subscription-details">
                <span className="price-box">€{sub.price}</span>
                <button className="edit-btn" onClick={() => setEditId(sub.id)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(sub.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <div className="add-subscription">
        <input
          type="text"
          placeholder="Service name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="€ Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <button className="add-btn" onClick={handleAdd}>
          +
        </button>
      </div>
    </div>
  );
}
