import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { changePassword } from 'utils/helperFunctions';
import { toast } from 'react-toastify';

const PasswordTab = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword.trim()) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "New password is required";
        } 
          // else if (passwordData.newPassword.length < 8) {
          //     newErrors.newPassword = "Password must be at least 8 characters";
          // }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await changePassword(passwordData);
            if (response.success) {
                toast.success(response.message);
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setErrors({});
            } else {
                setErrors({ general: response.message || "Failed to change password" });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to change password";
            setErrors({ general: errorMessage });
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password *
                    </label>
                    <Input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter your current password"
                        className="w-full"
                    />
                    {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password *
                    </label>
                    <Input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password (min. 8 characters)"
                        className="w-full"
                    />
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password *
                    </label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your new password"
                        className="w-full"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PasswordTab;