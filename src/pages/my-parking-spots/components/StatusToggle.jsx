import React from "react";

const StatusToggle = ({ isAvailable, onChange }) => {
  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      <span className="text-xs mr-2 font-medium text-gray-700">
        {isAvailable ? 'Available' : 'Unavailable'}
      </span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
          isAvailable ? 'bg-primary' : 'bg-gray-300'
        }`}
        role="switch"
        aria-checked={isAvailable}
        onClick={onChange}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isAvailable ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default StatusToggle;