import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("Connecting...");
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())
      .then(() => setBackendStatus("Backend Connected"))
      .catch(() => setBackendStatus("Backend Offline"));
  }, []);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setPredictions([]);
  };

  const detectObjects = async () => {
    if (!selectedImage) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPredictions(data.predictions);
    } catch (error) {
      console.log(error)
    }

    setLoading(false);
  };

return (
  <div className="app">
    <div className="card">
      <h1>Instrument AI</h1>
   
      <div className="status">
        <span
          className={`status-dot ${
            backendStatus === "Backend Connected" ? "online" : "offline"
          }`}
        ></span>

        {backendStatus}
      </div>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {selectedImage && (
        <div className="preview">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
          />
        </div>
      )}

      <button
        className="detect-btn"
        onClick={detectObjects}
        disabled={loading}
      >
        {loading ? "Detecting..." : "Detect Objects"}
      </button>

      <div className="result-card">
        <h2>Detection Results</h2>

        {predictions.length === 0 ? (
          <p className="empty">No detections yet.</p>
        ) : (
          <ul>
            {predictions.map((item, index) => (
              <li key={index}>
                <strong>{item.class}</strong>

                <span>
                  {(item.confidence * 100).toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);
}

export default App;