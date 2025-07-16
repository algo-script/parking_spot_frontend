import React, { forwardRef } from 'react';
import Icon from '../AppIcon';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  // Generate ID if not provided
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Base input classes
  const baseInputClasses = 'w-full rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent';
  
  // Error classes
  const errorClasses = error ? 'border-error focus:ring-error' : 'border-gray-300';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white';
  
  // Icon padding classes
  const iconPaddingClasses = icon 
    ? iconPosition === 'left' ?'pl-10' :'pr-10' :'';
  
  // Combine all input classes
  const inputClasses = `
    ${baseInputClasses}
    ${errorClasses}
    ${disabledClasses}
    ${iconPaddingClasses}
    ${className}
  `;
  
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name={icon} size={18} className="text-gray-500" />
          </div>
        )}
        
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          ref={ref}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon name={icon} size={18} className="text-gray-500" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon name="AlertCircle" size={18} className="text-error" />
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;