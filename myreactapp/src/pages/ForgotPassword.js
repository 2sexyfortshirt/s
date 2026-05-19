
import { useState } from "react";
import api from "../api";

import "./ForgotPassword.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async () => {

    try {

      await api.post(
        "password-reset/",
        { email }
      );

      alert("Check your email");

    } catch (err) {

      console.log(err.response?.data);

      alert("Error");
    }
  };

  return (

    <div className="forgot-overlay">

      <div className="forgot-modal">

        <div className="forgot-form">

          <h2>Forgot Password</h2>

          <p className="forgot-subtitle">
            Enter your email to reset password
          </p>

          <div className="input-group">

            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label>Email</label>

          </div>

          <button
            className="forgot-btn"
            onClick={handleSubmit}
          >
            Send Reset Link
          </button>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;

