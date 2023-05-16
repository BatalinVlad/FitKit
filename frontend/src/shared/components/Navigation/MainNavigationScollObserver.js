// import React, { useState, useEffect, useRef } from 'react';

// const MainNavigationScollObserver = () => {
//   const [, setScrollPosition] = useState(0);
//   const targetRef = useRef(null);

//   const handleScroll = () => {
//     const currentPosition = window.pageYOffset;
//     setScrollPosition(currentPosition);
//   };

  
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           // Add a CSS class when the observed element enters the viewport
//           entry.target.classList.add('visible');
//         } else {
//           // Remove the CSS class when the observed element exits the viewport
//           entry.target.classList.remove('visible');
//         }
//       });
//     }, { threshold: [0, 0.01] }); // Set threshold to trigger at 0% and 1% intersection

//     // Start observing the target element
//     if (targetRef.current) {
//       observer.observe(targetRef.current);
//     }

//     // Cleanup the observer when the component unmounts
//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <div className="spacer" style={{ height: '100px' }} /> {/* Spacer with a height of 100px */}
//       <div ref={targetRef} className="observed-element">
//         Observed Element
//       </div>
//       <div className="spacer" />
//     </div>
//   );
// };

// export default MainNavigationScollObserver;


