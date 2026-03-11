import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import {Typography,Button} from '@mui/material';





axios.defaults.withCredentials = true;


const Cart = ({ cartData, setCartData}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);


  const [orderMessage, setOrderMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phone, setPhone] = useState('');
  const [menuData, setMenuData] = useState([]);
   const [selectedDishType, setSelectedDishType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();




const fetchCartItems = async () => {
  try {
    const { data } = await axios.get(
      '/api/cart/',

      { withCredentials: true }
    );

    console.log('Cart response:', data);


    setCartData(data.cart_items ?? []);
  } catch (error) {
    console.error('Cart fetch error:', error);
    setCartData([]);
  }
};
   const fetchMenuData = async () => {
      try {
        const response = await axios.get('/menu/');
        setMenuData(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке меню:", error);
      }
}


    const handleSelectIngredient = (itemId) => {
    const selectedItem = cartData.find(item => item.id === itemId);
    // Проверка, является ли выбранный элемент бургером или пиццей
    if (selectedItem.dish_type === 'Burgers' || selectedItem.dish_type === 'Pizza') {
      setSelectedItemId(itemId);
      setIsModalOpen(true);
    } else {
      alert('Ингредиенты могут быть выбраны только для бургеров и пиццы');
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      if (newQuantity > 0) {
        const response = await axios.put(`/api/update_cart_item/${itemId}/`, { quantity: newQuantity });
        console.log('Ответ от сервера:', response.data);
        fetchCartItems();
      } else {
        console.error('Количество не может быть меньше 1');
      }
    } catch (error) {
      console.error('Ошибка при изменении количества товара:', error);
      console.log('itemId:', itemId);
    }
  };

 const handleAddToCartButton = async (dishId) => {
  try {
    const { data } = await axios.post(
      'api/cart/add/',
      {
        dish_id: dishId,
        quantity: 1,
        ingredients: selectedIngredients || [],
      },
      { withCredentials: true }
    );

    console.log('Cart after add:', data);

    // если backend возвращает cart_items
    if (data.cart_items) {
      setCartData(data.cart_items);
    } else {
      fetchCartItems(); // fallback
    }

  } catch (error) {
    console.error('Add to cart error:', error);
  }
};
    const handleSelectIngredients = (itemId, ingredients) => {
    setSelectedIngredients((prevIngredients) => ({
      ...prevIngredients,
      [itemId]: ingredients,
    }));
    setIsModalOpen(false);
  };


  useEffect(() => {
    fetchCartItems();
     fetchMenuData();
  }, []); // Вызываем fetchCartItems при изменении updateFlag


  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleAddressChange = (event) => {
    setDeliveryAddress(event.target.value);
  };

const handleRemoveItem = async (itemId) => {
  try {
    const response = await axios.delete(`/api/delete_item/${itemId}/`);
    if (response.data.success) {
      setCartData((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== itemId);
        if (updatedItems.length === 0) {
          navigate('/menu');
        }


        return updatedItems;

      });
    }
  } catch (error) {
    console.error("Ошибка при удалении предмета:", error);
  }
};

const handleRemoveIngredient = async (itemId, ingredientId) => {
  try {
    const response = await axios.delete(`/api/remove_ingredient/${itemId}/${ingredientId}/`);
    if (response.data.success) {
      setCartData((prevItems) => prevItems.map((item) => {
        if (item.id === itemId) {
          const updatedIngredients = item.ingredients.filter(ingredient => ingredient.id !== ingredientId);
          if (updatedIngredients.length === 0) return null;
          return { ...item, ingredients: updatedIngredients };
        }
        return item;
      }).filter(item => item !== null));
    }
  } catch (error) {
    console.error("Ошибка при удалении ингредиента:", error);
  }
};

  const handleOrder = async () => {
  if (!phone || !deliveryAddress) {
      setOrderMessage('Введите номер телефона и адрес доставки!');
      return;
    }

    try {
      const response = await axios.post('/api/create_order/',{
        cart_id: cartData[0].cart_id,
        phone_number: phone,
        delivery_address: deliveryAddress,
        credentials: 'include',

      });
      if (response.data && response.data.success) {
        setOrderMessage('Ваш заказ успешно оформлен!');
        setOrderDetails(response.data.order);

        setTimeout(() => {
         setCartData([]);



          navigate('/');
        }, 3000);
      } else {
        setOrderMessage('Произошла ошибка при оформлении заказа.');
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setOrderMessage('Не удалось оформить заказ. Попробуйте снова.');
    }
  };
      const openModal = () => setIsModalOpen(true);
       const handleCloseModal = () => setIsModalOpen(false);


    const uniqueDishTypes = Array.from(new Set(menuData.map(item => item.dish_type)));


 return (
    <>
        {cartData !== null && cartData.length > 0 && (
        <div className="cart-container" style={{ marginTop: '50px' }}>
          <h1>Корзина</h1>
          <ul>
              {cartData.map((item, index) => (
                <li key={item.id || index}>
                {/*<pre>{JSON.stringify(item, null, 2)}</pre>  Отображение данных элемента */}
                {item.dish ? (
                  <>
                    <h2>
                      {item.dish_type === 'Burgers'
                        ? 'Your Special Burger'
                        : item.dish_type === 'Pizza'
                        ? 'Special Pizza'
                        : item.custom_dish_type}
                    </h2>
                    <p>Название: {item.dish?.name || "Нет названия"}</p>
                    <p>Количество: {item.quantity}</p>


                    <p>Цена: ${item.custom_dish_price || item.dish.price}</p>


                    {item.ingredients && item.ingredients.length > 0 ? (
                      <div>
                        <h4>Ингредиенты:</h4>
                        <ul>
                          {item.ingredients.map((ingredient) => (
                            <li key={ingredient.id}>
                              {ingredient.name} (доп. цена: {ingredient.extra_cost})
                               <button
                    onClick={() => handleRemoveIngredient( item.id,ingredient.id)}
                    style={{ marginLeft: '10px', color: 'red' }}
                  >
                    Удалить
                  </button>

                            </li>
                          ))}
                        </ul>
                      </div>


                       ) : !item.dish?.name ? ( // Добавлено условие
                      <p>Ингредиенты не выбраны</p>
                    ) : null}







                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                    <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
                  </>
                ) : (
                  <>
                   <h2>   {item.dish_type === 'Burgers'
                        ? 'Your Special Burger'
                        : item.dish_type === 'Pizza'
                        ? 'Special Pizza'
                        : item.dish_type}
                    </h2>
                   <p>Цена: ${item.custom_dish_price || item.dish.price}</p>



                    {item.ingredients && item.ingredients.length > 0 ? (
                      <div>
                        <h4>Ингредиенты:</h4>
                        <ul>
                          {item.ingredients.map((ingredient) => (
                            <li key={ingredient.id}>
                              {ingredient.name} (доп. цена: {ingredient.extra_cost})
                               <button
                    onClick={() => handleRemoveIngredient(item.id,ingredient.id)}
                    style={{ marginLeft: '10px', color: 'red' }}
                  >
                    Удалить
                  </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                            <div>
    <p>Ингредиенты не выбраны</p>

  </div>


                    )}
                    {/* Кнопки для изменения количества кастомного блюда */}
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}  // Отключаем кнопку, если количество <= 1
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
                  </>
                )}

              </li>
            ))}
          </ul>


          <div className="phone-form">
            <label>Ваш номер телефона:</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 123 456 7890"
              required
            />
            <label>Адрес для доставки:</label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={handleAddressChange}
            />
          </div>
          {cartData.length > 0 && (
            <button onClick={handleOrder} className="order-button">
              Оформить заказ
            </button>
          )}
          {orderMessage && <p>{orderMessage}</p>}
          {orderDetails && (
            <div className="order-confirmation">
              <h2>Ваш заказ подтвержден!</h2>
              <p>Номер заказа: {orderDetails.id}</p>
              <p>Общая сумма: {orderDetails.total_price} usd</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Cart;