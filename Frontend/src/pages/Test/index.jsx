import React, { useState } from "react";
import axios from "axios";

function TestPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detections, setDetections] = useState([]);
  const [labeledImage, setLabeledImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Preview the selected image
    setDetections([]); // Clear previous results
    setLabeledImage(null); // Reset labeled image
    setErrorMessage(""); // Reset error message
  };

  // Handle image upload using Axios
  const handleUpload = async () => {
    if (!image) {
      setErrorMessage("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Axios Response:", response.data);
      setDetections(response.data.detections);
      setLabeledImage(`data:image/jpeg;base64,${response.data.labeled_image}`); // Convert base64 to image

    } catch (error) {
      console.error("Axios Error:", error);
      setErrorMessage("Error uploading file. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>YOLOv8 Object Detection</h2>

      {/* File Upload */}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />

      {preview && (
        <div>
          <h4>Original Image</h4>
          <img src={preview} alt="Preview" style={{ width: "300px", marginTop: "10px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }} />
        </div>
      )}

      {/* Upload Button */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUpload} disabled={loading} style={{ padding: "10px", cursor: "pointer" }}>
          {loading ? "Uploading..." : "Upload & Detect"}
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p style={{ color: "blue", marginTop: "10px" }}>Processing image... Please wait.</p>}

      {/* Error Message */}
      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}

      {/* Detection Results */}
      <h3>Detection Results:</h3>
     

      {/* Display Labeled Image */}
      {labeledImage && (
        <div>
       
          <img src={labeledImage} alt="Labeled" style={{ width: "300px", marginTop: "10px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }} />
        </div>
      )}
    </div>
  );
}

export default TestPage;
