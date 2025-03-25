import React, { useState } from "react";
import axios from "axios";

export default function InpaitingTestPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [inpaintedImage, setInpaintedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modelType, setModelType] = useState("acne"); // Default to acne

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview of uploaded image
    setInpaintedImage(null); // Reset inpainted image
    setErrorMessage("");
  };

  // Handle model selection change
  const handleModelChange = (event) => {
    setModelType(event.target.value);
  };

  // Handle image upload and inpainting
  const handleUpload = async () => {
    if (!image) {
      setErrorMessage("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("model_type", modelType); // Send selected model type

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/inpaint/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API Response:", response.data);
      setInpaintedImage(`data:image/jpeg;base64,${response.data.cleaned_image}`); // Convert base64 to image

    } catch (error) {
      console.error("API Error:", error);
      setErrorMessage("Error processing image. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>AI-Powered Skin Care Inpainting</h2>

      {/* File Upload */}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />

      {/* Model Selection */}
      <label htmlFor="modelType" style={{ marginTop: "10px", display: "block" }}>Select Inpainting Model:</label>
      <select id="modelType" value={modelType} onChange={handleModelChange} style={{ padding: "5px", marginTop: "5px" }}>
        <option value="acne">Acne Removal</option>
        <option value="puffy_eyes">Puffy Eyes Removal</option>
      </select>

      {/* Preview of Uploaded Image */}
      {preview && (
        <div>
          <h4>Original Image</h4>
          <img src={preview} alt="Preview" style={{ width: "300px", marginTop: "10px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }} />
        </div>
      )}

      {/* Upload Button */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUpload} disabled={loading} style={{ padding: "10px", cursor: "pointer" }}>
          {loading ? "Processing..." : "Upload & Inpaint"}
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p style={{ color: "blue", marginTop: "10px" }}>Processing image... Please wait.</p>}

      {/* Error Message */}
      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}

      {/* Display Inpainted Image */}
      {inpaintedImage && (
        <div>
          <h4>Inpainted Image</h4>
          <img src={inpaintedImage} alt="Inpainted Result" style={{ width: "300px", marginTop: "10px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }} />
        </div>
      )}
    </div>
  );
}
