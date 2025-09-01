// export default SearchBar;
import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import axios from "axios";

const SearchBar = ({ onSearch, initialValue = "", setUserLocation, userLocation ,setSearchLocation,searchLocation}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  // const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Ola Maps API key
  const OLA_MAPS_API_KEY = "Qb1tCYd0ghxhAyc3s1pB4AouMSrYYR8bf5X34TPE";



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



  const handleSuggestionClick = async (suggestion) => {
  
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


  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch({ query: "", lat: null, lng: null });
    setShowSuggestions(false);
    setSearchLocation(null)
  };

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
              className="absolute inset-y-0 right-5 flex items-center pr-0"
              onClick={handleClearSearch}
            >
              <Icon name="X" size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0  && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1">
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