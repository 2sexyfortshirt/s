import React from "react";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">

      <div className="product-image">
        <img src={product.image} alt={product.name}/>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>

        <button
          className="cart-btn"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>

    </div>
  );
}

export default ProductCard;