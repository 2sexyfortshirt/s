import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import api from "../api";
import "./Menu.css";

function Menu() {
  const { addToCart } = useCart(); // 🔥 просто берём

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("menu/")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);




 // 🔥 1. ЕСЛИ категория НЕ выбрана → показываем категории
  if (!selectedCategory) {
    return (
      <div className="menu-container">
         <h2 className="menu-title">Menu</h2>


        <div className="category-grid">
          {products.map(category => (
            <div
              key={category.id}
                className="category-card"
              onClick={() => setSelectedCategory(category)}

            >
            <div className="category-title">
              {category.dish_type}
            </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🔥 2. ЕСЛИ категория выбрана → показываем блюда
  return (
    <div className="menu-container">
    <button
      className="back-button"
      onClick={() => setSelectedCategory(null)}
    >
      ⬅ Back
    </button>

    <h2 className="selected-title">
      {selectedCategory.dish_type}
    </h2>
    <input
  type="text"
  placeholder="🔍 Search dishes..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"
/>

    <div className="dish-grid">
      {selectedCategory.dishes
  .filter(dish =>
    dish.name.toLowerCase().includes(search.toLowerCase())).map(dish => (
        <ProductCard
          key={dish.id}
          product={dish}
          addToCart={addToCart}
        />
      ))}
    </div>
  </div>
);
}

export default Menu;