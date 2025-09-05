import React, { useEffect, useRef, useState, useContext } from "react";
import { OlaMaps } from "olamaps-web-sdk";
import Icon from "../../../components/AppIcon";
import { Mycontext } from "context/context";

const MapView = ({
  userLocation,
  parkingSpots,
  setUserLocation,
  onSpotClick,
  searchLocation,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const olaMapsRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const parkingmarkersRef = useRef([]);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [mapType, setMapType] = useState(null); // 'ola' or 'google'
  const API_KEY = import.meta.env.VITE_APP_MAP_APIKEY;
  const { country } = useContext(Mycontext);
  console.log(mapType);

  // Determine which map to use based on country
  useEffect(() => {
    if (country && country.toLowerCase() === "india") {
      setMapType("ola");
    } else if (country) {
      setMapType("google");
    }
  }, [country]);

  // Function to fetch current location
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position", position);
          setIsFetchingLocation(false);
          setLocationError(null);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setIsFetchingLocation(false);
          setLocationError(
            error.message ||
              "Unable to retrieve your location. Please check browser settings."
          );
        }
      );
    } else {
      setIsFetchingLocation(false);
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  // Initialize Ola Maps
  const initializeOlaMap = async () => {
    try {
      const olaMaps = new OlaMaps({ apiKey: API_KEY });
      olaMapsRef.current = olaMaps;

      const mapCenter = searchLocation ||
        userLocation || { lat: 37.7749, lng: -122.4194 };

      const map = olaMaps.init({
        container: mapContainerRef.current,
        style:
          "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        center: [mapCenter.lng, mapCenter.lat],
        zoom: 16,
      });

      mapInstanceRef.current = map;

      // Add user location marker (non-draggable)
      if (userLocation) {
        const userMarker = olaMaps
          .addMarker({
            offset: [0, 0],
            anchor: "bottom",
            color: "blue",
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: { width: 32, height: 32 },
            },
            draggable: false,
          })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map);
        markersRef.current = userMarker;
      }

      setIsMapInitialized(true);
    } catch (error) {
      console.error("Error initializing Ola Maps:", error);
      setLocationError("Failed to load map. Please try again.");
    }
  };

  // Initialize Google Maps
  const initializeGoogleMap = () => {
    try {
      const mapCenter = searchLocation ||
        userLocation || { lat: 37.7749, lng: -122.4194 };

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: mapCenter.lat, lng: mapCenter.lng },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
      });

      mapInstanceRef.current = map;
      googleMapRef.current = map;

      // Add user location marker
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: map,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new window.google.maps.Size(32, 32),
          },
          title: "Your Location",
        });
        markersRef.current = userMarker;
      }

      setIsMapInitialized(true);
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setLocationError("Failed to load map. Please try again.");
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

  // Update parking spot markers when parkingSpots changes
  useEffect(() => {
    if (!isMapInitialized || !mapInstanceRef.current) return;

    // Remove old parking markers
    if (mapType === "ola") {
      parkingmarkersRef.current.forEach((marker) => marker.remove());
    } else if (mapType === "google") {
      parkingmarkersRef.current.forEach((marker) => marker.setMap(null));
    }
    parkingmarkersRef.current = [];

    // Add new parking markers
    if (parkingSpots && Array.isArray(parkingSpots)) {
      parkingSpots.forEach((spot) => {
        const { location, name, isAvailable } = spot;
        const [longitude, latitude] = location.coordinates;

        if (mapType === "ola") {
          const marker = olaMapsRef.current
            .addMarker({
              offset: [0, 0],
              anchor: "bottom",
              color: `${isAvailable ? "green" : "gray"}`,
              icon: {
                url: `https://maps.google.com/mapfiles/ms/icons/${
                  isAvailable ? "green" : "gray"
                }-dot.png`,
                scaledSize: { width: 32, height: 32 },
              },
              draggable: false,
            })
            .setLngLat([longitude, latitude])
            .addTo(mapInstanceRef.current);

          // Add click event
          marker.getElement().addEventListener("click", () => {
            onSpotClick(spot._id);
          });

          parkingmarkersRef.current.push(marker);
        } else if (mapType === "google") {
          const marker = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstanceRef.current,
            icon: {
              url: `https://maps.google.com/mapfiles/ms/icons/${
                isAvailable ? "green" : "yellow"
              }-dot.png`,
              scaledSize: new window.google.maps.Size(32, 32),
            },
            title: name || "Parking Spot",
          });

          marker.addListener("click", () => {
            onSpotClick(spot._id);
          });

          parkingmarkersRef.current.push(marker);
        }
      });
    }
  }, [parkingSpots, isMapInitialized, onSpotClick, mapType]);

  // Sync map center with prop changes
  useEffect(() => {
    if (
      isMapInitialized &&
      mapInstanceRef.current &&
      markersRef.current &&
      (searchLocation || userLocation)
    ) {
      const center = searchLocation || userLocation;

      if (mapType === "ola") {
        mapInstanceRef.current.setCenter([center.lng, center.lat]);
        markersRef.current.setLngLat([center.lng, center.lat]);
      } else if (mapType === "google") {
        mapInstanceRef.current.setCenter({ lat: center.lat, lng: center.lng });
        markersRef.current.setPosition({ lat: center.lat, lng: center.lng });
      }
    }
  }, [searchLocation, userLocation, isMapInitialized, mapType]);

  // Handle zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      if (mapType === "ola") {
        mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
      } else if (mapType === "google") {
        mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      if (mapType === "ola") {
        mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
      } else if (mapType === "google") {
        mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Maps container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-lg overflow-hidden border border-gray-300"
      />

      {/* Map Controls */}
      {mapType === "ola" && (
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-[30]">
          <button
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Zoom in"
            onClick={handleZoomIn}
          >
            <Icon name="Plus" size={20} />
          </button>
          <button
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Zoom out"
            onClick={handleZoomOut}
          >
            <Icon name="Minus" size={20} />
          </button>
          <button
            className={`bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200 ${
              isFetchingLocation ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Center on my location"
            onClick={fetchCurrentLocation}
            disabled={isFetchingLocation}
          >
            {isFetchingLocation ? (
              <Icon name="Loader" size={20} className="animate-spin" />
            ) : (
              <Icon name="Locate" size={20} />
            )}
          </button>
        </div>
      )}
      {/* Map Legend */}
      <div className={`absolute top-3 ${
              mapType === "google" ? "right-14" : "right-4"
            } bg-white rounded-md shadow-md p-2 z-[30]`}>
        <div className="flex items-center text-xs mb-1">
          <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center text-xs">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              mapType === "google" ? "bg-yellow-400" : "bg-gray-400"
            }`}
          ></div>
          <span>Unavailable</span>
        </div>
      </div>

      {/* Location Error Message */}
      {locationError && (
        <div className="absolute top-4 right-4 bg-red-500 text-white rounded-md shadow-md p-2 z-[1000]">
          <div className="flex items-center text-xs">
            <Icon name="AlertTriangle" size={16} className="mr-2" />
            <span>{locationError}</span>
          </div>
          <button
            className="mt-2 text-xs underline"
            onClick={fetchCurrentLocation}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default MapView;

// import React, { useContext, useEffect, useRef, useState } from "react";
// import { OlaMaps } from "olamaps-web-sdk";
// import Icon from "../../../components/AppIcon";
// import { Mycontext } from "context/context";

// const MapView = ({
//   userLocation,
//   parkingSpots,
//   setUserLocation,
//   onSpotClick,
//   searchLocation,
// }) => {
//   const mapContainerRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const olaMapsRef = useRef(null);
//   const markersRef = useRef([]);
//   const parkingmarkersRef = useRef([]);
//   const [isMapInitialized, setIsMapInitialized] = useState(false);
//   const [isFetchingLocation, setIsFetchingLocation] = useState(false);
//   const [locationError, setLocationError] = useState(null);
//   const { country } = useContext(Mycontext)
//   const API_KEY = import.meta.env.VITE_APP_MAP_APIKEY;
//   const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

//   // Function to fetch current location
//   const fetchCurrentLocation = () => {
//     if (navigator.geolocation) {
//       setIsFetchingLocation(true);
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log("position", position);
//           setIsFetchingLocation(false);
//           setLocationError(null);
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           setIsFetchingLocation(false);
//           setLocationError(
//             error.message ||
//               "Unable to retrieve your location. Please check browser settings."
//           );
//         }
//       );
//     } else {
//       setIsFetchingLocation(false);
//       setLocationError("Geolocation is not supported by your browser.");
//     }
//   };

//   useEffect(() => {
//     const initializeMap = async () => {
//       try {
//         const olaMaps = new OlaMaps({ apiKey: API_KEY });
//         olaMapsRef.current = olaMaps;

//         const mapCenter = searchLocation || userLocation || { lat: 37.7749, lng: -122.4194 };

//         const map = olaMaps.init({
//           container: mapContainerRef.current,
//           style:
//             "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
//           center: [mapCenter.lng, mapCenter.lat],
//           zoom: 16,
//         });

//         mapInstanceRef.current = map;
//         // Add user location marker (non-draggable)
//         if (userLocation) {
//           const userMarker = olaMaps
//             .addMarker({
//               offset: [0, 0],
//               anchor: "bottom",
//               color: "blue",
//               icon: {
//                 url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//                 scaledSize: { width: 32, height: 32 },
//               },
//               draggable: false,
//             })
//             .setLngLat([userLocation.lng, userLocation.lat])
//             .addTo(map);
//           markersRef.current = userMarker;
//         }
//         setIsMapInitialized(true);
//       } catch (error) {
//         console.error("Error initializing Ola Maps:", error);
//         setLocationError("Failed to load map. Please try again.");
//       }
//     };

//     if (!isMapInitialized) {
//       initializeMap();
//     }
//   }, [searchLocation, userLocation]);
//   // Update parking spot markers when parkingSpots changes
//   useEffect(() => {
//     if (!isMapInitialized || !mapInstanceRef.current || !olaMapsRef.current)
//       return;

//     // Remove old parking markers
//     parkingmarkersRef.current.forEach((marker) => marker.remove());
//     parkingmarkersRef.current = [];

//     // Add new parking markers
//     if (parkingSpots && Array.isArray(parkingSpots)) {
//       parkingSpots.forEach((spot) => {
//         const { location, _id, name } = spot;
//         const [longitude, latitude] = location.coordinates;

//         const marker = olaMapsRef.current
//           .addMarker({
//             offset: [0, 0],
//             anchor: "bottom",
//             color: "green",
//             icon: {
//               url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
//               scaledSize: { width: 32, height: 32 },
//             },
//             draggable: false,
//           })
//           .setLngLat([longitude, latitude])
//           .addTo(mapInstanceRef.current);

//         // Add click event
//         marker.getElement().addEventListener("click", () => {
//           onSpotClick(spot._id);
//         });

//         parkingmarkersRef.current.push(marker);
//       });
//     }
//   }, [parkingSpots, isMapInitialized, onSpotClick]);

//   // Sync map center with prop changes
//   useEffect(() => {
//     if (
//       isMapInitialized &&
//       mapInstanceRef.current &&
//       markersRef.current &&
//       (searchLocation || userLocation)
//     ) {
//       const center = searchLocation || userLocation;
//       mapInstanceRef.current.setCenter([center.lng, center.lat]);
//       markersRef.current.setLngLat([center.lng, center.lat]);
//     }
//   }, [searchLocation, userLocation, isMapInitialized]);

//   return (
//     <div className="relative w-full h-full">
//       {/* Ola Maps container */}
//       <div
//         ref={mapContainerRef}
//         className="w-full h-full rounded-lg overflow-hidden border border-gray-300"
//       />

//       {/* Map Controls */}
//       <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-[30]">
//         <button
//           className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
//           aria-label="Zoom in"
//           onClick={() => {
//             if (mapInstanceRef.current) {
//               mapInstanceRef.current.setZoom(
//                 mapInstanceRef.current.getZoom() + 1
//               );
//             }
//           }}
//         >
//           <Icon name="Plus" size={20} />
//         </button>
//         <button
//           className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
//           aria-label="Zoom out"
//           onClick={() => {
//             if (mapInstanceRef.current) {
//               mapInstanceRef.current.setZoom(
//                 mapInstanceRef.current.getZoom() - 1
//               );
//             }
//           }}
//         >
//           <Icon name="Minus" size={20} />
//         </button>
//         <button
//           className={`bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200 ${
//             isFetchingLocation ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           aria-label="Center on my location"
//           onClick={fetchCurrentLocation}
//           disabled={isFetchingLocation}
//         >
//           {isFetchingLocation ? (
//             <Icon name="Loader" size={20} className="animate-spin" />
//           ) : (
//             <Icon name="Locate" size={20} />
//           )}
//         </button>
//       </div>

//       {/* Map Legend */}
//       <div className="absolute top-4 right-4 bg-white rounded-md shadow-md p-2 z-[30]">
//         <div className="flex items-center text-xs mb-1">
//           <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
//           <span>Available</span>
//         </div>
//         <div className="flex items-center text-xs">
//           <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
//           <span>Unavailable</span>
//         </div>
//       </div>

//       {/* Location Error Message */}
//       {locationError && (
//         <div className="absolute top-4 right-4 bg-red-500 text-white rounded-md shadow-md p-2 z-[1000]">
//           <div className="flex items-center text-xs">
//             <Icon name="AlertTriangle" size={16} className="mr-2" />
//             <span>{locationError}</span>
//           </div>
//           <button
//             className="mt-2 text-xs underline"
//             onClick={fetchCurrentLocation}
//           >
//             Retry
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapView;
