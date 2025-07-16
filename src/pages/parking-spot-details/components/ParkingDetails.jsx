import React from "react";
import Icon from "../../../components/AppIcon";

const ParkingDetails = ({ features }) => {
  const featuresList = [
    {
      name: "Type",
      value: features.covered ? "Covered" : "Uncovered",
      icon: features.covered ? "Umbrella" : "Sun"
    },
    {
      name: "Security",
      value: features.secured ? "Secured" : "Unsecured",
      icon: features.secured ? "Lock" : "Unlock"
    },
    {
      name: "CCTV",
      value: features.cctv ? "Available" : "Not available",
      icon: features.cctv ? "Video" : "VideoOff"
    },
    {
      name: "EV Charging",
      value: features.ev_charging ? "Available" : "Not available",
      icon: features.ev_charging ? "Zap" : "ZapOff"
    },
    {
      name: "Height Restriction",
      value: features.height_restriction,
      icon: "Ruler"
    },
    {
      name: "Size",
      value: features.size,
      icon: "Car"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {featuresList.map((feature) => (
        <div key={feature.name} className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
            <Icon name={feature.icon} size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{feature.name}</p>
            <p className="font-medium text-gray-900">{feature.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParkingDetails;