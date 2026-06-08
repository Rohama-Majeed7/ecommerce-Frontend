import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import { FaStar, FaStarHalf, FaTrash, FaSpinner, FaUserCircle, FaRegStar } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { toast } from "react-hot-toast";

const Review = ({ productId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  
  const token = useSelector((state) => state?.authenticator?.token);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://ecommerce-backend.rohama-majeed7.deno.net/review/getreview/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setReviews(res.data || []);
      dispatch(manageState());
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const addReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review comment", {
        icon: '✏️',
      });
      return;
    }

    if (!userId) {
      toast.error("Please login to submit a review", {
        icon: '🔒',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        "https://ecommerce-backend.rohama-majeed7.deno.net/review/addreview",
        {
          userId,
          productId,
          rating: parseInt(rating),
          comment: comment.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      setReviews([res.data.review, ...reviews]);
      setRating(5);
      setComment("");
      dispatch(manageState());
      toast.success("Review added successfully!", {
        icon: '✅',
      });
    } catch (err) {
      console.error("Error adding review:", err);
      toast.error(err.response?.data?.msg || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    setDeletingId(id);
    try {
      await axios.delete(
        `https://ecommerce-backend.rohama-majeed7.deno.net/review/deletereview/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setReviews(reviews.filter((r) => r._id !== id));
      dispatch(manageState());
      toast.success("Review deleted successfully");
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (ratingValue, size = "base") => {
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={`text-yellow-400 ${size === 'base' ? 'text-base' : 'text-lg'}`} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className={`text-yellow-400 ${size === 'base' ? 'text-base' : 'text-lg'}`} />);
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={`text-gray-300 ${size === 'base' ? 'text-base' : 'text-lg'}`} />);
    }
    return stars;
  };

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;

  if (loading) {
    return (
      <div className="w-11/12 mx-auto my-8">
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full my-8 md:my-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <MdRateReview className="text-2xl text-white" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Customer Reviews
                </h2>
                <p className="text-white/80 text-sm">
                  Share your experience with this product
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Rating Summary */}
            {totalReviews > 0 && (
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-4xl md:text-5xl font-bold text-gray-800">
                      {averageRating}
                    </div>
                    <div className="flex items-center gap-1 my-2 justify-center md:justify-start">
                      {renderStars(averageRating, 'lg')}
                    </div>
                    <p className="text-sm text-gray-500">
                      Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star];
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <div className="w-12 text-sm text-gray-600">{star} star</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-12 text-sm text-gray-500">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {totalReviews === 0 ? (
              <div className="text-center py-12">
                <FaRegStar className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-semibold mb-2">
                  No reviews yet
                </p>
                <p className="text-gray-400 text-sm">
                  Be the first to review this product!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {review?.userId?.profilePic ? (
                          <img
                            src={review.userId.profilePic}
                            alt="profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <FaUserCircle className="text-2xl text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {review?.userId?.username || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-0.5">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">
                              {new Date(review?.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      {review.userId?._id === userId && (
                        <button
                          onClick={() => deleteReview(review._id)}
                          disabled={deletingId === review._id}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          {deletingId === review._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="mt-3 text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Review Form */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                Write a Review
              </h3>
              
              {!userId ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800">
                    Please login to submit a review
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          {(hoverRating || rating) >= star ? (
                            <FaStar className="text-3xl text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-3xl text-gray-300" />
                          )}
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {rating} of 5 stars
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your review here... (minimum 10 characters)"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={addReview}
                    disabled={submitting || !comment.trim()}
                    className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <MdRateReview />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0078D7;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #005a9e;
        }
      `}</style>
    </section>
  );
};

export default Review;