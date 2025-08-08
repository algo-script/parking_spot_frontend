// import React from "react";

// const MapPreview = ({ lat, lng, name }) => {
//   return (
//     <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
//       <iframe
//         width="100%"
//         height="100%"
//         loading="lazy"
//         title={name}
//         referrerPolicy="no-referrer-when-downgrade"
//         src={`https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
//       ></iframe>
//     </div>
//   );
// };

// export default MapPreview;
import React, { useRef, useEffect, useState } from "react";
import { OlaMaps } from "olamaps-web-sdk";

const MapPreview = ({ latitude, longitude ,name}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const olaMapsRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [initialCoords, setInitialCoords] = useState({ lat: latitude, lng: longitude });

  const API_KEY = "Qb1tCYd0ghxhAyc3s1pB4AouMSrYYR8bf5X34TPE"; // Your OlaMaps API key

  // Initialize map and fixed marker
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const olaMaps = new OlaMaps({ apiKey: API_KEY });
        olaMapsRef.current = olaMaps;

        const map = olaMaps.init({
          container: mapContainerRef.current,
          style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          center: [initialCoords.lng, initialCoords.lat],
          zoom: 16,
        });

        mapInstanceRef.current = map;

        // Add fixed marker at center (not draggable)
        const marker = olaMaps
          .addMarker({
            offset: [0, 0],
            anchor: "bottom",
            color: "blue",
            draggable: false, // Marker stays fixed at center
            // title: name
          })
          .setLngLat([initialCoords.lng, initialCoords.lat])
          .addTo(map);
        markerRef.current = marker;

        setIsMapInitialized(true);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    if (!isMapInitialized && initialCoords.lat && initialCoords.lng) {
      initializeMap();
    }

    // Cleanup on unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [initialCoords]); // Depend only on initialCoords to avoid reinitialization

  // Sync map center and marker with prop changes
  useEffect(() => {
    if (isMapInitialized && mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setCenter([longitude, latitude]);
      markerRef.current.setLngLat([longitude, latitude]);
    }
  }, [latitude, longitude, isMapInitialized]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-64 rounded-lg overflow-hidden border border-gray-200"
    />
  );
};

export default MapPreview;
