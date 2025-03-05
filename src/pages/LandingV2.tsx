import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {  HiArrowSmUp } from 'react-icons/hi';
import { fetchUserAnalytics } from '../utils/apiService';
import { Container, Typography, Paper, Grid, Box } from '@mui/material';

const LandingV2 = () => {
  const [analytics, setAnalytics] = useState<any>({
    users: 0,
    orders: 0,
    sales: 0,
    products: 0,
    categories: 0,
    subCategories: 0,
  });

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const data = await fetchUserAnalytics();
        setAnalytics(data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    getAnalytics();
  }, []);

  return (
    <Box display="flex">
      <Container>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} className="p-4">
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{analytics.users}</Typography>
              <Typography variant="body2" color="textSecondary">
                <HiArrowSmUp /> 0%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} className="p-4">
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{analytics.orders}</Typography>
              <Typography variant="body2" color="textSecondary">
                <HiArrowSmUp /> 0%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} className="p-4">
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4">₹{analytics.sales}</Typography>
              <Typography variant="body2" color="textSecondary">
                <HiArrowSmUp /> 0%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} className="p-4">
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{analytics.products}</Typography>
              <Typography variant="body2" color="textSecondary">
                <HiArrowSmUp /> 0%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} className="p-4">
              <Typography variant="h6">Total Categories</Typography>
              <Typography variant="h4">{analytics.categories}</Typography>
              <Typography variant="body2" color="textSecondary">
                <HiArrowSmUp /> 0%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} className="p-4">
              <Typography variant="h6">Total SubCategories</Typography>
              <Typography variant="h4">{analytics.subCategories}</Typography>
              <Typography variant="body2" color="textSecondary">
                <HiArrowSmUp /> 0%
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Outlet />
      </Container>
    </Box>
  );
};

export default LandingV2;