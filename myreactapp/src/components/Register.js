import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("register/", { username, password,email });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration error");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input
        type="text"
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
      <input
      type="email"
      placeholder="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Create account</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default Register;