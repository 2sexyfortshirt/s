import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


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
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <p>
  No account? <span onClick={() => navigate("/register")}>Register</span>
</p>
<p
  style={{ cursor: "pointer", color: "blue" }}
  onClick={() => navigate("/forgot")}
>
  Forgot password?
</p>
    </div>
  );
}

export default Login;