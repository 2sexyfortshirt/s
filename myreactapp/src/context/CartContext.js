import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const totalPrice = cart.reduce(
  (sum, item) => sum + item.dish.price * item.quantity,
  0
);

  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="))
      ?.split("=")[1];
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("cart/");
      setCart(res.data.cart_items);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 ДОБАВИЛИ СЮДА
  const addToCart = async (product) => {
    try {
      await api.post(
        "cart/add/",
        {
          dish_id: product.id,
          quantity: 1
        },
        {
          headers: {
            "X-CSRFToken": getCSRFToken()
          }
        }
      );

      await fetchCart(); // обновляем корзину

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);


  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(
        `update_cart_item/${itemId}/`,
        { quantity: quantity },
        {
          headers: {
            "X-CSRFToken": getCSRFToken()
          }
        }
      );

      fetchCart(); // обновляем корзину

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);


  const removeItem = async (itemId) => {
  try {
    await api.delete(`delete_item/${itemId}/`, {
      headers: {
        "X-CSRFToken": getCSRFToken()
      }
    });

    fetchCart(); // обновляем корзину

  } catch (err) {
    console.error(err);
  }
};
const createOrder = async (phone, address) => {
  try {
    const res = await api.post(
      "create_order/",
      {
        phone_number: phone,
        delivery_address: address,
      },
      {
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
        withCredentials: true,
      }
    );

    console.log("ORDER SUCCESS:", res.data);

    await fetchCart().catch(e => console.log("cart error", e));

    return res.data;

  } catch (err) {
    console.error("ORDER ERROR:", err.response?.data || err.message);
    throw err;
  }
};
  return (
    <CartContext.Provider value={{ cart, fetchCart,  removeItem, updateQuantity, addToCart, createOrder, totalPrice  }}>
      {children}
    </CartContext.Provider>
  );
};