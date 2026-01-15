import React from "react";
import "./ViewMaterial.css";

const ViewMaterial = ({ pdfPath }) => {
  return (
    <div className="view-material">
      <h2>View Material</h2>
      {pdfPath ? (
        <iframe
          title="PDF Document"
          src={pdfPath}
          width="100%"
          height="600px"
        />
      ) : (
        <p>No material available to view.</p>
      )}
    </div>
  );
};

export default ViewMaterial;
