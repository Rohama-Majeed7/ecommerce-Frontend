import React, { useEffect, useState, useCallback } from "react";
import img1 from "../assets/banner/img1.webp";
import img2 from "../assets/banner/img2.webp";
import img3 from "../assets/banner/img3.jpg";
import img4 from "../assets/banner/img4.jpg";
import img5 from "../assets/banner/img5.webp";
import img1mobile from "../assets/banner/img1_mobile.jpg";
import img2mobile from "../assets/banner/img2_mobile.webp";
import img3mobile from "../assets/banner/img3_mobile.jpg";
import img4mobile from "../assets/banner/img4_mobile.jpg";
import img5mobile from "../assets/banner/img5_mobile.png";
import { FaChevronLeft, FaChevronRight, FaCircle, FaCircleNotch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const navigate = useNavigate();

  const desktopImgs = [img1, img2, img3, img4, img5];
  const mobileImgs = [img1mobile, img2mobile, img3mobile, img4mobile, img5mobile];
  
  // Banner links for each slide
  // const bannerLinks = [
  //   "/shop?category=electronics",
  //   "/shop?category=fashion",
  //   "/shop?category=home",
  //   "/shop?category=sports",
  //   "/shop?category=books"
  // ];

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentImages = isMobile ? mobileImgs : desktopImgs;
  const totalSlides = currentImages.length;

  const nextImg = useCallback(() => {
    setCurrentImg((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevImg = useCallback(() => {
    setCurrentImg((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentImg(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextImg();
    }, 5000); // Changed to 5 seconds for better UX
    
    return () => clearInterval(interval);
  }, [nextImg, isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextImg();
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevImg();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // const handleBannerClick = () => {
  //   navigate(bannerLinks[currentImg]);
  // };

  return (
    <section 
      className="w-full relative overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slider Container */}
      <div 
        className="relative w-full pt-[40%] md:pt-[30%] lg:pt-[25%] bg-gradient-to-r from-gray-900 to-gray-800"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images Container */}
        <div className="absolute inset-0">
          <div className="w-full h-full flex overflow-hidden">
            {currentImages.map((imgUrl, index) => (
              <div
                key={index}
                className="w-full h-full flex-shrink-0 transition-transform duration-500 ease-in-out cursor-pointer"
                style={{ transform: `translateX(-${currentImg * 100}%)` }}
                // onClick={handleBannerClick}
              >
                <img 
                  src={imgUrl} 
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none">
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white">
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 animate-fadeInUp">
                      {index === 0 && "Summer Sale!"}
                      {index === 1 && "New Arrivals"}
                      {index === 2 && "Home Collection"}
                      {index === 3 && "Sports Gear"}
                      {index === 4 && "Best Sellers"}
                    </h2>
                    <p className="text-sm md:text-base opacity-90 hidden md:block">
                      {index === 0 && "Up to 50% off on selected items"}
                      {index === 1 && "Discover the latest trends"}
                      {index === 2 && "Transform your living space"}
                      {index === 3 && "Gear up for adventure"}
                      {index === 4 && "Customer favorites"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Desktop */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={prevImg}
            className="pointer-events-auto bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="text-sm md:text-base" />
          </button>
          <button
            onClick={nextImg}
            className="pointer-events-auto bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next slide"
          >
            <FaChevronRight className="text-sm md:text-base" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {currentImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentImg === index
                  ? "w-8 md:w-10 h-2 bg-primary"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-10">
          {currentImg + 1} / {totalSlides}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Slider;