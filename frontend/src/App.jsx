import { useEffect, useState } from "react";
import ImageUpload from "./components/ImageUpload";
import DetectionCanvas from "./components/DetectionCanvas";
import PredictionList from "./components/PredictionList";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("connecting");
  const [statusMessage, setStatusMessage] = useState("Connecting to backend...");
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/");
        if (!response.ok) throw new Error("Backend not responding");
        const data = await response.json();
        setBackendStatus("connected");
        setStatusMessage(data.message || "Instrument AI is running");
      } catch (err) {
        console.error(err);
        setBackendStatus("failed");
        setStatusMessage("Backend connection failed. Make sure the FastAPI server is running.");
      }
    };

    checkBackend();
  }, []);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setPredictions(null);
    setError("");
  };

  const handleDetect = async () => {
    if (!selectedImage) return;

    setIsDetecting(true);
    setError("");
    setPredictions(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Detection failed with status: ${response.status}`);
      }

      const data = await response.json();
      setPredictions(data.predictions);
      setImgWidth(data.width);
      setImgHeight(data.height);
    } catch (err) {
      console.error(err);
      setError("Failed to run detection. Please check the backend connection and try again.");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <h1 className="app-title">Instrument AI</h1>
        <div className={`status-badge ${backendStatus}`}>
          <span className={`status-dot ${backendStatus}`} />
          {statusMessage}
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="app-main">
        {/* Step 1: Upload or Preview Area */}
        <section className="section-wrapper">
          {!selectedImage ? (
            <ImageUpload onImageSelect={handleImageSelect} selectedImage={selectedImage} />
          ) : (
            <div className="preview-grid">
              <DetectionCanvas
                image={selectedImage}
                predictions={predictions}
                originalWidth={imgWidth}
                originalHeight={imgHeight}
              />

              {/* Action Buttons & Status */}
              <div className="btn-group">
                <button
                  onClick={() => handleImageSelect(null)}
                  disabled={isDetecting}
                  className="btn-secondary"
                >
                  Change Image
                </button>

                <button
                  onClick={handleDetect}
                  disabled={isDetecting || backendStatus !== "connected"}
                  className="btn-primary"
                >
                  {isDetecting ? "Detecting..." : "Detect Objects"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Error Messages */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* Step 2: Predictions Results */}
        {selectedImage && (
          <section style={{ width: "100%", marginTop: "10px" }}>
            <PredictionList predictions={predictions} />
          </section>
        )}
      </main>
    </div>
  );
}
export default App;