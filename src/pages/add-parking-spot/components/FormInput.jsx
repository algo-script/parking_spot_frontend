import React from "react";
import Icon from "../../../components/AppIcon";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  icon,
  multiline = false,
  rows = 4,
  inputMode,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name={icon} size={18} className="text-gray-500" />
          </div>
        )}
        
        {multiline ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2 ${
              icon ? "pl-10" : ""
            } border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ${
              error ? "border-error" : "border-gray-300"
            }`}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            inputMode={inputMode}
            className={`w-full px-3 py-2 ${
              icon ? "pl-10" : ""
            } border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ${
              error ? "border-error" : "border-gray-300"
            }`}
          />
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default FormInput;