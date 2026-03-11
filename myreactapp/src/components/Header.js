import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, IconButton, Modal, Typography, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';


import axios from 'axios';
import './Header.css';

const Header = ({ cartData, setCartData }) => {
  const [localCartData, setLocalCartData] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  // Обновляем локальное состояние и количество товаров
  useEffect(() => {
    setLocalCartData(cartData);
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemCount(totalItems);
  }, [cartData]);

const handleRemoveItem = async (itemId) => {
  try {
    const response = await axios.delete(`/api/delete_item/${itemId}/`);
    if (response.data.success) {
      setLocalCartData((prevItems) => prevItems.filter((item) => item.id !== itemId));
      setCartData((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== itemId);
        return updatedItems;
      });

      // Используем useEffect для навигации после обновления cartData
      setTimeout(() => {
        if (cartData.length === 1) {
          navigate('/menu');
        }
      }, 0);
    }
  } catch (error) {
    console.error('Ошибка при удалении предмета:', error);
  }
};

   const handleRemoveIngredient = async (ingredientId) => {
  try {
    const response = await axios.delete(`/api/remove_ingredient/${ingredientId}/`);
    if (response.data.success) {
      // Обновляем данные корзины, удаляя выбранный ингредиент
      setCartData(prevItems =>
        prevItems.map(item => {
          const updatedIngredients = item.ingredients.filter(ingredient => ingredient.id !== ingredientId);
          return { ...item, ingredients: updatedIngredients };
        })
      );
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error('Ошибка при удалении ингредиента:', error);
  }
};


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <header style={{ padding: '1rem', background: 'linear-gradient(135deg, #f0a830, #8dc26f)', display: 'flex', justifyContent: 'space-between' }}>

       {cartItemCount > 0 && ( // Условие отображения значка корзины
      <div className="floating-cart">

        <IconButton style={{ position: 'relative' }} onClick={handleOpen}>
          <Badge badgeContent={cartItemCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

      </div>
         )}

      {/* Модальное окно */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            '@media (max-width: 768px)': {
      marginTop: '30px', // Настройки для мобильных устройств
      padding: '10px',
      width:'70%',
    },


          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" >
            <Typography variant="h6">Ваша корзина</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Корзина внутри модального окна */}
         <ul>
  {localCartData.length === 0 ? (
    <Typography variant="body1">Корзина пуста</Typography>
  ) : (
    localCartData.map((item) => (
      <li key={item.id} style={{ marginBottom: '1rem' }}>
        <h2>{item.dish?.name || item.dish_type}</h2> {/* Проверка на существование item.dish */}
        <p>Количество: {item.quantity}</p>
        <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
      </li>
    ))
  )}
</ul>

          <button onClick={handleClose} style={{ marginTop: '1rem' }}>Закрыть</button>
        </Box>
      </Modal>
    </header>
  );
};

export default Header;
