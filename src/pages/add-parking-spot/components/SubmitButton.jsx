import React from "react";
import Icon from "../../../components/AppIcon";

const SubmitButton = ({ isSubmitting, onClick, isEdit = false }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isSubmitting}
      className={`w-full md:w-auto flex items-center justify-center px-6 py-3 rounded-md text-white font-medium transition-colors duration-200 ${
        isSubmitting
          ? "bg-primary-light cursor-not-allowed"
          : "bg-primary hover:bg-primary-dark"
      }`}
    >
      {isSubmitting ? (
        <>
          <Icon name="Loader" size={20} className="animate-spin mr-2" />
          <span>{isEdit ? "Updating..." : "Adding your spot..."}</span>
        </>
      ) : (
        <>
          <Icon name="Check" size={20} className="mr-2" />
          <span>{isEdit ? "Update Parking Spot" : "Add Parking Spot"}</span>
        </>
      )}
    </button>
  );
};

export default SubmitButton;