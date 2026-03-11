import React, { useEffect, useState } from 'react';
import AddToCartButton from './AddToCartButton';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Reviews from './Reviews';

import './MenuStyles.css';
import {
  Container,
  Modal,
  List,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';

axios.defaults.withCredentials = true;

const MenuList = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const navigate = useNavigate();

  // Маппинг для проверки, разрешена ли кастомизация для меню
  const ingredientAllowedMenus = {
    3: { allowed: true, label: "Создать свою пиццу" },
    4: { allowed: true, label: "Создать свой бургер" },
  };

  // Функция для проверки, разрешена ли кастомизация для определенного меню
  const isIngredientSelectionAllowed = (menuId) => {
    return ingredientAllowedMenus[menuId]?.allowed;
  };

  // Функция для получения текста кнопки кастомизации для определенного меню
  const getIngredientButtonLabel = (menuId) => {
    return ingredientAllowedMenus[menuId]?.label || "Нет кастомизации";
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get('/menu/');
        setMenuData(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке меню:", error);
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await axios.get('/api/ingredients/');
        setIngredients(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке ингредиентов:", error);
      }
    };

    fetchMenuData();
    fetchIngredients();
    updateCart();
  }, []);

  const handleMenuClick = (menuId) => {
    setSelectedMenuId(menuId);
    setOpenMenuDialog(true); // Открыть модальное окно
  };

  const handleCloseMenuDialog = () => {
    setOpenMenuDialog(false);
    setSelectedMenuId(null); // Сбросить выбранный menuId
  };

  const updateCart = async () => {
    try {
      const response = await axios.get('/api/cart/');
        console.log("Updated cart:", response.data.cart_items);
      setCartItems(response.data.cart_items);
    } catch (error) {
      console.error('Ошибка при обновлении корзины:', error);
    }
  };

  const handleIngredientChange = (ingredientId) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredientId)) {
        return prev.filter((id) => id !== ingredientId);
      } else {
        return [...prev, ingredientId];
      }
    });
  };

  const handleCreateCustomBurger = async () => {
    if (selectedIngredients.length === 0) {
      alert("Пожалуйста, выберите хотя бы один ингредиент!");
      return;
    }

    try {
      const response = await axios.post('/api/cart/add_custom_burger/', {
        ingredients: selectedIngredients,
        menu_id: selectedMenuId,
      });

      if (response.status === 201) {
        updateCart(); // Обновляем содержимое корзины
        navigate('/cart');
      }
    } catch (error) {
      console.error("Ошибка при создании кастомного блюда:", error);
      alert("Произошла ошибка при добавлении кастомного блюда в корзину.");
    } finally {
      setSelectedIngredients([]); // Сброс выбранных ингредиентов
      handleCloseMenuDialog(); // Закрываем диалог
    }
  };

  return (
    <Container maxWidth="md" className="menu-container" style={{ marginTop: '7rem', width: '80%', maxWidth: '1200px' }}>
      <List component="nav">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {menuData.map((menu) => (
            <div key={menu.id}>
              <Box
                onClick={() => handleMenuClick(menu.id)}
                sx={{
                  width: '90%',
                  height: '80px',
                  backgroundColor: '#FF5722', // Сделать более теплым и привлекательным
                  border: '2px solid #FF9800', // Легкая оранжевая обводка
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#ffffff',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  '&:hover': {
                    backgroundColor: '#FF7043',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.05)',
                  },
                }}>
                <RestaurantIcon sx={{ marginRight: 1 }} />
                {menu.dish_type}
              </Box>
            </div>
          ))}
        </Box>
      </List>

      <Dialog open={openMenuDialog} onClose={handleCloseMenuDialog}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#FF5722' }}></DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {menuData
              .filter(menu => menu.id === selectedMenuId)
              .map((menu) => (
                <Grid item xs={12} key={menu.id}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    {menu.dish_type}
                  </Typography>
                  {menu.dishes.map((dish) => (
                    <Card key={dish.id} sx={{ borderRadius: '12px', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {dish.name}
                           <p> {dish.rating}</p>
                            <Reviews dishId={dish.id} />
                        </Typography>
                        <img
                          src={`http://localhost:8000/${dish.picture}`}
                          alt={dish.name}
                          style={{
                            width: '40%',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#555' }}>
                          Описание: {dish.description}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#FF5722', marginTop: '1rem' }}>
                          Цена: {dish.price} USD
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <AddToCartButton
                          dishId={dish.id}
                          selectedIngredients={selectedIngredients}
                          updateCart={updateCart}
                        />
                      </CardActions>
                    </Card>
                  ))}
                </Grid>
              ))}
          </Grid>

          {/* Добавляем кнопку для создания кастомного блюда */}
          {isIngredientSelectionAllowed(selectedMenuId) && (
            <Box sx={{ marginTop: '2rem' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: '#FF5722' }}>
                {getIngredientButtonLabel(selectedMenuId)}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
                {ingredients.map((ingredient) => (
                  <Button
                    key={ingredient.id}
                    variant={selectedIngredients.includes(ingredient.id) ? 'contained' : 'outlined'}
                    onClick={() => handleIngredientChange(ingredient.id)}
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: selectedIngredients.includes(ingredient.id) ? '#FF7043' : '#FFCC80',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: selectedIngredients.includes(ingredient.id) ? '#FF5722' : '#FF9800',
                      },
                    }}
                  >
                    {ingredient.name}
                  </Button>
                ))}
              </Box>

              {/* Кнопка для добавления кастомного бургера */}
              <Button
                onClick={handleCreateCustomBurger}
                variant="contained"
                color="primary"
                sx={{ width: '100%', borderRadius: '8px' }}
              >
                Добавить в корзину
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMenuDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MenuList;
