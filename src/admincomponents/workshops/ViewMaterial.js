import React from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

const ViewMaterial = () => {
  const location = useLocation();
  const { materialUrl } = location.state || { materialUrl: "" }; 

  return (
    <AdminLayout>
      <h2>Workshop Material</h2>
      {materialUrl ? (
        <iframe
          src={materialUrl}
          title="Workshop Material"
          style={{ width: "100%", height: "600px", border: "1px solid #ccc", borderRadius: "8px" }}
        ></iframe>
      ) : (
        <p>No material available.</p>
      )}
    </AdminLayout>
  );
};

export default ViewMaterial;
