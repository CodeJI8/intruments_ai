import { useState, useRef } from "react";
import "./ImageUpload.css";

function ImageUpload({ onImageSelect, selectedImage }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (!selectedImage) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-container">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`dropzone ${isDragActive ? "active" : ""} ${selectedImage ? "selected" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {selectedImage ? (
          <div className="preview-container">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="preview-img"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect(null);
              }}
              className="btn-remove-img"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="upload-icon"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <div className="upload-text">
              Drag and drop your image here, or{" "}
              <span className="browse-link">browse</span>
            </div>
            <div className="upload-support-text">
              Supports PNG, JPG, JPEG, WEBP
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
