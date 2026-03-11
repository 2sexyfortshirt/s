import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import './Navbar.css';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      style={{
        width: 250,
        backgroundColor: '#2e2e2e', // Тёмно-серый фон
        height: '100%',
        color: '#fff', // Белый текст
      }}
    >
      <List>
        <ListItem button component={Link} to="/" style={{ color: 'orange' }}>
          <ListItemText primary="Home" />
        </ListItem>
        <Divider style={{ backgroundColor: 'grey' }} />
        <ListItem button component={Link} to="/menu" style={{ color: 'orange' }}>
          <ListItemText primary="Menu" />
        </ListItem>
        <Divider style={{ backgroundColor: 'grey' }} />
        <ListItem button component={Link} to="/about" style={{ color: 'orange' }}>
          <ListItemText primary="About" />
        </ListItem>
        <Divider style={{ backgroundColor: 'grey' }} />
        <ListItem button component={Link} to="/contact" style={{ color: 'orange' }}>
          <ListItemText primary="Contact" />
        </ListItem>
        <Divider style={{ backgroundColor: 'grey' }} />
        <ListItem button component={Link} to="/cart" style={{ color: 'orange' }}>
          <ListItemText primary="Cart" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: '#2e2e2e', // Серый фон для AppBar
        color: 'orange', // Оранжевые акценты
      }}
    >
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              style={{ color: 'orange' }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              {drawerContent}
            </Drawer>
            <img
              src="/images/chiko.svg"
              alt="Chiko Logo"
              style={{
                height: '40px',
                width: '40px',
                marginRight: '10px',
                borderRadius: '20px',
                 // Белый фон для логотипа
              }}
              className="logo"
            />
            <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
              ChikoWorldKitchen
            </Typography>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img
                src="/images/chiko.svg"
                alt="Chiko Logo"
                style={{
                  height: '64px',
                  width: '80px',
                  marginRight: '10px',
                  borderRadius: '40px',

                }}
                className="logo"
              />
              <Typography variant="h6" component="div">
                ChikoWorldKitchen
              </Typography>
            </div>
            <div>
              <Link to="/" style={{ textDecoration: 'none', color: 'orange', margin: '0 10px' }}>
                Home
              </Link>
              <Link to="/menu" style={{ textDecoration: 'none', color: 'orange', margin: '0 10px' }}>
                Menu
              </Link>
              <Link to="/about" style={{ textDecoration: 'none', color: 'orange', margin: '0 10px' }}>
                About
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'orange', margin: '0 10px' }}>
                Contact
              </Link>
            </div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
