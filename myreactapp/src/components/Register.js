
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("register/", {
        username,
        password,
        email,
      });

      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Registration error"
      );
    }
  };

  return (
    <div className="register-overlay">

      <div className="register-modal">

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          <h2>Create Account</h2>

          <p className="register-subtitle">
            Join our platform today
          </p>

          {/* USERNAME */}
          <div className="input-group">

            <input
              type="text"
              placeholder=" "
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

            <label>Username</label>

          </div>

          {/* EMAIL */}
          <div className="input-group">

            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label>Email</label>

          </div>

          {/* PASSWORD */}
          <div className="input-group">

            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <label>Password</label>

          </div>

          <button type="submit">
            Create Account
          </button>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

        </form>

      </div>

    </div>
  );
}

export default Register;

