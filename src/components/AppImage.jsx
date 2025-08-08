// import React from 'react';

// function Image({
//   src,
//   alt = "Image Name",
//   className = "",
//   ...props
// }) {

//   console.log("src",src)

//   return (
//     <img
//       src={src}
//       alt={alt}
//       className={className}
//       // onError={(e) => {
//       //   e.target.src = "/assets/images/no_image.png"
//       // }}
//       {...props}
//     />
//   );
// }

// export default Image;
import React, { useState } from 'react';

function Image({
  images,
  alt = "Image Name",
  className = "",
  ...props
}) {
  // console.log("images",images);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <img
        src={`http://localhost:5510/${images[currentImageIndex]}`}
        alt={alt}
        className="w-full h-full object-cover"
        {...props}
      />
      
      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Navigation Arrows (optional) */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e)=>handlePrev(e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={(e) => handleNext(e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default Image;
