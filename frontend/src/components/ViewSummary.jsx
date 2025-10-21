import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#A8DADC",
  "#457B9D",
  "#F1FAEE",
  "#E63946",
  "#F4A261",
  "#2A9D8F",
  "#264653",
];

function PieChartComponent({ data, labelKey = "category" }) {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="price"
        nameKey={labelKey}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
      <Legend />
    </PieChart>
  );
}

export default function ViewSummary() {
  const [month, setMonth] = useState(() => {
    // default to current month YYYY-MM
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });
  const [totalExpense, setTotalExpense] = useState(0);
  const [groceryData, setGroceryData] = useState([]);
  const [eatOutData, setEatOutData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!month) return;

    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const [totalRes, groceryRes, eatoutRes] = await Promise.all([
          fetch(`http://localhost:8000/total_expense?month=${month}`),
          fetch(`http://localhost:8000/grocery_expenses?month=${month}`),
          fetch(`http://localhost:8000/eatout_expenses?month=${month}`),
        ]);
        if (!totalRes.ok || !groceryRes.ok || !eatoutRes.ok)
          throw new Error("Failed to load data");

        const totalJson = await totalRes.json();
        const groceryJson = await groceryRes.json();
        const eatoutJson = await eatoutRes.json();

        setTotalExpense(totalJson.total || 0);
        setGroceryData(groceryJson.data || []);
        setEatOutData(eatoutJson.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [month]);

  return (
    <div className="view-summary-container">
      <div className="month-picker">
        <label htmlFor="monthSelect">Select month: </label>
        <input
          id="monthSelect"
          type="month"
          value={month}
          max={new Date().toISOString().slice(0, 7)}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <div className="total-expense">
        <h1>
          Total Expense for {month}: €{totalExpense.toFixed(2)}
        </h1>
      </div>

      <div className="container eatout-container">
        <h2>Eat Out Expenses</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && eatOutData.length === 0 && (
          <p>No eat out expenses recorded for {month}.</p>
        )}
        {eatOutData.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Amount (€)</th>
                </tr>
              </thead>
              <tbody>
                {eatOutData.map(({ restaurant, price }) => (
                  <tr key={restaurant}>
                    <td>{restaurant}</td>
                    <td>{price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="piechart-wrapper">
              <PieChartComponent data={eatOutData} labelKey="restaurant" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
