
import React, { useState, useEffect } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import { addGuardDetails, updateGuardDetails } from "utils/helperFunctions";
import { toast } from "react-toastify";

const GuardDetail = ({ onClose, spotDetails, guardDetail, isEditGuard, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when editing an existing guard
  useEffect(() => {
    if (isEditGuard && guardDetail) {
      setFormData({
        name: guardDetail.name || "",
        mobile: guardDetail.mobile || "",
        email: guardDetail.email || "",
        password: "", // Don't pre-fill password for security
      });
    } else {
      // Reset form when adding a new guard
      setFormData({
        name: "",
        mobile: "",
        email: "",
        password: "",
      });
    }
    setErrors({});
    setError("");
  }, [isEditGuard, guardDetail]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Guard name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!isEditGuard && !formData.password) {
      newErrors.password = "Password is required";
    }
    //  else if (formData.password && formData.password.length < 6) {
    //   newErrors.password = "Password must be at least 6 characters";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    
    // Format mobile input to only allow digits and limit to 10 characters
    let processedValue = value;
    if (name === 'mobile') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      let response;
      
      if (isEditGuard) {
        // Update existing guard
        const data = { 
          ...formData, 
          guardId: guardDetail._id
        };
        response = await updateGuardDetails(data);
      } else {
        // Add new guard
        const data = { ...formData, spotId: spotDetails._id };
        response = await addGuardDetails(data);
      }
      
      if (response.success) {
        toast.success(response.message);
        onSuccess();
        onClose();
      } else {
        setError(response.message || `Failed to ${isEditGuard ? 'update' : 'add'} guard`);
      }
    } catch (err) {
      setError(err.message || `An error occurred while ${isEditGuard ? 'updating' : 'adding'} the guard`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-all duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div 
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditGuard ? "Edit Guard Details" : "Add Guard Details"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guard Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter guard's full name"
                className="w-full"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <Input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                className="w-full"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must be unique across all guards
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter guard's email"
                className="w-full"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must be unique across all guards
              </p>
            </div>

            {/* Password Field - Only show for new guards */}
            {!isEditGuard && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min. 6 characters)"
                  className="w-full"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
            )}

            {/* Optional: Password update field for existing guards */}
            {isEditGuard && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password (Leave blank to keep current)
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
            )}

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditGuard ? "Updating..." : "Adding...") 
                  : (isEditGuard ? "Update Guard" : "Add Guard")
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuardDetail;