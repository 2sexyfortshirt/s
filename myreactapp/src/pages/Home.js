import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="home">
      <div className="home-overlay">

        <h1 className="home-title">
          🍔 Welcome to Our Store
        </h1>

        <p className="home-subtitle">
          Delicious food delivered fast to your door
        </p>

        <button
          className="home-button"
          onClick={() => navigate("/menu")}
        >
          View Menu
        </button>


      </div>
    </div>
  );
}

export default Home;