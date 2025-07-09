import React, { useState, useEffect } from "react";
import axios from "axios";

const Review = ({ productId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/review/getreview/${productId}`
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId]);

  const addReview = async () => {
    try {
      const res = await axios.post("http://localhost:8080/review/addreview", {
        userId,
        productId,
        rating,
        comment,
      });
      setReviews([...reviews, res.data.review]);
      setRating(1);
      setComment("");
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/review/deletereview/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <section className="w-11/12 mx-auto mt-8 mb-12">
      <div className="bg-white rounded-lg shadow-md border border-[#0078D7] p-6">
        <h2 className="text-2xl font-bold text-[#0A1F44] mb-6">Product Reviews</h2>

        {/* Reviews List */}
        <ul className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
          {reviews.map((review) => (
            <li
              key={review._id}
              className="border border-gray-300 p-4 rounded-md shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review?.userId?.profilePic}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#0A1F44]"
                  />
                  <div>
                    <p className="font-semibold text-[#0A1F44]">{review?.userId?.username}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review?.createdAt).toLocaleDateString()} •{" "}
                      {new Date(review?.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {review.userId._id === userId && (
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="text-sm px-4 py-1 rounded-md bg-[#0078D7] text-white hover:bg-[#005BB5] transition"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
              <p className="mt-1 text-sm text-[#0A1F44] font-semibold">
                Rating: {review.rating} / 5
              </p>
            </li>
          ))}
        </ul>

        {/* Add Review */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-3 text-[#0A1F44]">Add a Review</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="p-2 border border-[#0078D7] rounded-md w-full sm:w-32"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="p-2 border border-[#0078D7] rounded-md flex-1"
              rows={3}
            />
            <button
              onClick={addReview}
              className="bg-[#0078D7] text-white px-6 py-2 rounded-md hover:bg-[#005BB5] transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
