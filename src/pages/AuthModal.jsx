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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-black/30 backdrop-blur-sm transition-all duration-300">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 opacity-75" 
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
                    // minLength={6}
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
                    // minLength={6}
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
                    // minLength={6}
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
// import React, { useContext, useState } from 'react';
// import Icon from '../components/AppIcon';
// import Button from '../components/ui/Button';
// import Input from '../components/ui/Input';
// import { Mycontext } from '../context/context';
// import { loginUser, registerUser } from '../utils/helperFunctions';
// import { toast } from 'react-toastify';

// const AuthModal = ({ initialTab }) => {
//   const [activeTab, setActiveTab] = useState(initialTab);
//   const [errMsg,seterrMsg] = useState("")
//   const { setToken } = useContext(Mycontext);
//   const [formData, setFormData] = useState({
//     credentials: '',
//     email: '',
//     mobileNo: '',
//     username: '',
//     password: '',
//     confirmPassword: '',
//     rememberMe: false
//   });



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
//       seterrMsg("Passwords don't match!");
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

//       if (response.token && response.success) {
//         toast.success(response.message)
//         setToken(response.token);
//       }
//     } catch (error) {
//       console.error('Authentication failed:', error);
//       toast.error(error.response?.data?.message || 'An error occurred.');
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
//       {/* Background overlay with subtle gradient */}
//       <div 
//         className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 opacity-90"
//       ></div>

//       {/* Modal container with subtle scale animation */}
//       <div 
//         className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transition-all duration-300 transform  scale-100 opacity-100`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Decorative header with gradient */}
//         <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        
//         <div className="px-8 py-8">
//           {/* Close button with better styling */}
//           {/* <div className="flex justify-end absolute top-4 right-4">
//             <button 
//               onClick={onClose} 
//               className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
//             >
//               <Icon name="X" size={20} />
//             </button>
//           </div> */}
          
//           {/* Tab buttons with improved styling */}
//           <div className="flex justify-center space-x-8 mb-8">
//             <button
//               onClick={() => setActiveTab('signin')}
//               className={`relative pb-2 px-1 font-medium text-lg focus:outline-none transition-colors duration-200 ${
//                 activeTab === 'signin'
//                   ? 'text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Sign In
//               {activeTab === 'signin' && (
//                 <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
//               )}
//             </button>
//             <button
//               onClick={() => setActiveTab('signup')}
//               className={`relative pb-2 px-1 font-medium text-lg focus:outline-none transition-colors duration-200 ${
//                 activeTab === 'signup'
//                   ? 'text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Sign Up
//               {activeTab === 'signup' && (
//                 <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
//               )}
//             </button>
//           </div>
          
//           {activeTab === 'signin' ? (
//             <>
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h3>
//                 <p className="text-gray-500">Sign in to your account to continue</p>
//               </div>
              
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="space-y-1">
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
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
                
//                 <div className="space-y-1">
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
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start space-y-2 sm:space-y-0">
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       name="rememberMe"
//                       type="checkbox"
//                       checked={formData.rememberMe}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
//                     />
//                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                       Remember me
//                     </label>
//                   </div>
                  
//                   <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
//                     Forgot password?
//                   </a>
//                 </div>
                
//                 <Button 
//                   type="submit" 
//                   variant="primary" 
//                   fullWidth 
//                   className="mt-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                   Sign In
//                 </Button>
//               </form>
              
//               <div className="mt-8 text-center text-sm text-gray-500">
//                 Don't have an account?{' '}
//                 <button 
//                   onClick={() => setActiveTab('signup')} 
//                   className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none transition-colors"
//                 >
//                   Sign up here
//                 </button>
//               </div>
              
//               {/* Social login options */}
//               <div className="mt-8">
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                   </div>
//                 </div>
                
//                 <div className="mt-6 grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <Icon name="Google" size={20} className="mr-2" />
//                     Google
//                   </button>
//                   <button
//                     type="button"
//                     className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <Icon name="Facebook" size={20} className="mr-2" />
//                     Facebook
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h3>
//                 <p className="text-gray-500">Join us today to get started</p>
//               </div>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-1">
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
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
                
//                 <div className="space-y-1">
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
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
                
//                 <div className="space-y-1">
//                   <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">
//                     Mobile Number
//                   </label>
//                   <Input
//                     type="tel"
//                     id="mobileNo"
//                     name="mobileNo"
//                     placeholder="Enter your mobile number"
//                     value={formData.mobileNo}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
                
//                 <div className="space-y-1">
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
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
                
//                 <div className="space-y-1">
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
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
                
//                 <div className="flex items-center">
//                   <input
//                     id="terms"
//                     name="terms"
//                     type="checkbox"
//                     required
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
//                   />
//                   <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
//                     I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
//                   </label>
//                 </div>
                
//                 <Button 
//                   type="submit" 
//                   variant="primary" 
//                   fullWidth 
//                   className="mt-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                   Sign Up
//                 </Button>
//               </form>
              
//               <div className="mt-8 text-center text-sm text-gray-500">
//                 Already have an account?{' '}
//                 <button 
//                   onClick={() => setActiveTab('signin')} 
//                   className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none transition-colors"
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