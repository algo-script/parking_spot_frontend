import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import HomeSearchScreen from "./pages/home-search-screen";
import MyParkingSpots from "./pages/my-parking-spots";
import ParkingSpotDetails from "./pages/parking-spot-details";
import AddParkingSpot from "./pages/add-parking-spot";
import NotFound from "./pages/NotFound";
import { Mycontext } from "context/context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "components/ui/Header";
import UserProfile from "pages/UserProfile";
import { getUserProfile } from "utils/helperFunctions";
import ProtectedRoute from "utils/ProtectedRoute";
import AuthModal from "pages/AuthModal";


const Routes = () => {
  const { token } = useContext(Mycontext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
    setLoading(false);
  }, [token]);


  const fetchUserData = async () => {
    try {
      const response = await getUserProfile();
      const userData = response.data;
      setUser(userData);
    } catch (err) {
      setError("Failed to load profile data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <CgSpinner size={40} className="animate-spin" /> */}
      </div>
    );
  }
  // If no token, show only the AuthModal as the login screen
  if (!token) {
    return (
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <AuthModal isOpen={true} onClose={() => {}} initialTab="signin" />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* <ErrorBoundary> */}
      <ScrollToTop />
      <Header
        userLoggedIn={token}
        userName={user?.name}
        userAvatar={user?.profileImage}
      />
       <RouterRoutes>
      <Route path="/" element={<HomeSearchScreen />} />
      <Route
        path="/parking-spot-details/:id"
        element={<ParkingSpotDetails />}
      />

      <Route
        path="/my-parking-spots"
        element={
          // <ProtectedRoute>
            <MyParkingSpots />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/add-parking-spot"
        element={
          // <ProtectedRoute>
            <AddParkingSpot />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/user-profile/*"
        element={
          // <ProtectedRoute>
            <UserProfile user={user} fetchUserData={fetchUserData} />
          // </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  );
};

export default Routes;


// const ProjectRoutes = ({ user, fetchUserData }) => {
//   return (
//     <RouterRoutes>
//       <Route path="/" element={<HomeSearchScreen />} />
//       <Route
//         path="/parking-spot-details/:id"
//         element={<ParkingSpotDetails />}
//       />

//       {/* ✅ Protected Routes */}
//       <Route
//         path="/my-parking-spots"
//         element={
//           <ProtectedRoute>
//             <MyParkingSpots />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/add-parking-spot"
//         element={
//           <ProtectedRoute>
//             <AddParkingSpot />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/user-profile/*"
//         element={
//           <ProtectedRoute>
//             <UserProfile user={user} fetchUserData={fetchUserData} />
//           </ProtectedRoute>
//         }
//       />
//       {/* <Route
//         path="/user-profile"
//         element={
//           <ProtectedRoute>
//             <UserProfile user={user} fetchUserData={fetchUserData} />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<ProfileTab />} />
//         <Route path="profile" element={<ProfileTab />} />
//         <Route path="password" element={<PasswordTab />} />
//         <Route path="vehicles" element={<VehiclesTabWrapper />} />
//         <Route path="notifications" element={<NotificationsTab />} />
//         <Route path="privacy" element={<PrivacyTab />} />
//         <Route path="connections" element={<ConnectionsTab />} />
//         <Route path="billing" element={<BillingTab />} />
//       </Route> */}

//       <Route path="*" element={<NotFound />} />
//     </RouterRoutes>
//   );
// };