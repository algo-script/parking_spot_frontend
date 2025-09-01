import Icon from "components/AppIcon";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addVehicle,
  getVehicle,
  setDefaultVehicle,
  upadateVehicle,
} from "utils/helperFunctions";
import Button from "components/ui/Button";
import Input from "components/ui/Input";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Vehicle type is required";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

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
        setCurrentVehicleId(null);
        setIsEditing(false);
        fetchVehicles();
      } else {
        toast.error(response.message || `Failed to ${isEditing ? 'update' : 'add'} vehicle`);
      }
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      toast.error(`An error occurred while ${isEditing ? 'updating' : 'adding'} the vehicle`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setAsDefault = async (vehicleId) => {
    try {
      const response = await setDefaultVehicle({ vehicleId });
      if (response.success) {
        toast.success(response.message);
        fetchVehicles();
      }
    } catch (error) {
      console.error("Failed to set default vehicle:", error);
      toast.error("Failed to set default vehicle");
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

  const handleCancel = () => {
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
    setErrors({});
  };

  return (
    <div className="p-3 sm:p-4">
      <div className="flex flex-row justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800">
          My Vehicles
        </h2>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant="primary"
            className="flex items-center"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            <span className="hidden md:inline">Add Vehicle</span>
            <span className="md:hidden">Add</span>
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number *
                </label>
                <Input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. ABC1234"
                  className="w-full"
                />
                {errors.vehicleNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.vehicleNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type *
                </label>
                <Input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="e.g. Sedan, SUV"
                  className="w-full"
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <Input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. Toyota"
                  className="w-full"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.brand}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model *
                </label>
                <Input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g. Camry"
                  className="w-full"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.model}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <Input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g. Red"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:col-span-2">
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
                  className="ml-2 block text-sm text-gray-700"
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
                  className="ml-2 block text-sm text-gray-700"
                >
                  Set as default
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditing ? "Updating..." : "Adding...") 
                  : (isEditing ? "Update Vehicle" : "Save Vehicle")
                }
              </Button>
            </div>
          </form>
        </div>
      )}

      {vehicles.length > 0 ? (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="flex gap-2">
                      {vehicle.defaultVehicle && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                      {vehicle.isElectric && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Electric
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
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

                <div className="flex gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit vehicle"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  {!vehicle.defaultVehicle && (
                    <button
                      onClick={() => setAsDefault(vehicle._id)}
                      className="p-2 text-gray-500 hover:text-primary transition-colors"
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
          <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
            <Icon name="Car" size={40} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No vehicles added yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Add your first vehicle to get started
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              variant="primary"
            >
              Add Vehicle
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default VehiclesTabWrapper;
