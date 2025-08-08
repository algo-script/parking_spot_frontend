// import React, { useState, useEffect } from "react";
// import Icon from "../../../components/AppIcon";

// const SearchBar = ({ onSearch, initialValue = "" }) => {
//   const [searchQuery, setSearchQuery] = useState(initialValue);
//   const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([
//     "Downtown San Francisco",
//     "Union Square",
//     "Fisherman's Wharf"
//   ]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   useEffect(() => {
//     setSearchQuery(initialValue);
//   }, [initialValue]);

//   const handleInputChange = (e) => {
//     setSearchQuery(e.target.value);
//     if (e.target.value.length > 0) {
//       setShowSuggestions(true);
//     } else {
//       setShowSuggestions(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSearch(searchQuery);
//     setShowSuggestions(false);
    
//     // Add to recent searches if not already there
//     if (searchQuery && !recentSearches.includes(searchQuery)) {
//       setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
//     }
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setSearchQuery(suggestion);
//     onSearch(suggestion);
//     setShowSuggestions(false);
//   };

//   const handleUseCurrentLocation = () => {
//     setIsUsingCurrentLocation(true);
    
//     // Simulate getting current location
//     setTimeout(() => {
//       setSearchQuery("Current Location");
//       onSearch("Current Location");
//       setIsUsingCurrentLocation(false);
//       setShowSuggestions(false);
//     }, 1000);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     onSearch("");
//     setShowSuggestions(false);
//   };

//   return (
//     <div className="relative">
//       <form onSubmit={handleSubmit} className="relative">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Icon name="MapPin" size={18} className="text-gray-500" />
//           </div>
          
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleInputChange}
//             placeholder="Search for parking near a location..."
//             className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
//             onFocus={() => searchQuery && setShowSuggestions(true)}
//             onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//           />
          
//           {searchQuery && (
//             <button
//               type="button"
//               className="absolute inset-y-0 right-12 flex items-center pr-1"
//               onClick={handleClearSearch}
//             >
//               <Icon name="X" size={16} className="text-gray-400 hover:text-gray-600" />
//             </button>
//           )}
          
//           <button
//             type="submit"
//             className="absolute inset-y-0 right-0 flex items-center pr-3"
//           >
//             <Icon name="Search" size={18} className="text-primary" />
//           </button>
//         </div>
//       </form>
      
//       {showSuggestions && (
//         <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
//           <div className="py-1">
//             <button
//               type="button"
//               onClick={handleUseCurrentLocation}
//               className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//             >
//               {isUsingCurrentLocation ? (
//                 <>
//                   <Icon name="Loader" size={16} className="mr-2 text-primary animate-spin" />
//                   <span>Getting your location...</span>
//                 </>
//               ) : (
//                 <>
//                   <Icon name="Locate" size={16} className="mr-2 text-primary" />
//                   <span>Use current location</span>
//                 </>
//               )}
//             </button>
            
//             {recentSearches.length > 0 && (
//               <>
//                 <div className="px-4 py-1 text-xs font-medium text-gray-500 bg-gray-50">
//                   Recent searches
//                 </div>
//                 {recentSearches.map((search, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleSuggestionClick(search)}
//                     className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//                   >
//                     <Icon name="Clock" size={16} className="mr-2 text-gray-400" />
//                     <span>{search}</span>
//                   </button>
//                 ))}
//               </>
//             )}
            
//             {searchQuery.length > 0 && (
//               <>
//                 <div className="px-4 py-1 text-xs font-medium text-gray-500 bg-gray-50">
//                   Suggestions
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => handleSuggestionClick(`${searchQuery} Downtown`)}
//                   className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//                 >
//                   <Icon name="MapPin" size={16} className="mr-2 text-gray-400" />
//                   <span>{searchQuery} Downtown</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleSuggestionClick(`${searchQuery} City Center`)}
//                   className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//                 >
//                   <Icon name="MapPin" size={16} className="mr-2 text-gray-400" />
//                   <span>{searchQuery} City Center</span>
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;
import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import axios from "axios";

const SearchBar = ({ onSearch, initialValue = "", setUserLocation, userLocation ,setSearchLocation,searchLocation}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  // const [recentSearches, setRecentSearches] = useState(
  //   JSON.parse(localStorage.getItem("recentSearches")) || []
  // );
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // console.log("searchQuery",searchQuery)
  // console.log("suggestions",suggestions)
  // console.log("searchLocation",searchLocation);
  

  // Ola Maps API key
  const OLA_MAPS_API_KEY = "Qb1tCYd0ghxhAyc3s1pB4AouMSrYYR8bf5X34TPE";

  // console.log("userLocation search", userLocation);

  // useEffect(() => {
  //   setSearchQuery(initialValue);
  // }, [initialValue]);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => {
  //       const newLocation = {
  //         lat: pos.coords.latitude,
  //         lon: pos.coords.longitude, // Use 'lon' to match your state structure
  //       };
  //       setUserLocation(newLocation);
  //     },
  //     (err) => {
  //       console.warn("Geolocation permission denied:", err);
  //       setUserLocation(null);
  //     }
  //   );
  // }, [userLocation]);

  // Fetch suggestions from Ola Maps API
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const params = {
          input: encodeURIComponent(searchQuery),
          api_key: OLA_MAPS_API_KEY,
        };

        // Add location biasing only if userLocation is fully defined
        if (userLocation && userLocation.lat && userLocation.lon) {
          params.location = `${userLocation.lat},${userLocation.lon}`;
          console.log("userLocation in fetchSuggestions", userLocation.lat, userLocation.lon);
        } else {
          console.log("Skipping location biasing: userLocation incomplete or null", userLocation);
        }

        const response = await axios.get(
          "https://api.olamaps.io/places/v1/autocomplete",
          { params }
        );

        const data = response.data;
        if (data.status === "ok" && data.predictions) {
          const formattedSuggestions = data.predictions.map((pred, index) => ({
            id: index,
            text: pred.description,
            // place_id: pred.place_id,
            geometry: {
              lng:pred.geometry.location.lng,
              lat:pred.geometry.location.lat
            }
          }));
          setSuggestions(formattedSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!searchQuery) return;

  //   try {
  //     const response = await axios.get(
  //       `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
  //         searchQuery
  //       )}&api_key=${OLA_MAPS_API_KEY}`
  //     );

  //     const data = response.data;
  //     if (data.status === "ok" && data.predictions && data.predictions.length > 0) {
  //       const topSuggestion = data.predictions[0];
  //       const detailsResponse = await axios.get(
  //         `https://api.olamaps.io/places/v1/details?place_id=${topSuggestion.place_id}&api_key=${OLA_MAPS_API_KEY}`
  //       );

  //       const detailsData = detailsResponse.data;
  //       if (detailsData.status === "ok" && detailsData.result.geometry) {
  //         const { lat, lng } = detailsData.result.geometry.location;
  //         const displayName = topSuggestion.description;
  //         onSearch({ query: displayName, lat, lng });
  //         addToRecentSearches(displayName);
  //         setUserLocation({ lat, lon: lng }); // Update user location
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error geocoding search query:", error);
  //   }
  //   setShowSuggestions(false);
  // };

  const handleSuggestionClick = async (suggestion) => {
    // console.log("suggestion",suggestion)
    try {
      const { lat, lng } = suggestion.geometry;
      setSearchQuery(suggestion.text);
      setSearchLocation({
        lat,lng
      });
      // Skip API call for recent searches without place_id
      // if (!suggestion.place_id) {
      //   onSearch({ query: suggestion.text, lat: null, lng: null });
      //   setSearchQuery(suggestion.text);
      //   setShowSuggestions(false);
      //   return;
      // }

      // const response = await axios.get(
      //   `https://api.olamaps.io/places/v1/details?place_id=${suggestion.place_id}&api_key=${OLA_MAPS_API_KEY}`
      // );

      // const data = response.data;
      // if (data.status === "ok" && data.result.geometry) {
      //   const { lat, lng } = data.result.geometry.location;
      //   setSearchQuery(suggestion.text);
      //   onSearch({ query: suggestion.text, lat, lng });
      //   addToRecentSearches(suggestion.text);
      //   setUserLocation({ lat, lon: lng }); // Update user location for consistency
      // }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
    setShowSuggestions(false);
  };

  // const addToRecentSearches = (search) => {
  //   if (search && !recentSearches.includes(search)) {
  //     const updatedSearches = [search, ...recentSearches].slice(0, 5);
  //     setRecentSearches(updatedSearches);
  //     localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  //   }
  // };

  const handleUseCurrentLocation = () => {
    setIsUsingCurrentLocation(true);
    setSearchQuery("Current Location");
    setSearchLocation(null)
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch({ query: "", lat: null, lng: null });
    setShowSuggestions(false);
    setSearchLocation(null)
  };
  // onSubmit={handleSubmit}

  return (
    <div className="relative">
      <form  className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="MapPin" size={18} className="text-gray-500" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for parking near a location..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            onFocus={() => setShowSuggestions(searchQuery.length > 0 )}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {searchQuery && (
            <button
              type="button"
              className="absolute inset-y-0 right-12 flex items-center pr-1"
              onClick={handleClearSearch}
            >
              <Icon name="X" size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}

          {/* <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon name="Search" size={18} className="text-primary" />
          </button> */}
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              {isUsingCurrentLocation ? (
                <>
                  <Icon name="Loader" size={16} className="mr-2 text-primary animate-spin" />
                  <span>Getting your location...</span>
                </>
              ) : (
                <>
                  <Icon name="Locate" size={16} className="mr-2 text-primary" />
                  <span>Use current location</span>
                </>
              )}
            </button>

            {/* {recentSearches.length > 0 && (
              <>
                <div className="px-4 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                  Recent searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick({ text: search, place_id: null })}
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    <Icon name="Clock" size={16} className="mr-2 text-gray-400" />
                    <span>{search}</span>
                  </button>
                ))}
              </>
            )} */}

            {suggestions.length > 0 && (
              <>
                <div className="px-4 py-1 text-xs font-modal text-gray-500 bg-gray-50">
                  Suggestions
                </div>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    <Icon name="MapPin" size={16} className="mr-2 text-gray-400" />
                    <span>{suggestion.text}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

// import React, { useState, useEffect } from "react";
// import Icon from "../../../components/AppIcon";
// import axios from "axios";

// const SearchBar = ({ onSearch, initialValue = "" }) => {
//   const [searchQuery, setSearchQuery] = useState(initialValue);
//   const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
//   const [recentSearches, setRecentSearches] = useState(
//     JSON.parse(localStorage.getItem("recentSearches")) || []
//   );
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
//     setSearchQuery(initialValue);
//   }, [initialValue]);
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({
//           lat: pos.coords.latitude,
//           lon: pos.coords.longitude,
//         });
//       },
//       (err) => {
//         console.warn("Geolocation permission denied:", err);
//         setUserLocation(null);
//       }
//     );
//   }, []);
  

//   // Fetch suggestions from Nominatim API
//   useEffect(() => {
//     if (searchQuery.length < 3) {
//       setSuggestions([]);
//       return;
//     }

//     // const fetchSuggestions = async () => {
//     //   try {
//     //     const response = await axios.get(
//     //       `https://nominatim.openstreetmap.org/search`,
//     //       {
//     //         params: {
//     //           q: searchQuery,
//     //           format: "json",
//     //           limit: 5,
//     //         },
//     //       }
//     //     );
//     //     setSuggestions(response.data);
//     //   } catch (error) {
//     //     console.error("Error fetching suggestions:", error);
//     //     setSuggestions([]);
//     //   }
//     // };
//     const fetchSuggestions = async () => {
//       try {
//         const params = {
//           q: searchQuery,
//           format: "json",
//           limit: 5,
//         };
    
//         // Add location biasing if user location is available
//         if (userLocation) {
//           params.lat = userLocation.lat;
//           params.lon = userLocation.lon;
//           params.addressdetails = 1;
//           params.extratags = 1;
//           params.namedetails = 1;
//         }
    
//         const response = await axios.get("https://nominatim.openstreetmap.org/search", {
//           params,
//         });
    
//         setSuggestions(response.data);
//       } catch (error) {
//         console.error("Error fetching suggestions:", error);
//         setSuggestions([]);
//       }
//     };
    

//     const debounce = setTimeout(fetchSuggestions, 300);
//     return () => clearTimeout(debounce);
//   }, [searchQuery]);

//   const handleInputChange = (e) => {
//     setSearchQuery(e.target.value);
//     setShowSuggestions(e.target.value.length > 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!searchQuery) return;

//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/search`,
//         {
//           params: {
//             q: searchQuery,
//             format: "json",
//             limit: 1,
//           },
//         }
//       );
//       if (response.data.length > 0) {
//         const { lat, lon, display_name } = response.data[0];
//         onSearch({ query: display_name, lat: parseFloat(lat), lng: parseFloat(lon) });
//         addToRecentSearches(display_name);
//       }
//     } catch (error) {
//       console.error("Error geocoding search query:", error);
//     }
//     setShowSuggestions(false);
//   };
// console.log("userLocation",userLocation)
//   const handleSuggestionClick = (suggestion) => {
//     const { lat, lon, display_name } = suggestion;
//     console.log(lat,lon)
//     setSearchQuery(display_name);
//     onSearch({ query: display_name, lat: parseFloat(lat), lng: parseFloat(lon) });
//     addToRecentSearches(display_name);
//     setShowSuggestions(false);
//     setUserLocation({
//       lat,
//       lon
//     });
//   };

//   const addToRecentSearches = (search) => {
//     if (search && !recentSearches.includes(search)) {
//       const updatedSearches = [search, ...recentSearches].slice(0, 5);
//       setRecentSearches(updatedSearches);
//       localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
//     }
//   };

//   const handleUseCurrentLocation = () => {
//     setIsUsingCurrentLocation(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const location = {
//           query: "Current Location",
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setSearchQuery("Current Location");
//         onSearch(location);
//         addToRecentSearches("Current Location");
//         setIsUsingCurrentLocation(false);
//         setShowSuggestions(false);
//       },
//       () => {
//         setIsUsingCurrentLocation(false);
//         setShowSuggestions(false);
//       }
//     );
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     onSearch({ query: "", lat: null, lng: null });
//     setShowSuggestions(false);
//   };

//   return (
//     <div className="relative">
//       <form onSubmit={handleSubmit} className="relative">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Icon name="MapPin" size={18} className="text-gray-500" />
//           </div>

//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleInputChange}
//             placeholder="Search for parking near a location..."
//             className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
//             onFocus={() => setShowSuggestions(searchQuery.length > 0 || recentSearches.length > 0)}
//             onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//           />

//           {searchQuery && (
//             <button
//               type="button"
//               className="absolute inset-y-0 right-12 flex items-center pr-1"
//               onClick={handleClearSearch}
//             >
//               <Icon name="X" size={16} className="text-gray-400 hover:text-gray-600" />
//             </button>
//           )}

//           <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
//             <Icon name="Search" size={18} className="text-primary" />
//           </button>
//         </div>
//       </form>

//       {showSuggestions && (
//         <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
//           <div className="py-1">
//             <button
//               type="button"
//               onClick={handleUseCurrentLocation}
//               className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//             >
//               {isUsingCurrentLocation ? (
//                 <>
//                   <Icon name="Loader" size={16} className="mr-2 text-primary animate-spin" />
//                   <span>Getting your location...</span>
//                 </>
//               ) : (
//                 <>
//                   <Icon name="Locate" size={16} className="mr-2 text-primary" />
//                   <span>Use current location</span>
//                 </>
//               )}
//             </button>

//             {recentSearches.length > 0 && (
//               <>
//                 <div className="px-4 py-1 text-xs font-medium text-gray-500 bg-gray-50">
//                   Recent searches
//                 </div>
//                 {recentSearches.map((search, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleSuggestionClick({ display_name: search, lat: null, lng: null })}
//                     className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//                   >
//                     <Icon name="Clock" size={16} className="mr-2 text-gray-400" />
//                     <span>{search}</span>
//                   </button>
//                 ))}
//               </>
//             )}

//             {suggestions.length > 0 && (
//               <>
//                 <div className="px-4 py-1 text-xs font-medium text-gray-500 bg-gray-50">
//                   Suggestions
//                 </div>
//                 {suggestions.map((suggestion, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleSuggestionClick(suggestion)}
//                     className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//                   >
//                     <Icon name="MapPin" size={16} className="mr-2 text-gray-400" />
//                     <span>{suggestion.display_name}</span>
//                   </button>
//                 ))}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;