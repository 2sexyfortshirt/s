import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();




  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const csrfResponse = await axios.get('/api/csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      const response = await axios.post(
        '/api/login/',
        { username, password },
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
        }
      );

      if (response.status === 200) {
        const { access, refresh } = response.data;

        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        onLogin();  // Уведомляем родительский компонент о успешном входе
        navigate('/orders');
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or server error.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
