import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("my-orders/");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Profile</h2>

      <p><b>Username:</b> {user?.username}</p>

      <button onClick={logout}>Logout</button>

      <h3>Your Orders</h3>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (
        <div key={order.id}>
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: {order.total_price}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;