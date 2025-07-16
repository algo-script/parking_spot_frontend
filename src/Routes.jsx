import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import HomeSearchScreen from "./pages/home-search-screen";
import MyParkingSpots from "./pages/my-parking-spots";
import ParkingSpotDetails from "./pages/parking-spot-details";
import AddParkingSpot from "./pages/add-parking-spot";
import NotFound from "./pages/NotFound";


const Routes = () => {
    
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<HomeSearchScreen />} />
          <Route path="/home-search-screen" element={<HomeSearchScreen />} />
          <Route path="/my-parking-spots" element={<MyParkingSpots />} />
          <Route path="/parking-spot-details" element={<ParkingSpotDetails />} />
          <Route path="/add-parking-spot" element={<AddParkingSpot />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;