import React from "react";
import Icon from "../../components/AppIcon";

const TabSelector = ({ activeTab, onTabChange }) => {
  const tabs = [
    
    {
      id: "upcoming",
      label: "Upcoming",
      icon: "Calendar"
    },{
      id: "recent",
      label: "Recent",
      icon: "Clock"
    },
  ];


  return (
    <div className="bg-white rounded-lg shadow-sm p-1 flex">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium flex-1 transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-primary text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon
            name={tab.icon}
            size={16}
            className="mr-2"
          />
          <span className="hidden sm:block">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabSelector;