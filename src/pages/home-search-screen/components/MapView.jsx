import React, { useEffect, useRef, useState } from "react";
import { OlaMaps } from "olamaps-web-sdk";
import Icon from "../../../components/AppIcon";

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
  const markersRef = useRef([]);
  const parkingmarkersRef = useRef([]);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const API_KEY = "Qb1tCYd0ghxhAyc3s1pB4AouMSrYYR8bf5X34TPE";

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


  useEffect(() => {
    const initializeMap = async () => {
      try {
        const olaMaps = new OlaMaps({ apiKey: API_KEY });
        olaMapsRef.current = olaMaps;

        const mapCenter = searchLocation || userLocation || { lat: 37.7749, lng: -122.4194 };

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

    if (!isMapInitialized) {
      initializeMap();
    }
  }, [searchLocation, userLocation]);
  // Update parking spot markers when parkingSpots changes
  useEffect(() => {
    if (!isMapInitialized || !mapInstanceRef.current || !olaMapsRef.current)
      return;

    // Remove old parking markers
    parkingmarkersRef.current.forEach((marker) => marker.remove());
    parkingmarkersRef.current = [];

    // Add new parking markers
    if (parkingSpots && Array.isArray(parkingSpots)) {
      parkingSpots.forEach((spot) => {
        const { location, _id, name } = spot;
        const [longitude, latitude] = location.coordinates;

        const marker = olaMapsRef.current
          .addMarker({
            offset: [0, 0],
            anchor: "bottom",
            color: "green",
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
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
      });
    }
  }, [parkingSpots, isMapInitialized, onSpotClick]);

  // Sync map center with prop changes
  useEffect(() => {
    if (
      isMapInitialized &&
      mapInstanceRef.current &&
      markersRef.current &&
      (searchLocation || userLocation)
    ) {
      const center = searchLocation || userLocation;
      mapInstanceRef.current.setCenter([center.lng, center.lat]);
      markersRef.current.setLngLat([center.lng, center.lat]);
    }
  }, [searchLocation, userLocation, isMapInitialized, fetchCurrentLocation]);

  return (
    <div className="relative w-full h-full">
      {/* Ola Maps container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-lg overflow-hidden border border-gray-300"
      />

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-[30]">
        <button
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Zoom in"
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(
                mapInstanceRef.current.getZoom() + 1
              );
            }
          }}
        >
          <Icon name="Plus" size={20} />
        </button>
        <button
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Zoom out"
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(
                mapInstanceRef.current.getZoom() - 1
              );
            }
          }}
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

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-md shadow-md p-2 z-[30]">
        <div className="flex items-center text-xs mb-1">
          <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
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
// import React, { useEffect, useRef, useState } from "react";
// import { OlaMaps } from "olamaps-web-sdk";
// import Icon from "../../../components/AppIcon";

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
//   const googleMapsRef = useRef(null);
//   const markersRef = useRef(null);
//   const parkingmarkersRef = useRef([]);
//   const [isMapInitialized, setIsMapInitialized] = useState(false);
//   const [mapProvider, setMapProvider] = useState(null); // "ola" | "google"
//   const [isFetchingLocation, setIsFetchingLocation] = useState(false);
//   const [locationError, setLocationError] = useState(null);

//   const OLA_API_KEY = "Qb1tCYd0ghxhAyc3s1pB4AouMSrYYR8bf5X34TPE";
//   const GOOGLE_API_KEY = "";

//   // Fetch current location
//   const fetchCurrentLocation = () => {
//     if (navigator.geolocation) {
//       setIsFetchingLocation(true);
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
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

//   // Detect country once at mount
//   useEffect(() => {
//     const detectCountry = async () => {
//       try {
//         const res = await fetch("https://ipapi.co/json/"); // free IP API
  
        
//         const data = await res.json();
//         console.log(data);
//         if (data && data.country_code === "IN") {
//           setMapProvider("ola");
//         } else {
//           setMapProvider("google");
//         }
//       } catch (err) {
//         console.error("Country detection failed, fallback to Google:", err);
//         setMapProvider("google");
//       }
//     };

//     detectCountry();
//   }, []);

//   // Initialize Ola Map
//   useEffect(() => {
//     if (mapProvider !== "ola" || isMapInitialized) return;

//     try {
//       const olaMaps = new OlaMaps({ apiKey: OLA_API_KEY });
//       olaMapsRef.current = olaMaps;

//       const mapCenter =
//         searchLocation || userLocation || { lat: 28.6139, lng: 77.209 }; // Delhi default

//       const map = olaMaps.init({
//         container: mapContainerRef.current,
//         style:
//           "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
//         center: [mapCenter.lng, mapCenter.lat],
//         zoom: 16,
//       });

//       mapInstanceRef.current = map;

//       // Add user marker
//       if (userLocation) {
//         const userMarker = olaMaps
//           .addMarker({
//             offset: [0, 0],
//             anchor: "bottom",
//             color: "blue",
//             icon: {
//               url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//               scaledSize: { width: 32, height: 32 },
//             },
//           })
//           .setLngLat([userLocation.lng, userLocation.lat])
//           .addTo(map);
//         markersRef.current = userMarker;
//       }
//       setIsMapInitialized(true);
//     } catch (err) {
//       console.error("Error initializing Ola Maps:", err);
//       setLocationError("Failed to load Ola Maps.");
//     }
//   }, [mapProvider, searchLocation, userLocation, isMapInitialized]);

//   // Initialize Google Map
//   useEffect(() => {
//     if (mapProvider !== "google" || isMapInitialized) return;

//     const loadGoogleMaps = () => {
//       return new Promise((resolve) => {
//         if (window.google && window.google.maps) {
//           resolve();
//         } else {
//           const script = document.createElement("script");
//           script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
//           script.async = true;
//           script.onload = resolve;
//           document.body.appendChild(script);
//         }
//       });
//     };

//     loadGoogleMaps().then(() => {
//       const center =
//         searchLocation || userLocation || { lat: 37.7749, lng: -122.4194 };

//       const map = new window.google.maps.Map(mapContainerRef.current, {
//         center,
//         zoom: 16,
//       });

//       mapInstanceRef.current = map;

//       if (userLocation) {
//         markersRef.current = new window.google.maps.Marker({
//           position: userLocation,
//           map,
//           icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//         });
//       }

//       setIsMapInitialized(true);
//     });
//   }, [mapProvider, searchLocation, userLocation, isMapInitialized]);

//   // Update center when location/search changes
//   useEffect(() => {
//     if (!isMapInitialized || !mapInstanceRef.current) return;

//     const center = searchLocation || userLocation;
//     if (!center) return;

//     if (mapProvider === "ola") {
//       mapInstanceRef.current.setCenter([center.lng, center.lat]);
//       if (markersRef.current) {
//         markersRef.current.setLngLat([center.lng, center.lat]);
//       }
//     } else if (mapProvider === "google") {
//       mapInstanceRef.current.setCenter(center);
//       if (markersRef.current) {
//         markersRef.current.setPosition(center);
//       }
//     }
//   }, [searchLocation, userLocation, isMapInitialized, mapProvider]);

//   return (
//     <div className="relative w-full h-full">
//       <div
//         ref={mapContainerRef}
//         className="w-full h-full rounded-lg overflow-hidden border border-gray-300"
//       />
//       {/* Floating Controls */}
//       <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-[30]">
//         <button
//           onClick={fetchCurrentLocation}
//           className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
//         >
//           {isFetchingLocation ? (
//             <Icon name="Loader" size={20} className="animate-spin" />
//           ) : (
//             <Icon name="Locate" size={20} />
//           )}
//         </button>
//       </div>
//       {locationError && (
//         <div className="absolute top-4 right-4 bg-red-500 text-white rounded-md p-2 z-[1000]">
//           {locationError}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapView;
