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
import ProtectedRoute from "utils/ProtectedRoute";
import GaurdDashboard from "pages/guard-dashboard/GuardDashboard";
import Qrscan from "pages/guard-dashboard/Qrscan";
import Bookingdetails from "pages/guard-dashboard/Bookingdetails";
import Icon from "../src/components/AppIcon";
import Admindashboard from "pages/admin-dashboard/Admindashboard";
import UserData from "pages/admin-dashboard/Userdata";
import { ModelProvider } from "context/modelcontext";

const Routes = () => {
  const { token, userRole } = useContext(Mycontext);

  // Component to render based on role for home route
  const HomeRouteRenderer = () => {
    if (!token) {
      return <HomeSearchScreen />;
    }

    switch (userRole) {
      case "Guard":
        return <GaurdDashboard />;
      case "Admin":
        return <Admindashboard />;
      case "User":
      default:
        return <HomeSearchScreen />;
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <CgSpinner size={40} className="animate-spin" />
  //     </div>
  //   );
  // }
  // If no token, show only the AuthModal as the login screen

  return (
    <BrowserRouter>
      {/* <ErrorBoundary> */}
      <div className="flex flex-col min-h-screen">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
          <ModelProvider>
            <Header userLoggedIn={token} />
          </ModelProvider>
        </header>
        <main className="flex-grow pt-16">
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

          <ScrollToTop />

          <RouterRoutes>
            <Route path="/" element={<HomeRouteRenderer />} />

            <Route
              path="/parking-spot-details/:id"
              element={
                <ModelProvider>
                  <ParkingSpotDetails />
                </ModelProvider>
              }
            />

            <Route
              path="/my-parking-spots"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <MyParkingSpots />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-booking"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <MyParkingSpots />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-parking-spot"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <AddParkingSpot />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user-profile/*"
              element={
                <ProtectedRoute allowedRoles={["User", "Guard", "Admin"]}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/qr-scanner"
              element={
                <ProtectedRoute allowedRoles={["Guard"]}>
                  <Qrscan />
                </ProtectedRoute>
              }
            />
            {/* /booking-details */}
            <Route
              path="/booking-details"
              element={
                <ProtectedRoute allowedRoles={["Guard"]}>
                  <Bookingdetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <UserData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parking-spots"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <NotFound />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <NotFound />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <NotFound />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guards"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <NotFound />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-600 text-sm">
                  &copy; {new Date().getFullYear()} ParkEase. All rights
                  reserved.
                </p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-primary">
                  <Icon name="HelpCircle" size={20} />
                </a>
                <a href="#" className="text-gray-600 hover:text-primary">
                  <Icon name="Settings" size={20} />
                </a>
                <a href="#" className="text-gray-600 hover:text-primary">
                  <Icon name="Info" size={20} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  );
};

export default Routes;
