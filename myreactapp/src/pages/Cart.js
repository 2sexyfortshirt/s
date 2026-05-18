
import { useState } from "react";
import "./Cart.css";

import { useCart } from "../context/CartContext";

function Cart() {

  const {
    cart,
    updateQuantity,
    removeItem,
    createOrder,
    totalPrice
  } = useCart();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleOrder = async () => {

    const res = await createOrder(
      phone,
      address
    );

    if (res?.id) {
      alert("Заказ оформлен ✅");
    } else {
      alert("Ошибка ❌");
    }
  };

  return (

    <div className="cart-overlay">

      <div className="cart-modal">

        <h2>Your Cart</h2>

        {cart.length === 0 ? (

          <p className="empty-cart">
            Cart is empty
          </p>

        ) : (

          <>

            <div className="cart-items">

              {cart.map(item => (

                <div
                  key={item.id}
                  className="cart-item"
                >

                  <div className="cart-info">

                    <h3>
                      {item.dish.name}
                    </h3>

                    <p>
                      ${item.dish.price}
                    </p>

                  </div>

                  <div className="cart-controls">

                    {/* ➖ */}
                    <button
                      className="qty-btn"
                      onClick={() => {

                        if (item.quantity === 1) {
                          removeItem(item.id);
                        } else {
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          );
                        }
                      }}
                    >
                      −
                    </button>

                    <span className="qty-number">
                      {item.quantity}
                    </span>

                    {/* ➕ */}
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                    {/* 🗑 */}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      ✕
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}
            <div className="cart-total">

              <h3>
                Total: ${totalPrice}
              </h3>

            </div>

            {/* PHONE */}
            <div className="input-group">

              <input
                type="text"
                placeholder=" "
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

              <label>Phone</label>

            </div>

            {/* ADDRESS */}
            <div className="input-group">

              <input
                type="text"
                placeholder=" "
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />

              <label>Address</label>

            </div>

            <button
              className="checkout-btn"
              onClick={handleOrder}
            >
              Checkout
            </button>

          </>

        )}

      </div>

    </div>
  );
}

export default Cart;

