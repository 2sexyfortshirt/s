import { useState } from "react";
import api from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await api.post("password-reset/", { email });
      alert("Check your email");
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Send reset link
      </button>
    </div>
  );
}

export default ForgotPassword;