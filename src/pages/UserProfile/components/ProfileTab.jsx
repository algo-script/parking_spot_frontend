import React, { useEffect, useState } from 'react';
import Icon from "../../../components/AppIcon";
import { updateUserProfile } from 'utils/helperFunctions';
import { toast } from 'react-toastify';

// Profile Tab
const ProfileTab = ({ user, fetchUserData}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      mobile: "",
      profileImage: "",
      responseTime: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({
      name: "",
      email: "",
      mobile: "",
      profileImage: "",
      responseTime: "",
      general: ""
    });

    const responseTimeOptions = [
        "Within an hour",
        "Within a few hours",
        "Within a day",
        "Within a few days",
      ];
    
      useEffect(() => {
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          mobile: user?.mobile || "",
          profileImage: user?.profileImage || "",
          responseTime: user?.responseTime || "",
        });
      }, [user]);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: "" }));
        }
      };
    
      const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const validTypes = ["image/jpeg", "image/png", "image/gif"];
          if (!validTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, profileImage: "Please upload a valid image (JPEG, PNG, or GIF)" }));
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, profileImage: "Image size must be less than 5MB" }));
            return;
          }
          setFormData((prev) => ({ ...prev, profileImage: file }));
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageFile(reader.result);
            setErrors(prev => ({ ...prev, profileImage: "" }));
          };
          reader.readAsDataURL(file);
        }
      };
    
      const validateForm = () => {
        let valid = true;
        const newErrors = {
          name: "",
          email: "",
          mobile: "",
          profileImage: "",
          responseTime: "",
          general: ""
        };

        if (!formData.name.trim()) {
          newErrors.name = "Name is required";
          valid = false;
        }

        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
          valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
          valid = false;
        }

        if (formData.mobile && !/^[0-9]{10,15}$/.test(formData.mobile)) {
          newErrors.mobile = "Please enter a valid mobile number";
          valid = false;
        }

        setErrors(newErrors);
        return valid;
      };
    
      const handleSaveProfile = async () => {
        if (!validateForm()) return;

        try {
          const formDataToSend = new FormData();
          formDataToSend.append("name", formData.name);
          formDataToSend.append("email", formData.email);
          formDataToSend.append("mobile", formData.mobile);
          if (imageFile) {
            formDataToSend.append("profileImage", formData.profileImage);
          }
          formDataToSend.append("responseTime", formData.responseTime);
    
          const response = await updateUserProfile(formDataToSend);
          if (response.success) {
            fetchUserData();
            setImageFile(null);
            setIsEditing(false);
            toast.success(response.message);
          }
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to update profile";
          setErrors(prev => ({ ...prev, general: errorMessage }));
          toast.error(errorMessage);
          console.error(err);
        }
      };
    
      const handleCancelEdit = () => {
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          mobile: user?.mobile || "",
          profileImage: user?.profileImage || "",
          responseTime: user?.responseTime || "",
        });
        setImageFile(null);
        setErrors({
          name: "",
          email: "",
          mobile: "",
          profileImage: "",
          responseTime: "",
          general: ""
        });
        setIsEditing(false);
      };

    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Profile Information
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-primary hover:text-primary-dark px-4 py-2 rounded-md"
            >
              <Icon name="Edit" size={18} className="mr-1" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
  
        <div className="flex items-center mb-6">
          {user?.profileImage || imageFile ? (
            <img
              src={
                imageFile ||
                `${import.meta.env.VITE_APP_BASE_URL}/${encodeURIComponent(
                  formData.profileImage
                )}` ||
                "https://example.com/fallback-profile.jpg"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mr-4 border border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mr-4 border border-gray-200">
              <Icon name="User" size={48} className="text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {user?.name}
            </h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
  
        {isEditing ? (
          <div className="grid grid-cols-1 gap-4">
            {errors.general && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {errors.general}
              </div>
            )}
            
            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.profileImage && (
                <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>
              )}
              {imageFile && (
                <img
                  src={imageFile}
                  alt="Preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover"
                />
              )}
            </div>
            
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>
            
            <div>
              <label
                htmlFor="responseTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Response Time
              </label>
              <select
                id="responseTime"
                name="responseTime"
                value={formData.responseTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select response time</option>
                {responseTimeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {user?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Mobile:</span>{" "}
                  {user?.mobile || "Not provided"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  Preferences
                </h3>
                <p className="text-gray-700">
                  <span className="font-medium">Response Time:</span>{" "}
                  {user?.responseTime || "Not set"}
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
export default ProfileTab;
