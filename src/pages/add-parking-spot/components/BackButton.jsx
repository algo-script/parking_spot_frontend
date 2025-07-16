import React from "react";
import Icon from "../../../components/AppIcon";

const BackButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center text-gray-700 hover:text-primary transition-colors duration-200"
    >
      <Icon name="ArrowLeft" size={20} className="mr-1" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;