"use client";
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

 
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-[#3aab5c] text-white shadow-lg hover:bg-[#2d8f4b] hover:shadow-xl transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:ring-offset-2"
          aria-label="Go to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </>
  );
};


