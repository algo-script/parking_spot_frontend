import React, { useContext, useState } from 'react';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mycontext } from '../context/context';
import { loginUser, registerUser } from '../utils/helperFunctions';

const AuthModal = ({ isOpen, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { setToken } = useContext(Mycontext);
  const [formData, setFormData] = useState({
    credentials: '', // For sign-in (email or mobile)
    email: '',       // For sign-up
    mobileNo: '',    // For sign-up
    username: '',    // For sign-up
    password: '',
    confirmPassword: '',
    rememberMe: false
  });


  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      let response;
      if (activeTab === 'signin') {
        response = await loginUser({
          emailOrMobile: formData.credentials,
          password: formData.password,
        });
      } else {
        response = await registerUser({
          name: formData.username,
          mobile: formData.mobileNo,
          email: formData.email,
          password: formData.password,
        });
      }

      if (response.token) {
        setToken(response.token);
        onClose();
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      alert(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-gray-500 opacity-75" 
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div 
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6">
          {/* Close button */}
          <div className="flex justify-end">
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
          
          {/* Tab buttons */}
          <div className="flex justify-center space-x-8 my-3">
            <button
              onClick={() => setActiveTab('signin')}
              className={`pb-2 px-1 font-medium text-lg focus:outline-none ${
                activeTab === 'signin'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`pb-2 px-1 font-medium text-lg focus:outline-none ${
                activeTab === 'signup'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          {activeTab === 'signin' ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900 text-center">Welcome back</h3>
              <p className="text-gray-600 mb-6 text-center">Sign in to your account to continue</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="credentials" className="block text-sm font-medium text-gray-700 mb-1">
                    Email or Mobile Number
                  </label>
                  <Input
                    type="text"
                    id="credentials"
                    name="credentials"
                    placeholder="Enter your email or mobile number"
                    value={formData.credentials}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  
                  <a href="#" className="text-sm text-primary hover:text-primary-dark">
                    Forgot password?
                  </a>
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  className="mt-6 py-3"
                >
                  Sign In
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setActiveTab('signup')} 
                  className="text-primary hover:text-primary-dark font-medium focus:outline-none"
                >
                  Sign up here
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Create your account</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <Input
                    type="tel"
                    id="mobileNo"
                    name="mobileNo"
                    placeholder="Enter your mobile number"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  className="mt-6 py-3"
                >
                  Sign Up
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                //   onClick={() => setActiveTab('signin')} 
                  className="text-primary hover:text-primary-dark font-medium focus:outline-none"
                >
                  Sign in here
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;