// import React, { useState, useRef, useEffect } from "react";
// import { BrowserQRCodeReader } from "@zxing/library";
// import {
//   confirmEntry,
//   formatTimeString,
//   verifyBooking,
// } from "utils/helperFunctions";
// import { toast } from "react-toastify";
// import moment from "moment";

// const VerifyQR = () => {
//   const [activeTab, setActiveTab] = useState("scan"); // 'scan', 'upload', or 'manual'
//   const [scanResult, setScanResult] = useState(null);
//   const [verifyData, setverifyData] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isScanning, setIsScanning] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [manualCode, setManualCode] = useState("");
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   // Initialize camera when scan tab is selected
//   useEffect(() => {
//     if (activeTab === "scan") {
//       startCamera();
//     } else {
//       stopCamera();
//     }

//     return () => {
//       stopCamera();
//     };
//   }, [activeTab]);

//   const startCamera = async () => {
//     try {
//       setErrorMessage("");
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });
//       streamRef.current = stream;
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//       setIsScanning(true);
//     } catch (err) {
//       console.error("Error accessing camera:", err);
//       setErrorMessage(
//         "Cannot access camera. Please check permissions or try manual entry."
//       );
//       setIsScanning(false);
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     setIsScanning(false);
//   };

//   const simulateScan = () => {
//     // In a real application, this would be actual QR code scanning logic
//     setErrorMessage("Scanning...");

//     setTimeout(() => {
//       setScanResult(sampleReservation);
//       setErrorMessage("");
//       stopCamera();
//     }, 2000);
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.match("image.*")) {
//       setErrorMessage("Please upload an image file");
//       return;
//     }
//     setSelectedImage(file);
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       setImagePreview(e.target.result);

//       try {
//         const img = new Image();
//         img.src = e.target.result;
//         await new Promise((resolve) => (img.onload = resolve));
//         const codeReader = new BrowserQRCodeReader();
//         const result = await codeReader.decodeFromImage(img); // Decoded QR text
//         const parsedData = JSON.parse(result.text);
//         setScanResult(parsedData);
//         setErrorMessage("");
//         const response = await verifyBooking({
//           bookingId: parsedData.bookingId,
//         });

//         if (response.success) {
//           setverifyData(response.data);
//           toast.success(response.message);
//         }
//       } catch (err) {
//         console.error(err);
//         // Correct error handling
//         if (err.response && err.response.data && err.response.data.message) {
//           setErrorMessage(err.response.data.message);
//         } else if (err instanceof SyntaxError) {
//           setErrorMessage("Invalid QR code format.");
//         } else {
//           setErrorMessage(
//             "Failed to read QR code. Make sure the image is clear and contains a valid QR code."
//           );
//         }
//       }
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleconfirmEntry = async () => {
//     try {
//       const response = await confirmEntry({ bookingId: verifyData._id });
//       if (response.success) {
//         toast.success(response.message);
//         resetVerification();
//       }
//     } catch (err) {
//       console.error("Confirm Entry API error:", err);
//       toast.error(err.response.data.message);
//     }
//   };

//   const handleManualVerify = async () => {
//     if (manualCode.length < 6) {
//       setErrorMessage(
//         "Please enter a valid booking code (at least 6 characters)"
//       );
//       return;
//     }
//     try {
//       const response = await verifyBooking({ bookingId: manualCode });
//       if (response.success) {
//         setverifyData(response.data);
//         toast.success(response.message);
//       }
//     } catch (error) {
//       console.error("Confirm Entry API error:", err);
//       toast.error(err.response.data.message);
//     }
//   };

//   const resetVerification = () => {
//     setScanResult(null);
//     setverifyData(null);
//     setErrorMessage("");
//     setSelectedImage(null);
//     setImagePreview(null);
//     setManualCode("");

//     if (activeTab === "scan") {
//       startCamera();
//     }
//   };

//   const isBookingActive = () => {
//     if (!verifyData) return false;
//     const now = moment();
//     const bookingStart = moment(
//       `${moment(verifyData.date).format("YYYY-MM-DD")} ${verifyData.startTime}`,
//       "YYYY-MM-DD HH:mm"
//     );
//     const bookingEnd = moment(
//       `${moment(verifyData.date).format("YYYY-MM-DD")} ${verifyData.endTime}`,
//       "YYYY-MM-DD HH:mm"
//     );

//     return now.isBetween(bookingStart, bookingEnd);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <div className="flex-1 container mx-auto px-4 py-4 md:py-6">
//         {/* <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
//         <h1 className="text-2xl font-bold text-gray-800">QR Code Verification</h1>
//         <p className="text-gray-600">Scan, upload, or enter a code to verify parking reservations</p>
//       </div> */}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Verification Methods Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Verification Methods
//             </h2>

//             {/* Tabs for different verification methods */}
//             <div className="border-b border-gray-200 mb-6">
//               <nav className="flex -mb-px">
//                 <button
//                   onClick={() => {
//                     setActiveTab("scan");
//                     setErrorMessage("");
//                   }}
//                   className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
//                     activeTab === "scan"
//                       ? "border-blue-500 text-blue-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   Camera Scan
//                 </button>
//                 <button
//                   onClick={() => {
//                     setActiveTab("upload");
//                     setErrorMessage("");
//                   }}
//                   className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
//                     activeTab === "upload"
//                       ? "border-blue-500 text-blue-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   Upload Image
//                 </button>
//                 <button
//                   onClick={() => {
//                     setActiveTab("manual");
//                     setErrorMessage("");
//                   }}
//                   className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
//                     activeTab === "manual"
//                       ? "border-blue-500 text-blue-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   Enter Code
//                 </button>
//               </nav>
//             </div>

//             {errorMessage && (
//               <div
//                 className={`mb-4 p-3 rounded-lg ${
//                   errorMessage.includes("Cannot access")
//                     ? "bg-yellow-100 text-yellow-800"
//                     : "bg-red-100 text-red-800"
//                 }`}
//               >
//                 {errorMessage}
//               </div>
//             )}

//             {/* Camera Scan Tab */}
//             {activeTab === "scan" && (
//               <div>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 mb-4 bg-gray-100 overflow-hidden">
//                   {isScanning ? (
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       muted
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center text-gray-500">
//                         <svg
//                           className="w-12 h-12 mx-auto mb-2"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                         <p>Camera not available</p>
//                       </div>
//                     </div>
//                   )}
                  
//                   {isScanning && (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-48 h-48 border-4 border-blue-500 rounded-lg opacity-70"></div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex space-x-3">
//                   {isScanning ? (
//                     <>
//                       <button
//                         onClick={simulateScan}
//                         className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
//                       >
//                         Simulate Scan
//                       </button>
//                       <button
//                         onClick={stopCamera}
//                         className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition-colors"
//                       >
//                         Stop Camera
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       onClick={startCamera}
//                       className="w-full py-3 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
//                     >
//                       Start Camera
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Upload Image Tab */}
//             {activeTab === "upload" && (
//               <div>
//                 {imagePreview ? (
//                   <div className="mb-4">
//                     <img
//                       src={imagePreview}
//                       alt="QR code preview"
//                       className="mx-auto h-64 object-contain border rounded"
//                     />
//                     <button
//                       onClick={() => {
//                         setSelectedImage(null);
//                         setImagePreview(null);
//                         setErrorMessage("");
//                       }}
//                       className="mt-2 text-sm text-red-600 hover:text-red-800"
//                     >
//                       Remove Image
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center w-full mb-4">
//                     <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                         <svg
//                           className="w-12 h-12 mb-4 text-gray-500"
//                           aria-hidden="true"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 20 16"
//                         >
//                           <path
//                             stroke="currentColor"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//                           />
//                         </svg>
//                         <p className="mb-2 text-sm text-gray-500">
//                           <span className="font-semibold">Click to upload</span>{" "}
//                           or drag and drop
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           PNG, JPG, GIF (MAX. 5MB)
//                         </p>
//                       </div>
//                       <input
//                         id="dropzone-file"
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                       />
//                     </label>
//                   </div>
//                 )}

//                 {/* <button
//                 onClick={handleImageUpload}
//                 disabled={!selectedImage}
//                 className={`w-full py-3 px-4 rounded-lg text-white font-medium ${selectedImage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'} transition-colors`}
//               >
//                 Process QR Code
//               </button> */}
//               </div>
//             )}

//             {/* Manual Entry Tab */}
//             {activeTab === "manual" && (
//               <div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="manualCode"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Enter Booking Code
//                   </label>
//                   <input
//                     type="text"
//                     id="manualCode"
//                     value={manualCode}
//                     onChange={(e) =>
//                       setManualCode(e.target.value.toUpperCase())
//                     }
//                     placeholder="e.g. RSV20231001"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <p className="mt-1 text-sm text-gray-500">
//                     Usually found on the reservation confirmation
//                   </p>
//                 </div>

//                 <button
//                   onClick={handleManualVerify}
//                   disabled={manualCode.length < 6}
//                   className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
//                     manualCode.length >= 6
//                       ? "bg-blue-600 hover:bg-blue-700"
//                       : "bg-gray-400"
//                   } transition-colors`}
//                 >
//                   Verify Code
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Results Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Verification Result
//             </h2>

//             {verifyData ? (
//               <div className="space-y-4">
//                 <div
//                   className={`p-4 rounded-lg ${
//                     verifyData.status === "Confirmed"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <svg
//                       className="w-5 h-5 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <span className="font-medium">
//                       Reservation {verifyData.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Booking ID</p>
//                     <p className="font-medium">{verifyData.bookingId}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">User</p>
//                     <p className="font-medium">{verifyData.user.name}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">Booking Date & Time</p>
//                   <p className="font-medium">
//                     {moment(verifyData.date).format("MMM D, YYYY")}{" "}
//                     {/* e.g., Tue, Sep 2, 2025 */}
//                     {" | "}
//                     {formatTimeString(verifyData.startTime)} -{" "}
//                     {formatTimeString(verifyData.endTime)}
//                   </p>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200">
//                   <h3 className="font-medium text-gray-800 mb-2">
//                     Vehicle Information
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-500">Brand & Model</p>
//                       <p className="font-medium">
//                         {verifyData.vehicle.brand} {verifyData.vehicle.model}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Vehicle Number</p>
//                       <p className="font-medium">
//                         {verifyData.vehicle.vehicleNumber}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Color</p>
//                       <p className="font-medium">{verifyData.vehicle.color}</p>
//                     </div>
//                   </div>
//                 </div>
//                 {/* 
//               <div className="pt-4 border-t border-gray-200">
//                 <h3 className="font-medium text-gray-800 mb-2">Payment Status</h3>
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verifyData.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                   {verifyData.paymentStatus}
//                 </span>
//               </div> */}

//                 <div className="pt-4 flex space-x-3">
//                   {verifyData.status === "pending" && isBookingActive() && (
//                     <button
//                       onClick={handleconfirmEntry}
//                       className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       Confirm Entry
//                     </button>
//                   )}
//                   <button
//                     onClick={resetVerification}
//                     className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//                   >
//                     New Verification
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-10 text-gray-500">
//                 <svg
//                   className="w-16 h-16 mx-auto text-gray-300 mb-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//                 <p>
//                   Scan a QR code, upload an image, or enter a code to verify
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyQR;
import React, { useState, useRef, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/library";
import {
  confirmEntry,
  formatTimeString,
  verifyBooking,
} from "utils/helperFunctions";
import { toast } from "react-toastify";
import moment from "moment";

const VerifyQR = () => {
  const [activeTab, setActiveTab] = useState("scan");
  const [scanResult, setScanResult] = useState(null);
  const [verifyData, setverifyData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  // Check camera permissions when component mounts
  useEffect(() => {
    checkCameraPermissions();
  }, []);

  // Initialize camera when scan tab is selected
  useEffect(() => {
    if (activeTab === "scan") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const checkCameraPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' });
      if (permissions.state === 'denied') {
        setShowPermissionModal(true);
      }
    } catch (error) {
      console.error("Error checking camera permissions:", error);
    }
  };

  const startCamera = async () => {
    try {
      setErrorMessage("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        await videoRef.current.play();
      }
      setIsScanning(true);
      // Start scanning for QR codes
      scanQRCode();
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError') {
        setShowPermissionModal(true);
        setErrorMessage("Camera access denied. Please allow camera permissions.");
      } else {
        setErrorMessage(
          "Cannot access camera. Please check permissions or try manual entry."
        );
      }
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const tick = () => {
      if (!isScanning) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        
        // Draw the video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get the image data from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Try to detect a QR code using jsQR
        // Note: You'll need to install jsQR: npm install jsqr
        // import jsQR from "jsqr";
        try {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          
          // If a QR code is found, process it
          if (code) {
            try {
              const parsedData = JSON.parse(code.data);
              setScanResult(parsedData);
              setErrorMessage("");
              stopCamera();
              
              // Verify the booking
              verifyScannedCode(parsedData.bookingId);
            } catch (err) {
              console.error("Error parsing QR code data:", err);
              setErrorMessage("Invalid QR code format.");
            }
          }
        } catch (error) {
          console.error("Error scanning QR code:", error);
        }
      }
      
      // Continue scanning
      if (isScanning) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };
    
    // Start the scanning loop
    animationRef.current = requestAnimationFrame(tick);
  };

  const verifyScannedCode = async (bookingId) => {
    try {
      const response = await verifyBooking({ bookingId });
      if (response.success) {
        setverifyData(response.data);
        toast.success(response.message);
      }
    } catch (err) {
      console.error("Error verifying booking:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Failed to verify booking.");
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrorMessage("Please upload an image file");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      setImagePreview(e.target.result);

      try {
        const img = new Image();
        img.src = e.target.result;
        await new Promise((resolve) => (img.onload = resolve));
        const codeReader = new BrowserQRCodeReader();
        const result = await codeReader.decodeFromImage(img);
        const parsedData = JSON.parse(result.text);
        setScanResult(parsedData);
        setErrorMessage("");
        const response = await verifyBooking({
          bookingId: parsedData.bookingId,
        });

        if (response.success) {
          setverifyData(response.data);
          toast.success(response.message);
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else if (err instanceof SyntaxError) {
          setErrorMessage("Invalid QR code format.");
        } else {
          setErrorMessage(
            "Failed to read QR code. Make sure the image is clear and contains a valid QR code."
          );
        }
      }
    };

    reader.readAsDataURL(file);
  };

  const handleconfirmEntry = async () => {
    try {
      const response = await confirmEntry({ bookingId: verifyData._id });
      if (response.success) {
        toast.success(response.message);
        resetVerification();
      }
    } catch (err) {
      console.error("Confirm Entry API error:", err);
      toast.error(err.response?.data?.message || "Error confirming entry");
    }
  };

  const handleManualVerify = async () => {
    if (manualCode.length < 6) {
      setErrorMessage(
        "Please enter a valid booking code (at least 6 characters)"
      );
      return;
    }
    try {
      const response = await verifyBooking({ bookingId: manualCode });
      if (response.success) {
        setverifyData(response.data);
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Manual verify error:", error);
      toast.error(error.response?.data?.message || "Error verifying code");
    }
  };

  const resetVerification = () => {
    setScanResult(null);
    setverifyData(null);
    setErrorMessage("");
    setSelectedImage(null);
    setImagePreview(null);
    setManualCode("");

    if (activeTab === "scan") {
      startCamera();
    }
  };

  const isBookingActive = () => {
    if (!verifyData) return false;
    const now = moment();
    const bookingStart = moment(
      `${moment(verifyData.date).format("YYYY-MM-DD")} ${verifyData.startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const bookingEnd = moment(
      `${moment(verifyData.date).format("YYYY-MM-DD")} ${verifyData.endTime}`,
      "YYYY-MM-DD HH:mm"
    );

    return now.isBetween(bookingStart, bookingEnd);
  };

  const requestCameraPermission = () => {
    setShowPermissionModal(false);
    startCamera();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 container mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Methods Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Verification Methods
            </h2>

            {/* Tabs for different verification methods */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => {
                    setActiveTab("scan");
                    setErrorMessage("");
                  }}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === "scan"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Camera Scan
                </button>
                <button
                  onClick={() => {
                    setActiveTab("upload");
                    setErrorMessage("");
                  }}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === "upload"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Upload Image
                </button>
                <button
                  onClick={() => {
                    setActiveTab("manual");
                    setErrorMessage("");
                  }}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === "manual"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Enter Code
                </button>
              </nav>
            </div>

            {errorMessage && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  errorMessage.includes("Cannot access") || errorMessage.includes("denied")
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {errorMessage}
              </div>
            )}

            {/* Camera Scan Tab */}
            {activeTab === "scan" && (
              <div>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-64 mb-4 bg-gray-100 overflow-hidden">
                  {isScanning ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-4 border-blue-500 rounded-lg opacity-70"></div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p>Camera not active</p>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex space-x-3">
                  {isScanning ? (
                    <button
                      onClick={stopCamera}
                      className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      Stop Camera
                    </button>
                  ) : (
                    <button
                      onClick={startCamera}
                      className="w-full py-3 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Start Camera
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Upload Image Tab */}
            {activeTab === "upload" && (
              <div>
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="QR code preview"
                      className="mx-auto h-64 object-contain border rounded"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        setErrorMessage("");
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-12 h-12 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Manual Entry Tab */}
            {activeTab === "manual" && (
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="manualCode"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter Booking Code
                  </label>
                  <input
                    type="text"
                    id="manualCode"
                    value={manualCode}
                    onChange={(e) =>
                      setManualCode(e.target.value.toUpperCase())
                    }
                    placeholder="e.g. RSV20231001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Usually found on the reservation confirmation
                  </p>
                </div>

                <button
                  onClick={handleManualVerify}
                  disabled={manualCode.length < 6}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                    manualCode.length >= 6
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400"
                  } transition-colors`}
                >
                  Verify Code
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Verification Result
            </h2>

            {verifyData ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    verifyData.status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      Reservation {verifyData.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-medium">{verifyData.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="font-medium">{verifyData.user.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Booking Date & Time</p>
                  <p className="font-medium">
                    {moment(verifyData.date).format("MMM D, YYYY")}
                    {" | "}
                    {formatTimeString(verifyData.startTime)} -{" "}
                    {formatTimeString(verifyData.endTime)}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Brand & Model</p>
                      <p className="font-medium">
                        {verifyData.vehicle.brand} {verifyData.vehicle.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Number</p>
                      <p className="font-medium">
                        {verifyData.vehicle.vehicleNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="font-medium">{verifyData.vehicle.color}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  {verifyData.status === "pending" && isBookingActive() && (
                    <button
                      onClick={handleconfirmEntry}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirm Entry
                    </button>
                  )}
                  <button
                    onClick={resetVerification}
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    New Verification
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>
                  Scan a QR code, upload an image, or enter a code to verify
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Camera Permission Required
            </h3>
            <p className="text-gray-600 mb-6">
              To scan QR codes, we need access to your camera. Please allow
              camera permissions in your browser settings.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={requestCameraPermission}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Allow Camera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyQR;