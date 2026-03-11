import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Modal,TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import './Home.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ShoppingCart } from '@mui/icons-material';
import { motion } from "framer-motion";
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),

});

// Слайдер настройки
const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

// Массив изображений для слайдера
const images = [

    { id: 2, src: '/images/steak2.jpg', alt: 'Dish 2' },
    { id: 3, src: '/images/steak1.jpg', alt: 'Dish 3' },
    { id: 4, src: '/images/steak4.jpg', alt: 'Dish 4' },
    { id: 5, src: '/images/steak5.jpg', alt:'Dish 5'},

];

// Стили модального окна
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,

    bgcolor: 'background.paper',
    boxShadow: 24,
      p: { xs: 2, sm: 4 },
    borderRadius: '8px',
     '@media (max-width: 600px)': {
        p: 1, // Уменьшение отступов для мобильных устройств
    },
};

const Home = () => {
    const [order, setOrder] = useState(null); // Заказ
    const [error, setError] = useState(""); // Ошибки
    const [orderId, setOrderId] = useState('');
    const [modalOpen, setModalOpen] = useState(false); // Состояние модального окна
    const [coordinates, setCoordinates] = useState(null); // Координаты для карты
      const [isTracking, setIsTracking] = useState(false);

    // Функция получения данных о заказе по ID
    const fetchOrder = async () => {
    try {
        const response = await axios.get(`/api/order/${orderId}`);
        setOrder(response.data);
        setError("");
    } catch (err) {
        setError(err.response?.data?.error || "Ошибка при загрузке данных");
        setOrder(null);
    }
};


    // Открытие модального окна
    const handleOpenModal = async () => {
        await fetchOrder();
        setModalOpen(true);
    };

      // Закрытие модального окна
    const handleCloseModal = () => {
        setModalOpen(false);
        setIsTracking(false);
        setOrder(null);
        setError('');
        setOrderId('');
    };

     const handleTrackOrder = async () => {
    if (!orderId) {
        setError('Введите номер заказа.');
        return;
    }
    await fetchOrder();
    setIsTracking(true);
};


    // Периодическое обновление координат для движения маркера (если эмуляция нужна)
    useEffect(() => {
        if (isTracking && modalOpen && order) {
            const interval = setInterval(() => {
                axios.get('/api/get_emulated_coordinates/')
                    .then(response => setCoordinates(response.data))
                    .catch(err => console.error("Ошибка обновления координат", err));
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isTracking,modalOpen, order]);

    return (

        <div>
            {/* Заголовок */}
            <Typography
                component={motion.h1}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                variant="h2"
                align="center"
                sx={{
                    marginTop: '40px',
                    padding: '20px',
                    wordBreak: 'break-word',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                }}
            >
                ChikoWorldKitchen
            </Typography>





            {/* Кнопка заказа */}
            <Box textAlign="center" mt={2}>
  <Button
    variant="outlined"
    sx={{
      borderColor: '#ff5722',
      color: '#ff5722',
      padding: '10px 20px',
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: '#ff5722',
        color: '#fff',
      },
      '@media (hover: none)': {
        '&:hover': {
          backgroundColor: 'transparent',
          color: '#ff5722',
        },
        '&:active': {
          backgroundColor: '#ff5722',
          color: '#fff',
        },
      },
    }}
    component={Link}
    to="/menu"
  >
    <ShoppingCart sx={{ marginRight: '8px' }} />
    <Typography variant="button">Order Now</Typography>
  </Button>
</Box>

<Typography
    component={motion.h1} // Используем тот же эффект анимации
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    variant="h5"
    align="center"
    sx={{
        color: '#FF5733', // Цвет, как у заголовка (или 'primary.main', если использована тема)
        marginTop: '40px',
        padding: '20px',
        wordBreak: 'break-word',
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Размеры как у заголовка
        fontWeight: 600, // Если хотите такой же жирный шрифт
    }}
>
    Find Us
</Typography>



<div className="map-container">

    <iframe
        title="Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.8044321523753!2d31.67192437554203!3d36.655155175862916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dcade6fff64a69%3A0x4df6004946205b1e!2sChiko%20World%20Kitchen!5e0!3m2!1sru!2str!4v1695163685907!5m2!1sru!2str"
        width="100%" // Адаптивная ширина для мобильных устройств
        height="450"
        style={{
             border: 0,
            maxWidth: '100%', // Ограничиваем максимальную ширину для больших экранов
            position: 'relative',
        }}
        allowFullScreen=""
        loading="lazy"
    ></iframe>
    </div>





            {/* Кнопка отслеживания заказа */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#ff5722',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#e64a19',
                        },
                    }}
                    onClick={handleOpenModal}
                >
                    Отследить заказ
                </Button>
            </div>





   <div className="slider-container">
    <Slider {...settings}>
        {images.map(image => (
            <div key={image.id} style={{  justifyContent: 'center' }}>
                <img
                    src={image.src}
                    alt={image.alt}
                    style={{
                        width: '98%',
                         // На обычных экранах 100% ширины
                        height: '250px', // Высота по умолчанию
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
            </div>
        ))}
    </Slider>
</div>



            {/* Модальное окно */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
                        Местоположение заказа
                    </Typography>
                     {/* Форма ввода номера заказа */}
                    {!isTracking ? (
                        <>
                            <TextField
                                fullWidth
                                label="Введите номер заказа"
                                variant="outlined"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                sx={{ marginBottom: '20px', fontSize: '14px', }}
                                 inputProps={{
                                   style: { fontSize: '14px' },
                                 }}
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    backgroundColor: '#ff5722',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#e64a19',
                                    },
                                     fontSize: '14px',
                                }}
                                onClick={handleTrackOrder}
                            >
                                Найти заказ
                            </Button>
                              {error && (
                                <Typography color="error" sx={{ marginTop: '10px' }}>
                                    {error}
                                </Typography>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Карта с отслеживанием */}
                            {error && <Typography color="error">{error}</Typography>}
                            {order ? (
                                <MapContainer
                                    center={[
                                           coordinates?.delivery_latitude || order?.delivery_latitude || 0,
                                           coordinates?.delivery_longitude || order?.delivery_longitude || 0,
                                    ]}
                                    zoom={13}
                                    style={{ height: '400px', width: '100%', borderRadius: '8px',

                                      }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"/>
                                    <Marker
                                        position={[
                                            coordinates?.delivery_latitude || order.delivery_latitude,
                                            coordinates?.delivery_longitude || order.delivery_longitude,
                                        ]}>
                                        <Popup>
                                            <strong>Адрес доставки:</strong> {order.delivery_address}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <Typography>Загрузка карты...</Typography>
                            )}
                        </>
                    )}
                </Box>


            </Modal>

        </div>


    );

};

export default Home;
