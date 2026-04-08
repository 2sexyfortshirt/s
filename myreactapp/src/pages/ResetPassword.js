import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api";

function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      console.log("📤 Sending reset request:");
      console.log("uid:", uid);
      console.log("token:", token);
      console.log("password:", password);

      const res = await api.post("password-reset-confirm/", {
        uid,
        token,
       new_password: password,
      });

      console.log("✅ Response:", res.data);

      alert("Password changed");
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err);
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div>
      <h2>New Password</h2>

      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Change password
      </button>
    </div>
  );
}

export default ResetPassword;