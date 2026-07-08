import { useState, useEffect, useRef } from "react";
import "./DetectionCanvas.css";

function DetectionCanvas({ image, predictions, originalWidth, originalHeight }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [renderedDims, setRenderedDims] = useState({ width: 0, height: 0, left: 0, top: 0 });

  const updateRenderedDimensions = () => {
    const img = imageRef.current;
    if (!img) return;

    // Get actual displayed dimensions and offsets of the image inside the container
    const rect = img.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setRenderedDims({
      width: rect.width,
      height: rect.height,
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateRenderedDimensions);
    return () => window.removeEventListener("resize", updateRenderedDimensions);
  }, []);

  const imageUrl = image ? URL.createObjectURL(image) : "";

  // Dynamic colors for bounding boxes
  const getColor = (cls) => {
    const hash = cls.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 85%, 60%)`;
  };

  return (
    <div ref={containerRef} className="canvas-container">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Detection source"
        onLoad={updateRenderedDimensions}
        className="detection-img"
      />

      {predictions && predictions.map((pred, index) => {
        if (!pred.bbox || !originalWidth || !originalHeight) return null;

        const scaleX = renderedDims.width / originalWidth;
        const scaleY = renderedDims.height / originalHeight;

        const x1 = pred.bbox[0] * scaleX + renderedDims.left;
        const y1 = pred.bbox[1] * scaleY + renderedDims.top;
        const w = (pred.bbox[2] - pred.bbox[0]) * scaleX;
        const h = (pred.bbox[3] - pred.bbox[1]) * scaleY;

        const color = getColor(pred.class);

        return (
          <div
            key={index}
            className="bbox-rect"
            style={{
              left: `${x1}px`,
              top: `${y1}px`,
              width: `${w}px`,
              height: `${h}px`,
              borderColor: color,
              borderWidth: "3px",
              borderStyle: "solid",
            }}
          >
            <span
              className="bbox-label"
              style={{
                backgroundColor: color,
              }}
            >
              {pred.class} ({Math.round(pred.confidence * 100)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default DetectionCanvas;
