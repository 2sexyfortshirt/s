
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {

  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    const res = await login(username, password);

    if (res.success) {
      window.location.href = "/";
    } else {
      alert(res.message);
    }
  };

  return (

    <div className="login-overlay">

      <div className="login-modal">

        <div className="login-form">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to continue
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
            />

            <label>Username</label>

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
            />

            <label>Password</label>

          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
          >
            Login
          </button>

          <p className="register-link">
            No account?

            <span onClick={() =>
              navigate("/register")
            }>
              Register
            </span>
          </p>

          <p
            className="forgot-link"
            onClick={() =>
              navigate("/forgot")
            }
          >
            Forgot password?
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;

