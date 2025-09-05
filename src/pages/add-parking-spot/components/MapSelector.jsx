import React, { useRef, useEffect, useState, useContext } from "react";
import { OlaMaps } from "olamaps-web-sdk";
import { Mycontext } from "context/context";

const MapSelector = ({ latitude, longitude, onPositionChange }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const olaMapsRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapType, setMapType] = useState(null); // 'ola' or 'google'
  const { country } = useContext(Mycontext);

  const API_KEY = import.meta.env.VITE_APP_MAP_APIKEY; // Your OlaMaps API key

  // Determine which map to use based on country
  useEffect(() => {
    if (country && country.toLowerCase() === "india") {
      setMapType("ola");
    } else if(country){
      setMapType("google");
    }
  }, [country]);


  // Initialize Ola Map
  const initializeOlaMap = async () => {
    try {
      const olaMaps = new OlaMaps({ apiKey: API_KEY });
      olaMapsRef.current = olaMaps;

      const map = olaMaps.init({
        container: mapContainerRef.current,
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        center: [longitude, latitude],
        zoom: 16,
      });

      mapInstanceRef.current = map;

      // Add fixed marker at center (draggable)
      const marker = olaMaps
        .addMarker({
          offset: [0, 0],
          anchor: "bottom",
          color: "blue",
          draggable: true,
        })
        .setLngLat([longitude, latitude])
        .addTo(map);
      markerRef.current = marker;

      // Handle marker drag end to update coordinates
      marker.on("dragend", async () => {
        const { lng, lat } = marker.getLngLat();
        onPositionChange(lat, lng);
      });

      setIsMapInitialized(true);
    } catch (error) {
      console.error("Error initializing Ola Maps:", error);
    }
  };

  // Initialize Google Map
  const initializeGoogleMap = () => {
    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
      });

      mapInstanceRef.current = map;

      // Add draggable marker
      const marker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        draggable: true,
        title: "Selected Location",
      });

      markerRef.current = marker;

      // Handle marker drag end to update coordinates
      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        onPositionChange(position.lat(), position.lng());
      });

      setIsMapInitialized(true);
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
    }
  };

  // Initialize map based on type
  useEffect(() => {
    if (!isMapInitialized && mapType) {
      if (mapType === "ola") {
        initializeOlaMap();
      } else if (mapType === "google" && window.google) {
        initializeGoogleMap();
      }
    }
  }, [mapType, isMapInitialized]);

  // Sync map center and marker with prop changes
  useEffect(() => {
    if (isMapInitialized && mapInstanceRef.current && markerRef.current) {
      if (mapType === "ola") {
        mapInstanceRef.current.setCenter([longitude, latitude]);
        markerRef.current.setLngLat([longitude, latitude]);
      } else if (mapType === "google") {
        mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
        markerRef.current.setPosition({ lat: latitude, lng: longitude });
      }
    }
  }, [latitude, longitude, isMapInitialized, mapType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        if (mapType === "ola") {
          markerRef.current.remove();
        } else if (mapType === "google") {
          markerRef.current.setMap(null);
        }
      }
      if (mapInstanceRef.current && mapType === "ola") {
        mapInstanceRef.current.remove();
      }
    };
  }, [mapType]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-lg overflow-hidden border border-gray-300"
    />
  );
};

export default MapSelector;

// Load Google Maps script if needed
  // useEffect(() => {
  //   if (mapType === "google" && !window.google) {
  //     const script = document.createElement("script");
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
  //     script.async = true;
  //     script.defer = true;
  //     document.head.appendChild(script);
      
  //     script.onload = () => {
  //       if (!isMapInitialized) {
  //         initializeGoogleMap();
  //       }
  //     };
  //   }
  // }, [mapType, GOOGLE_MAPS_API_KEY]);

  // import React, { useRef, useEffect, useState } from "react";
// import { OlaMaps } from "olamaps-web-sdk";

// const MapSelector = ({ latitude, longitude, onPositionChange }) => {
//   const mapContainerRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const olaMapsRef = useRef(null);
//   const markerRef = useRef(null);
//   const [isMapInitialized, setIsMapInitialized] = useState(false);

//   const API_KEY = import.meta.env.VITE_APP_MAP_APIKEY; // Your OlaMaps API key

//   // Initialize map and fixed marker
//   useEffect(() => {
    
//     const initializeMap = async () => {
//       try {
//         const olaMaps = new OlaMaps({ apiKey: API_KEY });
//         olaMapsRef.current = olaMaps;

//         const map = olaMaps.init({
//           container: mapContainerRef.current,
//           style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
//           center: [longitude, latitude],
//           zoom: 16,
//         });

//         mapInstanceRef.current = map;

//         // Add fixed marker at center (not draggable)
//         const marker = olaMaps
//           .addMarker({
//             offset: [0, 0],
//             anchor: "bottom",
//             color: "blue",
//             draggable: true, // Marker stays fixed at center
//           })
//           .setLngLat([longitude, latitude])
//           .addTo(map);
//         markerRef.current = marker;

//         // Handle marker drag end to update coordinates and address
//         marker.on("dragend", async () => {
//           const { lng, lat } = marker.getLngLat();
//           onPositionChange(lat, lng);        
//         });

//         setIsMapInitialized(true);
//       } catch (error) {
//         console.error("Error initializing map:", error);
//       }
//     };

//     if (!isMapInitialized ) {
//       initializeMap();
//     }

//     // Cleanup on unmount
//     return () => {
//       if (markerRef.current) {
//         markerRef.current.remove();
//       }
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//       }
//     };
//   }, []); // Depend only on initialCoords to avoid reinitialization

//   // Sync map center and marker with prop changes
//   useEffect(() => {
//     if (isMapInitialized && mapInstanceRef.current && markerRef.current) {
//       mapInstanceRef.current.setCenter([longitude, latitude]);
//       markerRef.current.setLngLat([longitude, latitude]);
//     }
//   }, [latitude, longitude, isMapInitialized]);

//   return (
//     <div
//       ref={mapContainerRef}
//       className="w-full h-full rounded-lg overflow-hidden border border-gray-300"
//     />
//   );
// };

// export default MapSelector;