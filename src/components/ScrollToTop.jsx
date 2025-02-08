// Optimized ScrollToTop.jsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Skip scroll for anchor links
    if (!window.location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // 'auto' is more performant than 'smooth'
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
