import React, { useEffect, useState } from "react";
import api from "../api";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // 🔥 загрузка отзывов
  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await api.get(`reviews/${product.id}/`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchReviews();
}, [product.id]);
  // ⭐ средний рейтинг
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "No rating";

  // 🔥 отправка отзыва
  const handleSubmit = async () => {
    try {
      const res = await api.post(`reviews/${product.id}/`, {
        rating,
        comment,

      });

      // ✅ обновляем UI без reload
      setReviews(prev => [...prev, res.data]);
      setRating(0);
      setComment("");

    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.detail || "Ошибка");
    }
  };

  return (
    <div className="product-card">

     <img
  src={
    product.picture?.startsWith("http")
      ? product.picture
      : `http://localhost:8000${product.picture}`
  }
  alt={product.name}
/>
     console.log(product.picture);

      <h3>{product.name}</h3>
      <p>${product.price}</p>

      <p>
  {avgRating !== "No rating"
    ? "⭐".repeat(Math.round(avgRating))
    : "No rating"}
</p>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>

      {/* 🔥 отзывы */}
      <div className="reviews">
       {reviews.map(r => (
  <div key={r.id}>
   <b>{r.user || "Anonymous"}</b>: {r.comment} {"⭐".repeat(r.rating)}
  </div>
))}
      </div>

      {/* 🔥 форма */}
      <div className="star-input">
  {[1, 2, 3, 4, 5].map(star => (
    <span
      key={star}
      className={star <= rating ? "star active" : "star"}
      onClick={() => setRating(star)}
    >
      ★
    </span>
  ))}
</div>
   <div className="textarea-wrapper">
  <textarea
    value={comment}
    onChange={e => setComment(e.target.value)}
    placeholder="Write your review..."
    maxLength={120}
  />
  <span>{comment.length}/120</span>
</div>

        <button onClick={handleSubmit}>
          Add Review
        </button>


    </div>
  );
}

export default ProductCard;