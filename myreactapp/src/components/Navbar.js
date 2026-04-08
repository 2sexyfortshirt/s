import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [showMiniCart, setShowMiniCart] = useState(false);

  const { user, logout } = useAuth(); // 👈 ВАЖНО
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/menu" className="nav-link">Menu</Link>
        <Link to="/cart" className="nav-link">Cart</Link>
        <Link to="/" className="nav-link">Home</Link>
      </div>

      <div className="navbar-right">

        {/* 🛒 КОРЗИНА */}
        <div
          className="cart-icon"
          onMouseEnter={() => setShowMiniCart(true)}
          onMouseLeave={() => setShowMiniCart(false)}
        >
          🛒 {totalItems}

          {showMiniCart && cart.length > 0 && (
            <div className="mini-cart">
              {cart.map(item => (
                <div key={item.id} className="mini-cart-item">
                  {item.dish.name} x {item.quantity}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔐 AUTH */}
        {user ? (
          <div className="auth-block">
            <span className="username">👤 {user.username}</span>
            <button className="nav-button" onClick={logout}>
              Logout
            </button>
             <button onClick={() => navigate("/profile")}>
    Profile
  </button>
          </div>
        ) : (
        <div>
          <button
            className="nav-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button onClick={() => navigate("/register")}>
  Register
</button>
</div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;