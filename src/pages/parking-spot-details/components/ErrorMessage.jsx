import React from "react";
import Icon from "../../../components/AppIcon";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4 text-center">
      <Icon name="AlertCircle" size={48} className="mx-auto text-error mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="btn btn-primary"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorMessage;