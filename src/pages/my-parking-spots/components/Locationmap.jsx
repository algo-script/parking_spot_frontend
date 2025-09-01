import React, { useRef, useEffect, useState } from "react";
import { OlaMaps } from "olamaps-web-sdk";

const Locationmap = ({ latitude, longitude ,name}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const olaMapsRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  // const [initialCoords, setInitialCoords] = useState({ lat: latitude, lng: longitude });

  const API_KEY = "Qb1tCYd0ghxhAyc3s1pB4AouMSrYYR8bf5X34TPE"; // Your OlaMaps API key

 
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const olaMaps = new OlaMaps({ apiKey: API_KEY });
        olaMapsRef.current = olaMaps;

        const map = olaMaps.init({
          container: mapContainerRef.current,
          style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          center: [longitude,latitude],
          zoom: 16,
        });

        mapInstanceRef.current = map;
        const marker = olaMaps
          .addMarker({
            offset: [0, 0],
            anchor: "bottom",
            color: "blue",
            draggable: false, 
            // title: name
          })
          .setLngLat([longitude,latitude])
          .addTo(map);
        markerRef.current = marker;

        setIsMapInitialized(true);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    if (!isMapInitialized &&latitude && longitude) {
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
  }, [latitude, longitude]); // Depend only on initialCoords to avoid reinitialization

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

export default Locationmap;
