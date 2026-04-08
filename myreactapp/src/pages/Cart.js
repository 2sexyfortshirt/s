import { useEffect,useState } from "react";
import api from "../api";

import { useCart } from "../context/CartContext";



function Cart () {


  const {cart,updateQuantity,removeItem, createOrder, totalPrice } = useCart();

  const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");


 const handleOrder = async () => {
    const res = await createOrder(phone, address);

    if (res?.success) {
      alert("Заказ оформлен ✅");
    } else {
      alert("Ошибка ❌");
    }
  };



  return(
  <div style={{padding:20}}>
  <h2>Cart</h2>

  {cart.length === 0 ?(
  <p> Cart is empty </p>
  ):(
  cart.map(item => (
  <div key={item.id}
  style={{marginBottom:10}}>
  <h3>{item.dish.name}</h3>
  <p>Price:${item.dish.price}</p>
   <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

              {/* ➖ */}
            <button
        onClick={() => {
          if (item.quantity === 1) {
  removeItem(item.id);
} else {
  updateQuantity(item.id, item.quantity - 1);
}
        }}
      >
        -
      </button>

              <span>{item.quantity}</span>

              {/* ➕ */}
              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
              >
                +
              </button>
              {/* 🗑 УДАЛЕНИЕ */}
    <button
      className="remove-btn"
      onClick={() => removeItem(item.id)}
    >
      ✕
    </button>

            </div>

  </div>
   ))
    )}
    {/* 👇 форма заказа */}
      <div style={{ marginTop: "30px" }}>
        <h3>Total: ${totalPrice}</h3>

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* 👇 КНОПКА */}
        <button onClick={handleOrder}>
          Checkout
        </button>
      </div>

  </div>
  );


}

export default Cart;