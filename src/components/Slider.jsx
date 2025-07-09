import React, { useEffect, useState } from "react";
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
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const desktopImgs = [img1, img2, img3, img4, img5];
  const mobileImgs = [
    img1mobile,
    img2mobile,
    img3mobile,
    img4mobile,
    img5mobile,
  ];


useEffect(() =>{
const interval = setInterval(() =>{
    if (desktopImgs.length - 1 > currentImg) {
      nextImg()
    }else{
      setCurrentImg(0)
    }

},1000)

return () => clearInterval(interval)
},[currentImg])
  const nextImg = () => {
    if (desktopImgs.length - 1 > currentImg) {
      setCurrentImg((prev) => prev + 1);
    }
  };

  const prevImg = () => {
    if (currentImg != 0) {
      setCurrentImg((prev) => prev - 1);
    }
  };

  return (
    <React.Fragment>
      <section className="w-11/12  h-72 mx-auto relative">
        <div className="z-10 absolute top-[50%] w-full p-2">
          <div className="md:flex w-full justify-between hidden">
            <button onClick={prevImg} className="bg-white rounded-full p-2">
              <FaChevronLeft />
            </button>
            <button onClick={nextImg} className="bg-white rounded-full p-2">
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="w-full h-full flex overflow-hidden">
          {desktopImgs.map((imgUrl, index) => {
            return (
              <div
                className="w-fullh-full min-w-full min-h-full transition-all"
                style={{ transform: `translateX(-${currentImg * 100}%)` }}
                key={index}
              >
                <img src={imgUrl} className="w-full h-full md:object-cover object-contain" />
              </div>
            );
          })}
        </div>
      </section>
    </React.Fragment>
  );
};

export default Slider;
