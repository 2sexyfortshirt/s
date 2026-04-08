import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [statusChoices, setStatusChoices] = useState([]);
  const { user } = useAuth();

  // 🔥 загрузка заказов
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("orders/");
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Orders error:", err.response?.data || err);
        setError(err.response?.data?.error || "Error loading orders");
      }
    };

    fetchOrders();
  }, []);

  // 🔥 загрузка статусов
  useEffect(() => {
    const fetchStatusChoices = async () => {
      try {
        const res = await api.get("get_status_choices/");
        setStatusChoices(res.data.choices);
      } catch (err) {
        console.error("❌ Status choices error:", err);
      }
    };

    fetchStatusChoices();
  }, []);

  // 🔥 обновление статуса (ИСПРАВЛЕН URL)
  const updateStatus = async (id, status) => {
    console.log("🔥 Updating:", id, status);

    try {
      await api.post(`order/${id}/status/`, { status });

      console.log("✅ Updated!");

      // обновляем UI
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err);
      alert("Error updating status");
    }
  };

  if (error) return <div>❌ {error}</div>;
  if (!orders.length) return <div>⏳ Loading...</div>;

  return (
    <div>
      <h2>All Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>Order #{order.id}</h3>

          <p>DEBUG:<b>Status:</b></p>

          {user?.is_staff ? (
           <select
  key={order.status} // 🔥 forcing re-render
  value={order.status}
  onChange={(e) => updateStatus(order.id, e.target.value)}
>
              {statusChoices.length > 0 ? (
                statusChoices.map(choice => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </select>
          ) : (
            <p>{order.status}</p>
          )}

          <p><b>Total:</b> {order.total_price}</p>
          <p><b>Phone:</b> {order.phone_number}</p>
          <p><b>Address:</b> {order.delivery_address}</p>

          <h4>Items:</h4>
          {order.cart?.items?.map((item) => (
            <div key={item.id}>
              {item.dish?.name || "Custom dish"} x {item.quantity}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;