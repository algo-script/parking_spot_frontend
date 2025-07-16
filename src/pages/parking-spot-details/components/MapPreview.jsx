import React from "react";

const MapPreview = ({ lat, lng, name }) => {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        title={name}
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
      ></iframe>
    </div>
  );
};

export default MapPreview;