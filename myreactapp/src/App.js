import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MenuList from './components/MenuList';
import About from './components/About';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Header from './components/Header';
import OrderUpdates from './components/OrderUpdates';
import Login from './components/Login';
import Logout from './components/Logout';

const App = () => {
     const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

       const ProtectedRoute = ({ element, ...rest }) => {
        return isAuthenticated ? element : <Navigate to="/login" />;
    };



  return (
    <Router>
      <Header cartData={cartData} setCartData={setCartData} />
      <Navbar />
      <Routes>
        {/* Защищенный маршрут для /orders */}
        <Route path="/orders" element={<ProtectedRoute element={<OrderUpdates />} />} />
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuList />} />
       <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/*<Route path="/logout" element={<Logout onLogout={() => console.log('Logged out')} />} */}
        <Route path="/cart" element={<Cart cartData={cartData} setCartData={setCartData} />} />
      </Routes>
    </Router>
  );
};

export default App;
