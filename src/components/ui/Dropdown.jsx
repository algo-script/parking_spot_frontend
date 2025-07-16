import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === value);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className={`relative ${containerClassName}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <button
        type="button"
        className={`
          relative w-full bg-white border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-error' : 'border-gray-300'}
          ${className}
        `}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        {...props}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={18} className="text-gray-400" />
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <ul role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                className={`
                  cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100
                  ${option.value === value ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-900'}
                `}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option.value === value}
              >
                <span className="block truncate">
                  {option.label}
                </span>
                {option.value === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <Icon name="Check" size={16} className="text-primary" />
                  </span>
                )}
              </li>
            ))}
            
            {options.length === 0 && (
              <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">
                No options available
              </li>
            )}
          </ul>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;