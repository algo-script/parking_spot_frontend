import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";

const SearchBar = ({ onSearch, initialValue = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Downtown San Francisco",
    "Union Square",
    "Fisherman's Wharf"
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
    
    // Add to recent searches if not already there
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleUseCurrentLocation = () => {
    setIsUsingCurrentLocation(true);
    
    // Simulate getting current location
    setTimeout(() => {
      setSearchQuery("Current Location");
      onSearch("Current Location");
      setIsUsingCurrentLocation(false);
      setShowSuggestions(false);
    }, 1000);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
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
            onFocus={() => searchQuery && setShowSuggestions(true)}
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
          
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Icon name="Search" size={18} className="text-primary" />
          </button>
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
            
            {recentSearches.length > 0 && (
              <>
                <div className="px-4 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                  Recent searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(search)}
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    <Icon name="Clock" size={16} className="mr-2 text-gray-400" />
                    <span>{search}</span>
                  </button>
                ))}
              </>
            )}
            
            {searchQuery.length > 0 && (
              <>
                <div className="px-4 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                  Suggestions
                </div>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(`${searchQuery} Downtown`)}
                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  <Icon name="MapPin" size={16} className="mr-2 text-gray-400" />
                  <span>{searchQuery} Downtown</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(`${searchQuery} City Center`)}
                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  <Icon name="MapPin" size={16} className="mr-2 text-gray-400" />
                  <span>{searchQuery} City Center</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;