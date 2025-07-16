import React from 'react';
import Icon from '../AppIcon';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary disabled:bg-primary disabled:bg-opacity-70',
    secondary: 'bg-white text-primary border border-primary hover:bg-gray-50 focus:ring-primary disabled:text-gray-400 disabled:border-gray-300',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary disabled:text-gray-400',
    text: 'bg-transparent text-primary hover:bg-gray-50 focus:ring-primary disabled:text-gray-400',
    danger: 'bg-error text-white hover:bg-red-700 focus:ring-error disabled:bg-error disabled:bg-opacity-70',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'cursor-not-allowed opacity-70' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <Icon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <Icon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="ml-2" />
      )}
    </button>
  );
};

export default Button;