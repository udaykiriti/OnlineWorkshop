import React from "react";
import { useLocation } from "react-router-dom";

const ViewMaterial = () => {
  const location = useLocation();
  const { materialUrl } = location.state || { materialUrl: "" }; 

  return (
    <div>
      <h2>Workshop Material</h2>
      {materialUrl ? (
        <iframe
          src={materialUrl}
          title="Workshop Material"
          style={{ width: "100%", height: "600px" }}
        ></iframe>
      ) : (
        <p>No material available.</p>
      )}
    </div>
  );
};

export default ViewMaterial;
