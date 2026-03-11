import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, IconButton, Collapse } from '@mui/material';
import Rating from '@mui/material/Rating';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';

const Reviews = ({ dishId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Загрузка отзывов при монтировании
  useEffect(() => {
    if (isExpanded) {
      fetchReviews();
      fetchAverageRating();
    }
  }, [dishId, isExpanded]);

  // Функция для отправки нового отзыва
  const handleAddReview = async () => {
    if (!newName.trim() || !newReview.trim() || newRating === 0) {
      setError('Заполните все поля и выберите рейтинг.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/reviews/${dishId}/`, {
        name: newName,
        comment: newReview,
        rating: newRating,
        dish: dishId,
      });
      setReviews((prev) => [...prev, response.data]); // Добавляем новый отзыв
      setNewName('');
      setNewReview('');
      setNewRating(0);
      setError(null);
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error);
      setError('Не удалось отправить отзыв. Попробуйте снова.');
    }
  };

   const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/average-rating/${dishId}/`);
      setAverageRating(response.data.average_rating);
    } catch (error) {
      console.error('Ошибка при загрузке среднего рейтинга:', error);
    }
  };

  // Функция для получения отзывов
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reviews/${dishId}/`);
      setReviews(response.data);
      setError(null); // Сбрасываем ошибку
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
      setError('Не удалось загрузить отзывы. Попробуйте позже.');
    }
  };

  // Переключение отображения отзывов
  const toggleReviews = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box sx={{ marginTop: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Отзывы
        </Typography>
        Средний рейтинг:
        <Typography sx={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
          {averageRating} <StarIcon sx={{ color: '#FFD700', marginLeft: '0.25rem' }} />
        </Typography>
        <IconButton onClick={toggleReviews}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        {error && (
          <Typography variant="body2" sx={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </Typography>
        )}

        {reviews.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#777' }}>
            Отзывов пока нет.
          </Typography>
        ) : (
          <List>
            {reviews.map((review) => (
              <ListItem key={review.id} sx={{ padding: '0.5rem 0' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.9rem' }}>
                    {review.name}: {review.comment}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ marginTop: '1rem' }}>
         <TextField
  label="Ваше имя"
  value={newName}
  onChange={(e) => setNewName(e.target.value)}
  fullWidth
  InputProps={{
    sx: {
      padding: '10px', // Внутренний отступ текста
      fontSize: '16px', // Размер текста
      border: '1px solid #ccc', // Граница input
      borderRadius: '8px', // Закругленные края
      backgroundColor: '#fff', // Фон input
      '&:hover': {
        borderColor: '#4caf50', // Граница при наведении
      },
      '&:focus': {
        borderColor: '#4caf50', // Граница при фокусе
        outline: 'none', // Убирает стандартное обрамление
      },
    },
  }}
  sx={{
    marginBottom: '1rem',
  }}
/>

          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Typography variant="body2" sx={{ marginRight: '1rem', fontSize: '0.9rem' }}>
              Ваш рейтинг:
            </Typography>
            <Rating
              value={newRating}
              onChange={(e, newValue) => setNewRating(newValue)}
              size="medium"
            />
          </Box>
          <TextField
            label="Оставить отзыв"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            fullWidth
            multiline
            rows={2}
            sx={{ marginBottom: '1rem' }}
          />
          <Button variant="contained" onClick={handleAddReview} sx={{ width: '100%' }}>
            Отправить отзыв
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Reviews;
