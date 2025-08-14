import Icon from "components/AppIcon";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addVehicle,
  getVehicle,
  setDefaultVehicle,
  upadateVehicle,
} from "utils/helperFunctions";

const VehiclesTabWrapper = ({ user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    type: "",
    brand: "",
    model: "",
    color: "",
    isElectric: false,
    defaultVehicle: false,
  });
  const [errors, setErrors] = useState({});
  // console.log("formData",formData);

  const fetchVehicles = async () => {
    try {
      const response = await getVehicle();
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };
  // Load user's vehicles
  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleNumber.trim())
      newErrors.vehicleNumber = "Vehicle number is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.type.trim()) newErrors.type = "Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      let response;
      if (isEditing && currentVehicleId) {
        response = await upadateVehicle({ ...formData, currentVehicleId });
      } else {
        response = await addVehicle(formData);
      }
      if (response.success) {
        toast.success(response.message);
        setIsAdding(false);
        setFormData({
          vehicleNumber: "",
          type: "",
          brand: "",
          model: "",
          color: "",
          isElectric: false,
          defaultVehicle: false,
        });
        fetchVehicles();
      }
    } catch (error) {
      console.error("Failed to add vehicle:", error);
    }
  };

  // const handleDelete = async (vehicleId) => {
  //   try {
  //     // await deleteVehicle(vehicleId);
  //     setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  //   } catch (error) {
  //     console.error("Failed to delete vehicle:", error);
  //   }
  // };

  const setAsDefault = async (vehicleId) => {
    try {
      const response = await setDefaultVehicle({ vehicleId });
      if (response.success) {
        toast.success(response.message);
        fetchVehicles();
      }
    } catch (error) {
      console.error("Failed to set default vehicle:", error);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      color: vehicle.color,
      isElectric: vehicle.isElectric,
      defaultVehicle: vehicle.defaultVehicle,
    });
    setCurrentVehicleId(vehicle._id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handlecancel = () => {
    setFormData({
      vehicleNumber: "",
      type: "",
      brand: "",
      model: "",
      color: "",
      isElectric: false,
      defaultVehicle: false,
    });
    setCurrentVehicleId(null);
    setIsEditing(false);
    setIsAdding(false);
  };

  return (
    <div className="p-3 sm:p-4">
      <div className="flex flex-row justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800">
          My Vehicles
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <Icon name="Plus" size={16} className="mr-1 md:mr-2" />
          <span className="text-sm md:text-base">
            <span className="md:hidden">Add</span>
            <span className="hidden md:inline">Add Vehicle</span>
          </span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:shadow-md mb-6 sm:mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="vehicleNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.vehicleNumber ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="e.g. ABC1234"
                />
                {errors.vehicleNumber && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {errors.vehicleNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Type *
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="e.g. Sedan, SUV"
                />
                {errors.type && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {errors.type}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.brand ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="e.g. Toyota"
                />
                {errors.brand && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {errors.brand}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.model ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="e.g. Camry"
                />
                {errors.model && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {errors.model}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. Red"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isElectric"
                    name="isElectric"
                    checked={formData.isElectric}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isElectric"
                    className="ml-2 block text-xs sm:text-sm text-gray-700"
                  >
                    Electric Vehicle
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="defaultVehicle"
                    name="defaultVehicle"
                    checked={formData.defaultVehicle}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="defaultVehicle"
                    className="ml-2 block text-xs sm:text-sm text-gray-700"
                  >
                    Set as default
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sm:space-x-3 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={handlecancel}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 sm:px-4 sm:py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm sm:text-base"
              >
                {isEditing ? "Update" : "Save"} Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {vehicles.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white p-3 sm:p-4 rounded-lg shadow-xs sm:shadow-sm border border-gray-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="flex gap-1 sm:gap-2">
                      {vehicle.defaultVehicle && (
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                      {vehicle.isElectric && (
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Electric
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {vehicle.type}
                    </div>
                    <div>
                      <span className="font-medium">Number:</span>{" "}
                      {vehicle.vehicleNumber}
                    </div>
                    <div>
                      <span className="font-medium">Color:</span>{" "}
                      {vehicle.color || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 sm:gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="p-1 sm:p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit vehicle"
                    aria-label="Edit vehicle"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  {!vehicle.defaultVehicle && (
                    <button
                      onClick={() => setAsDefault(vehicle._id)}
                      className="p-1 sm:p-2 text-gray-500 hover:text-primary transition-colors"
                      title="Set as default"
                    >
                      <Icon name="Star" size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <div className="bg-gray-50 p-4 sm:p-8 rounded-lg text-center border border-gray-200">
            <Icon name="Car" size={40} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
              No vehicles added yet
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              Add your first vehicle to get started
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm sm:text-base"
            >
              Add Vehicle
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default VehiclesTabWrapper;
