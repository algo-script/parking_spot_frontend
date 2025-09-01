// import React, { useContext, useState } from 'react';
// import Icon from '../components/AppIcon';
// import Button from '../components/ui/Button';
// import Input from '../components/ui/Input';
// import { Mycontext } from '../context/context';
// import { loginUser, registerUser } from '../utils/helperFunctions';
// import { toast } from 'react-toastify';

// const AuthModal = ({ isOpen, onClose, initialTab }) => {
//   const [activeTab, setActiveTab] = useState(initialTab);
//   const { setToken } = useContext(Mycontext);
//   const [formData, setFormData] = useState({
//     credentials: '', // For sign-in (email or mobile)
//     email: '',       // For sign-up
//     mobileNo: '',    // For sign-up
//     username: '',    // For sign-up
//     password: '',
//     confirmPassword: '',
//     rememberMe: false
//   });
//   const [error,setError] = useState("")


//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
//       setError("Passwords don't match!");
//       return;
//     }

//     try {
//       let response;
//       if (activeTab === 'signin') {
//         response = await loginUser({
//           emailOrMobile: formData.credentials,
//           password: formData.password,
//         });
//       } else {
//         response = await registerUser({
//           name: formData.username,
//           mobile: formData.mobileNo,
//           email: formData.email,
//           password: formData.password,
//         });
//       }

//       if (response.token) {
//         setToken(response.token,response.role);
//         onClose();
//       }
//     } catch (error) {
//       console.error('Authentication failed:', error);
//       toast.error(error.response?.data?.message || 'An error occurred.');
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-black/30 backdrop-blur-sm transition-all duration-300">
//       {/* Background overlay */}
//       <div 
//         className="absolute inset-0 opacity-75" 
//         onClick={onClose}
//       ></div>

//       {/* Modal container */}
//       <div 
//         className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="px-8 py-6">
//           {/* Close button */}
//           <div className="flex justify-end">
//             <button 
//               onClick={onClose} 
//               className="text-gray-400 hover:text-gray-500 focus:outline-none"
//             >
//               <Icon name="X" size={24} />
//             </button>
//           </div>
          
//           {/* Tab buttons */}
//           <div className="flex justify-center space-x-8 my-3">
//             <button
//               onClick={() => setActiveTab('signin')}
//               className={`pb-2 px-1 font-medium text-lg focus:outline-none ${
//                 activeTab === 'signin'
//                   ? 'border-b-2 border-primary text-primary'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => setActiveTab('signup')}
//               className={`pb-2 px-1 font-medium text-lg focus:outline-none ${
//                 activeTab === 'signup'
//                   ? 'border-b-2 border-primary text-primary'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>
          
//           {activeTab === 'signin' ? (
//             <>
//               <h3 className="text-xl font-semibold text-gray-900 text-center">Welcome back</h3>
//               <p className="text-gray-600 mb-6 text-center">Sign in to your account to continue</p>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label htmlFor="credentials" className="block text-sm font-medium text-gray-700 mb-1">
//                     Email or Mobile Number
//                   </label>
//                   <Input
//                     type="text"
//                     id="credentials"
//                     name="credentials"
//                     placeholder="Enter your email or mobile number"
//                     value={formData.credentials}
//                     onChange={handleChange}
//                     required
//                     className="w-full"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                     Password
//                   </label>
//                   <Input
//                     type="password"
//                     id="password"
//                     name="password"
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     // minLength={6}
//                     className="w-full"
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       name="rememberMe"
//                       type="checkbox"
//                       checked={formData.rememberMe}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
//                     />
//                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                       Remember me
//                     </label>
//                   </div>
                  
//                   <a href="#" className="text-sm text-primary hover:text-primary-dark">
//                     Forgot password?
//                   </a>
//                 </div>
                
//                 <Button 
//                   type="submit" 
//                   variant="primary" 
//                   fullWidth 
//                   className="mt-6 py-3"
//                 >
//                   Sign In
//                 </Button>
//               </form>
              
//               <div className="mt-6 text-center text-sm text-gray-600">
//                 Don't have an account?{' '}
//                 <button 
//                   onClick={() => setActiveTab('signup')} 
//                   className="text-primary hover:text-primary-dark font-medium focus:outline-none"
//                 >
//                   Sign up here
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Create your account</h3>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                     Username
//                   </label>
//                   <Input
//                     type="text"
//                     id="username"
//                     name="username"
//                     placeholder="Enter your username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                     className="w-full"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <Input
//                     type="email"
//                     id="email"
//                     name="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="w-full"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">
//                     Mobile Number
//                   </label>
//                   <Input
//                     type="number"
//                     id="mobileNo"
//                     name="mobileNo"
//                     placeholder="Enter your mobile number"
//                     value={formData.mobileNo}
//                     onChange={handleChange}
//                     required
//                     className="w-full"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                     Password
//                   </label>
//                   <Input
//                     type="password"
//                     id="password"
//                     name="password"
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     // minLength={6}
//                     className="w-full"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                     Confirm Password
//                   </label>
//                   <Input
//                     type="password"
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                     // minLength={6}
//                     className="w-full"
//                   />
//                 </div>
//                 <p className="text-red-600 text-sm font-medium">{error}</p>

//                 <Button 
//                   type="submit" 
//                   variant="primary" 
//                   fullWidth 
//                   className="mt-6 py-3"
//                 >
//                   Sign Up
//                 </Button>
//               </form>
              
//               <div className="mt-6 text-center text-sm text-gray-600">
//                 Already have an account?{' '}
//                 <button 
//                 //   onClick={() => setActiveTab('signin')} 
//                   className="text-primary hover:text-primary-dark font-medium focus:outline-none"
//                 >
//                   Sign in here
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;
import React, { useContext, useState, useEffect } from 'react';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mycontext } from '../context/context';
import { loginUser, registerUser } from '../utils/helperFunctions';
import { toast } from 'react-toastify';

const AuthModal = ({ isOpen, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'signin');
  const { setToken } = useContext(Mycontext);
  const [formData, setFormData] = useState({
    credentials: '',
    email: '',
    mobileNo: '',
    username: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'signin');
      setFormData({
        credentials: '',
        email: '',
        mobileNo: '',
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      });
      setErrors({});
      setError("")
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

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

    if (activeTab === 'signin') {
      if (!formData.credentials.trim()) {
        newErrors.credentials = 'Email or mobile number is required';
      } else if (formData.credentials.includes('@')) {
        if (!validateEmail(formData.credentials)) {
          newErrors.credentials = 'Please enter a valid email address';
        }
      } else if (!validateMobile(formData.credentials)) {
        newErrors.credentials = 'Please enter a valid 10-digit mobile number';
      }

      // if (!formData.password) {
      //   newErrors.password = 'Password is required';
      // } else if (formData.password.length < 6) {
      //   newErrors.password = 'Password must be at least 6 characters';
      // }
    } else {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.mobileNo.trim()) {
        newErrors.mobileNo = 'Mobile number is required';
      } else if (!validateMobile(formData.mobileNo)) {
        newErrors.mobileNo = 'Please enter a valid 10-digit mobile number';
      }

      // if (!formData.password) {
      //   newErrors.password = 'Password is required';
      // } else if (formData.password.length < 6) {
      //   newErrors.password = 'Password must be at least 6 characters';
      // }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError("")
    // Format mobile number input to only allow digits and limit to 10 characters
    let processedValue = value;
    if (name === 'mobileNo' ) {
      // Remove non-digit characters and limit to 10 digits
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
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
        setToken(response.token, response.role);
        toast.success(response.message);
        onClose();
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during authentication';
      setError(errorMessage);
      
      // Set specific field errors if available from API
      // if (error.response?.data?.errors) {
      //   setErrors(error.response.data.errors);
      // }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-all duration-300">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>

      <div 
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6">
          
          <div className="flex justify-end">
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
          <div className="flex justify-center space-x-8 mb-3 border-b">
            <button
              onClick={() => handleTabChange('signin')}
              className={`pb-3 px-1 font-medium text-lg focus:outline-none transition-colors ${
                activeTab === 'signin'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`pb-3 px-1 font-medium text-lg focus:outline-none transition-colors ${
                activeTab === 'signup'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          {activeTab === 'signin' ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900 text-center my-3">Welcome back</h3>
              {/* <p className="text-gray-600 mb-6 text-center">Sign in to your account to continue</p> */}
              
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
                    className={`w-full `}
                  />
                  {errors.credentials && (
                    <p className="mt-1 text-sm text-red-600">{errors.credentials}</p>
                  )}
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
                    className={`w-full`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </button>
                </div> */}
                <p className="text-red-600 text-sm font-medium">{error}</p>
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  className="mt-6 py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => handleTabChange('signup')} 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up here
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-900 text-center my-3">Create your account</h3>
              {/* <p className="text-gray-600 mb-6 text-center">Join us today to get started</p> */}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full `}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <Input
                    type="tel"
                    id="mobileNo"
                    name="mobileNo"
                    placeholder="Enter your 10-digit mobile number"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full`}
                  />
                  {errors.mobileNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobileNo}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
                <p className="text-red-600 text-sm font-medium">{error}</p>
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  className="mt-6 py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => handleTabChange('signin')} 
                  className="text-blue-600 hover:text-blue-800 font-medium"
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