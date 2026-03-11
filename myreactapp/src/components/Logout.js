import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();

   const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken"); // Извлекаем refresh токен из localStorage

            if (!refreshToken) {
                console.error("No refresh token available");
                return;
            }

            const response = await axios.post(
                "/api/logout/",
                { refresh: refreshToken },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken"), // Убедитесь, что CSRF токен передается, если требуется
                    },
                    withCredentials: true, // Если сервер требует куки
                }
            );

            if (response.status === 204) {
                console.log("Successfully logged out");
                localStorage.removeItem("refreshToken");
                 localStorage.removeItem('accessToken');

                localStorage.setItem('isAuthenticated', 'false'); // Обновляем статус аутентификации

                onLogout();

                navigate('/login');
            }
        } catch (error) {
            console.error("Error logging out:", error);

            if (error.response) {
                // Сервер вернул ответ с ошибкой
                const status = error.response.status;

                if (status === 400) {
                    const errorMessage = error.response.data?.detail || "Bad request.";
                    alert(`Logout failed: ${errorMessage}`);
                } else if (status === 401) {
                    alert("You are not authorized to perform this action.");
                } else {
                    alert("Unexpected error occurred during logout.");
                }
            } else {
                // Ошибка соединения или другая проблема
                alert("Failed to communicate with the server.");
            }
        }
    };

    // Функция для получения CSRF токена (если используется Django)
    const getCookie = (name) => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
};

export default Logout;