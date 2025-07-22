import React, { useState } from "react";

export default function GroceryUploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setResponse(null);
    setError(null);
  }

  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload-receipt/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="container">
      <h1>Upload Grocery Receipt</h1>
      <div className="upload-image">
        <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
        <br />
      <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>

      {response && (
          <div className="success-upload">
          <h3>{JSON.stringify(response, null, 2)}</h3>
        </div>
      )}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
