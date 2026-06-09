import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaBolt, FaShare, FaHeart, FaSpinner, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import VerticalProducts from "./HomeComponents/VerticalProducts";
import addToCart from "../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import Review from "./Review";
import { toast } from "react-hot-toast";

const SingleProductCard = () => {
  const { productId } = useParams();
  const user = useSelector((state) => state?.authenticator?.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
  const [zoomImage, setZoomImage] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [error, setError] = useState(null);
  
  const token = useSelector((state) => state?.authenticator?.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Use ref to prevent unnecessary re-fetches
  const isMounted = useRef(true);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Only fetch if we have productId and not already fetching
    if (!productId || fetchInProgress.current) return;
    
    const fetchData = async () => {
      fetchInProgress.current = true;
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get(
          `https://ecommerce-backend.rohama-majeed7.deno.net/product/single-product/${productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        
        if (res.status === 200 && isMounted.current) {
          setData(res.data.product);
          setActiveImg(res.data.product?.productImage?.[0]);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isMounted.current) {
          setError(error.response?.data?.msg || "Failed to load product details");
          toast.error("Failed to load product details");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
        fetchInProgress.current = false;
      }
    };
    
    fetchData();
  }, [productId, token]); // Remove 'value' from dependencies

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    // Clamp values between 0 and 1
    setZoomImageCoordinate({ 
      x: Math.min(Math.max(x, 0), 1), 
      y: Math.min(Math.max(y, 0), 1) 
    });
  }, []);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    setAddingToCart(true);
    try {
      // Add to cart based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart({ preventDefault: () => {} }, data?._id, token);
      }
      dispatch(manageState());
      toast.success(`${quantity} item(s) added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuy = () => {
    if (!token) {
      toast.error("Please login to proceed");
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Product link copied to clipboard!");
    setShowShareMenu(false);
  };

  const increaseQuantity = () => {
    // if (quantity < (data?.stock || 10)) {
      setQuantity(prev => prev + 1);
    // } else {
    //   toast.error("Maximum stock limit reached");
    // }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const nextImage = () => {
    if (data?.productImage?.length) {
      const nextIndex = (currentImageIndex + 1) % data.productImage.length;
      setCurrentImageIndex(nextIndex);
      setActiveImg(data.productImage[nextIndex]);
    }
  };

  const prevImage = () => {
    if (data?.productImage?.length) {
      const prevIndex = (currentImageIndex - 1 + data.productImage.length) % data.productImage.length;
      setCurrentImageIndex(prevIndex);
      setActiveImg(data.productImage[prevIndex]);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  const discount = data?.originalPrice > data?.sellingPrice;
  const discountPercent = discount 
    ? Math.round(((data.originalPrice - data.sellingPrice) / data.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              <div className="w-full md:w-1/2">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-500 text-lg">{error || "Product not found"}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">
              Home
            </button>
            <span>/</span>
            {/* <button onClick={() => navigate('/shop')} className="hover:text-primary transition-colors">
              Shop
            </button>
            <span>/</span> */}
            <span className="text-gray-800 font-semibold truncate">{data?.productName}</span>
          </nav>
        </div>

        {/* Product Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-8">
            {/* Left Side: Image Gallery */}
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Thumbnail Gallery */}
                {data?.productImage?.length > 1 && (
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] order-2 md:order-1">
                    {data?.productImage?.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setActiveImg(img);
                          setCurrentImageIndex(i);
                        }}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                          activeImg === img 
                            ? 'ring-2 ring-primary shadow-md' 
                            : 'hover:ring-2 hover:ring-primary/50'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`thumbnail-${i}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Image with Zoom */}
                <div className="relative flex-1 order-1 md:order-2">
                  <div className="relative group">
                    <img
                      src={activeImg || data?.productImage?.[0]}
                      onMouseMove={handleZoomImage}
                      onMouseLeave={() => setZoomImage(false)}
                      className="w-full h-[400px] md:h-[500px] object-contain rounded-lg bg-gray-50 cursor-zoom-in"
                      alt={data?.productName}
                    />
                    
                    {/* Image Navigation Arrows */}
                    {data?.productImage?.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                          aria-label="Previous image"
                        >
                          <FaChevronLeft className="text-gray-600" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                          aria-label="Next image"
                        >
                          <FaChevronRight className="text-gray-600" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Zoom Lens Effect */}
                  {zoomImage && (
                    <div className="hidden xl:block absolute top-0 left-full ml-4 z-20 w-[400px] h-[400px] border-2 border-primary rounded-lg shadow-2xl overflow-hidden bg-white">
                      <div
                        style={{
                          backgroundImage: `url(${activeImg})`,
                          backgroundSize: "250%",
                          backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                          backgroundRepeat: "no-repeat",
                        }}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  
                  {/* Image Counter */}
                  {data?.productImage?.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {currentImageIndex + 1} / {data?.productImage?.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Product Details */}
            <div className="w-full lg:w-1/2 space-y-5">
              {/* Category */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-primary font-semibold uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full">
                  {data?.category}
                </span>
                {data?.stock > 0 && (
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <MdVerified className="text-green-500" />
                    In Stock ({data?.stock} units)
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                {data?.productName}
              </h1>

              {/* Brand */}
              {data?.brandName && (
                <p className="text-gray-500">
                  Brand: <span className="font-semibold text-gray-700">{data.brandName}</span>
                </p>
              )}

              {/* Rating */}
              {data?.averageRating > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(data?.averageRating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({data?.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  ${data?.sellingPrice?.toFixed(2)}
                </span>
                {discount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ${data?.originalPrice?.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-semibold">
                      Save ${(data.originalPrice - data.sellingPrice).toFixed(2)} ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= (data?.stock || 0)}
                    className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">
                    {data?.stock} units available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  // disabled={addingToCart || data?.stock === 0}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaShoppingCart />
                  )}
                  <span>{data?.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                </button>
                <button
                  onClick={handleBuy}
                  disabled={data?.stock === 0}
                  className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaBolt />
                  <span>Buy Now</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <FaShare />
                  </button>
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border p-2 z-10">
                      <button
                        onClick={handleShare}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition-colors whitespace-nowrap"
                      >
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-4 mt-2 space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <FaBolt className="text-primary" />
                  <span className="text-gray-600">
                    Free delivery on orders over $100
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaHeart className="text-primary" />
                  <span className="text-gray-600">
                    30-day return policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        {data?.description && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200 px-6">
              <button className="py-3 text-primary border-b-2 border-primary font-semibold">
                Description
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {data?.description}
              </p>
            </div>
          </div>
        )}

        {/* Review Component */}
        {!loading && (
          <div className="mt-8">
            <Review productId={productId} userId={user?._id} />
          </div>
        )}

        {/* Recommended Products */}
        {!loading && data?.category && (
          <div className="mt-12">
            <VerticalProducts
              category={data?.category}
              heading="You May Also Like"
              limit={4}
              showViewAll={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProductCard;