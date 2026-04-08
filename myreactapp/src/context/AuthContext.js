import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

// 👉 Хук для удобного использования
export const useAuth = () => useContext(AuthContext);

// 👉 Провайдер
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Проверка авторизации при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("profile/");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔐 LOGIN
 const login = async (username, password) => {
  try {
    console.log("🔐 Sending login request...", { username });

    const res = await api.post("login/", {
      username,
      password,
    });

    console.log("✅ Login success:", res.data);

    setUser(res.data.user);

    if (res.data.access) {
      localStorage.setItem("token", res.data.access);
      console.log("💾 Token saved:", res.data.access);
    }
    if (res.data.refresh) {
  localStorage.setItem("refresh_token", res.data.refresh);
  console.log("💾 Refresh token saved:", res.data.refresh);
}

    return { success: true };
  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err);
    return { success: false, message: "Login failed" };
  }
};
 const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      await api.post("logout/", {
        refresh: refreshToken
      });
    }

    console.log("✅ Logout success");
  } catch (err) {
    console.error("❌ Logout error:", err.response?.data || err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    window.location.href = "/";
  }
};
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};