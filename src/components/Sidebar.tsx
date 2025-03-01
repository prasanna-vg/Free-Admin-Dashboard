import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { HiLogin, HiOutlineHome, HiOutlineDeviceMobile, HiOutlineTag, HiOutlineTruck, HiOutlineClipboardList, HiOutlineCake } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navActiveClass = 'nav-active';
  const navInactiveClass = 'nav-inactive';

  const listItemStyles = {
    '&.nav-active': {
      backgroundColor: '#3f51b5',
      color: '#fff',
    },
    '&.nav-inactive': {
      color: '#fff',
    },
    '&:hover': {
      backgroundColor: '#3f51b5',
      color: '#fff',
    },
  };

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: '#1e1e2d',
          color: '#fff',
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <Typography variant="h6" noWrap>
          Admin App
        </Typography>
      </Box>
      <List>
        <ListItem
          button
          component={NavLink}
          to="/landing-page"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineHome />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/categories"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineTag />
          </ListItemIcon>
          <ListItemText primary="Data" />
        </ListItem>
        {/* <ListItem
          button
          component={NavLink}
          to="/subcategories"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineTag />
          </ListItemIcon>
          <ListItemText primary="Sub categories" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/products"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineDeviceMobile />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem> */}
        <ListItem
          button
          component={NavLink}
          to="/orders"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineClipboardList />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/pick-and-pack"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineCake />
          </ListItemIcon>
          <ListItemText primary="Pick and Pack" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/delivery"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineTruck />
          </ListItemIcon>
          <ListItemText primary="Delivery" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/delivery-partners"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineCake />
          </ListItemIcon>
          <ListItemText primary="Delivery Partners" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/inventory"
          className={(isActiveObj: { isActive: boolean }) =>
            isActiveObj.isActive ? navActiveClass : navInactiveClass
          }
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiOutlineCake />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItem>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            color: '#fff',
            '&:hover': {
              backgroundColor: '#f44336',
              color: '#fff',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HiLogin />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;