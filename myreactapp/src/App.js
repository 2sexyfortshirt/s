import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from"./pages/Cart";
import Navbar from "./components/Navbar";
import Login  from "./components/Login";
import OrderDetails from "./components/OrderDetails";
import Register from "./components/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
//import Login from "./auth/Login";



function App() {
  return (

  <BrowserRouter>
  <Navbar/>

  <Routes>
  <Route path="/login" element={<Login/>}/>

  <Route path="/" element={<Home/>}/>
  <Route path="/orders"  element={<OrderDetails />} />
  <Route path="/register" element={<Register />} />
  <Route path="/menu" element={<Menu/>}/>
  <Route path="/cart" element={<Cart/>}/>
  <Route path="/profile" element={<Profile />} />
  <Route path="/forgot" element={<ForgotPassword/>}/>
  <Route path="/reset/:uid/:token" element={<ResetPassword/>}/>
  </Routes>
  </BrowserRouter>

   );
}

export default App;
