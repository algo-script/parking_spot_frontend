import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const BackButton = () => {
  return (
    <Link
      to="/home-search-screen"
      className="inline-flex items-center text-gray-700 hover:text-primary transition-colors duration-200"
    >
      <Icon name="ArrowLeft" size={20} className="mr-1" />
      <span className="font-medium">Back to search</span>
    </Link>
  );
};

export default BackButton;