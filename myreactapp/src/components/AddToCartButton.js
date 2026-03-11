import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const AddToCartButton = ({ dishId, selectedIngredients = [], updateCart }) => {
  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = React.useState('');

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        '/api/cart/add/',
        {
          dish_id: dishId,
          quantity: 1,
          ingredients: selectedIngredients, // массив id
        },
        {
          withCredentials: true, // ✅ ВАЖНО — сюда, а не в body
        }
      );

      // Если backend возвращает cart_items
      if (response.data?.cart_items) {
        updateCart(response.data.cart_items);
      } else {
        // fallback — можно просто перезагрузить корзину
        updateCart();
      }

      setCartMessage('Блюдо добавлено в корзину!');
      navigate('/cart');

    } catch (error) {
      console.error('Ошибка при добавлении блюда в корзину:', error);
      setCartMessage('Ошибка при добавлении блюда в корзину!');
    }
  };

  return (
    <div>
      <button onClick={handleAddToCart}>
        Добавить в корзину
      </button>
      {cartMessage && <p>{cartMessage}</p>}
    </div>
  );
};

export default AddToCartButton;