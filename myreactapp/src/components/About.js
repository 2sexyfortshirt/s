import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import './About.css';

const About = () => {
  return (
    <Box
      className="about-container"
      sx={{
    marginTop: '50px',

    backgroundColor: '#FF5722',
    color: '#333',

    '@media (max-width: 768px)': {
    marginTop: '50px',

    width: '90%', // Ширина для мобильных устройств
    padding: '10px', // Уменьшение отступов
  },
}}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          margin: '20px 0',
          color: '#ff5722', // Главный цвет заголовка
        }}
      >
        About Us
      </Typography>
      <Typography variant="body1" sx={{ margin: '20px', lineHeight: '1.8' }}>
        Welcome to <strong>ChikoWorldKitchen!</strong> Founded in [Year], we strive to bring the best culinary experience
        to our customers. Our mission is to provide delicious food using the freshest ingredients while ensuring excellent service.
      </Typography>

      <Typography
        variant="h6"
        align="center"
        sx={{
          margin: '20px 0',
          color: '#e64a19', // Вторичный цвет
        }}
      >
        Meet Our Team
      </Typography>
      <Typography variant="body1" sx={{ margin: '20px', lineHeight: '1.8' }}>
        Our chef, <strong>[Chef's Name]</strong>, has over [X years] of experience in the culinary world and is passionate
        about creating mouthwatering dishes that our guests love.
      </Typography>

      <Typography
        variant="h6"
        align="center"
        sx={{
          margin: '20px 0',
          color: '#e64a19',
        }}
      >
        Our Menu
      </Typography>
      <Typography variant="body1" sx={{ margin: '20px', lineHeight: '1.8' }}>
        Check out our menu to explore our variety of delicious dishes, including [mention a few dishes].
      </Typography>

      <Box textAlign="center" mt={4}>
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
          href="/menu"
        >
          View Menu
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: '#ff5722',
            color: '#ff5722',
            padding: '10px 20px',
            marginLeft: '10px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#ff5722',
              color: '#fff',
            },
          }}
          href="/contact"
        >
          Contact Us
        </Button>
      </Box>
    </Box>
  );
};

export default About;
