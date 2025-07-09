import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdStarRate } from "react-icons/md";
import { IoStarHalf } from "react-icons/io5";
import VerticalProducts from "./HomeComponents/VerticalProducts";
import addToCart from "../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import Review from "./Review";

const SingleProductCard = () => {
  const { productId } = useParams();
  const user = useSelector((state) => state?.authenticator?.user?.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
  const [zoomImage, setZoomImage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`https://ecommerce-backend-theta-dun.vercel.app/product/single-product/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        setData(res.data.product);
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomImageCoordinate({ x, y });
  }, []);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    dispatch(manageState());
  };

  const handleBuy = () => navigate("/cart");

  return (
    <div className="w-11/12 max-w-[1100px] mx-auto mt-8 mb-10">
      <section className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm relative">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Side: Image Preview */}
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[400px]">
                {data?.productImage?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="thumb"
                    className="w-20 h-20 rounded-md object-cover border-2 border-primary cursor-pointer hover:scale-105 transition"
                    onMouseEnter={() => setActiveImg(img)}
                  />
                ))}
              </div>
              <div className="relative flex-1">
                <img
                  src={activeImg || data?.productImage[0]}
                  onMouseMove={handleZoomImage}
                  onMouseLeave={() => setZoomImage(false)}
                  className="w-full h-[400px] object-contain rounded-md border border-gray-300"
                  alt="main"
                />
                {zoomImage && (
                  <div className="hidden lg:block absolute top-0 right-[-480px] z-10 w-[450px] h-[400px] border rounded-lg shadow-lg overflow-hidden">
                    <div
                      style={{
                        background: `url(${activeImg})`,
                        backgroundSize: "200%",
                        backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                      }}
                      className="w-full h-full bg-no-repeat"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Product Details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-600 uppercase">Product Details</h2>

              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-text">{data?.productName}</h1>
                <p className="text-gray-400 text-sm">{data?.category}</p>
                <div className="flex text-yellow-500">
                  <MdStarRate />
                  <MdStarRate />
                  <MdStarRate />
                  <MdStarRate />
                  <IoStarHalf />
                </div>
                <p className="text-3xl font-bold text-primary">${data?.sellingPrice}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleBuy}
                  className="px-4 py-2 border-2 border-primary rounded-md text-primary hover:bg-primary hover:text-white transition"
                >
                  Buy Now
                </button>
                <button
                  onClick={(e) => handleAddToCart(e, data?._id)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition"
                >
                  Add to Cart
                </button>
              </div>

              <div>
                <h3 className="text-gray-500 font-semibold">Description:</h3>
                <p className="text-gray-600">{data?.description}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Review Component */}
      {!loading && <Review productId={productId} userId={user?._id} />}

      {/* Recommended Products */}
      {!loading && (
        <VerticalProducts
          category={data?.category}
          heading="Recommended Products"
        />
      )}
    </div>
  );
};

export default SingleProductCard;
