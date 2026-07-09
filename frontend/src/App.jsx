import {  useState } from "react";
import "./App.css";

function App() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
   

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
    <h1 className="title">🎸 SoundLens AI</h1>

    <p className="subtitle">
      Upload instrument image & detect sound
    </p>

    <label htmlFor="imageUpload" className="image-container">
      {selectedImage ? (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Preview"
          className="preview-image"
        />
      ) : (
        <div className="placeholder">
    

          <h3>Upload Instrument Image</h3>


          <span>Click to Browse</span>
        </div>
      )}
    </label>

    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      hidden
      onChange={handleImageChange}
    />

    <button
      className="detect-btn"
      onClick={detectObjects}
      disabled={loading}
    >
      {loading ? "Detecting..." : "Detect Instrument"}
    </button>

    <div className="result-box">
      {predictions.length === 0 ? (
        "No detections yet."
      ) : (
        predictions.map((item, index) => (
          <span key={index}>
            {item.class} ({item.confidence.toFixed(2)})
            {index !== predictions.length - 1 ? ", " : ""}
          </span>
        ))
      )}
    </div>
  </div>
</div>
);
}

export default App;