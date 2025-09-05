import React, { useContext, useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { updateUserProfile } from "utils/helperFunctions";
import { toast } from "react-toastify";
import { Mycontext } from "context/context";
import { useLocation } from "react-router-dom";

// Profile Tab
const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profileImage: "",
    responseTime: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userRole ,user,updateUser} = useContext(Mycontext);
  // const location = useLocation();
  // const { user, setUser } = location.state || {};


  // const [user, setUser] = useState(location.state?.user || null);
  // const [fetchUserData, setFetchUserData] = useState(location.state?.fetchUserData || null);
  // const { user, fetchUserData } = location.state || {};
  // console.log(location.state);
  // console.log(user, setUser);
  
  // const user =  location.state?.user
  // const fetchUserData = location.state?.fetchUserData
  // console.log(user, fetchUserData);
  

  const responseTimeOptions = [
    "Within an hour",
    "Within a few hours",
    "Within a day",
    "Within a few days",
  ];
  // useEffect(() => {
  //   // Update local state if navigation state changes
  //   if (location.state?.user) {
  //     setUser(location.state.user);
  //   }
  //   if (location.state?.fetchUserData) {
  //     setFetchUserData(() => location.state.fetchUserData);
  //   }
  // }, [location.state]);
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      profileImage: user?.profileImage || "",
      responseTime: user?.responseTime || "",
    });
    setErrors({});
  }, [user]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    // if (!mobile) return true; // Mobile is optional
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format mobile input to only allow digits and limit to 10 characters
    let processedValue = value;
    if (name === 'mobile') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Please upload a valid image (JPEG, PNG, or GIF)",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Image size must be less than 5MB",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
        setErrors((prev) => ({ ...prev, profileImage: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.mobile && !validateMobile(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

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
        // fetchUserData();
        updateUser()
        setImageFile(null);
        setIsEditing(false);
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (err) {

      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
    setErrors({});
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Profile Information
        </h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="flex items-center"
          >
            <Icon name="Edit" size={16} className="mr-2" />
            <span className="hidden sm:inline">Edit Profile</span>
            <span className="sm:hidden">Edit</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleCancelEdit}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-row items-center mb-6">
        <div className="mb-2 md:mb-4 mr-4 flex-shrink-0">
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
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <Icon name="User" size={40} className="text-gray-500" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            {user?.name}
          </h3>
          <p className="text-gray-600 text-sm md:text-base">{user?.email}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.profileImage && (
              <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <Input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              maxLength="10"
              className="w-full"
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
            )}
          </div>

          {userRole === "User" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Response Time
              </label>
              <select
                name="responseTime"
                value={formData.responseTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select response time</option>
                {responseTimeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveProfile}
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">
                Personal Information
              </h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Name:</span> {user?.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Mobile:</span>{" "}
                {user?.mobile || "Not provided"}
              </p>
            </div>
            {userRole === "User" && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Preferences</h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Response Time:</span>{" "}
                  {user?.responseTime || "Not set"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default ProfileTab;