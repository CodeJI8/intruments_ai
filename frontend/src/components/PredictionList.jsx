import "./PredictionList.css";

function PredictionList({ predictions }) {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="empty-predictions">
        No objects detected yet. Select an image and run detection.
      </div>
    );
  }

  // Helper to color class badges based on name hash
  const getColor = (cls) => {
    const hash = cls.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 45%)`;
  };

  return (
    <div className="predictions-wrapper">
      <h3 className="predictions-title">
        Detection Results ({predictions.length})
      </h3>
      <div className="predictions-scroll-container">
        {predictions.map((pred, index) => {
          const badgeColor = getColor(pred.class);
          return (
            <div
              key={index}
              className="prediction-item"
              style={{ borderLeft: `5px solid ${badgeColor}` }}
            >
              <span className="prediction-class-name">
                {pred.class}
              </span>
              <div className="prediction-stats">
                <span className="prediction-percentage">
                  {Math.round(pred.confidence * 100)}% Match
                </span>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${pred.confidence * 100}%`,
                      backgroundColor: badgeColor,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PredictionList;
