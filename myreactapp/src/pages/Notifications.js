import { useEffect, useState } from "react";
import api from "../api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("notifications/")
      .then(res => setNotifications(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px"
            }}
          >
            <h4>{notification.title}</h4>

            <p>{notification.message}</p>

            <small>
              {notification.created_at}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;