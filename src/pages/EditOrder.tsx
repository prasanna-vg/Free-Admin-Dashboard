import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, updateOrder } from '../utils/apiService';
import { Container, Typography, TextField, Button, Box, IconButton } from '@mui/material';
import { HiOutlineArrowLeft, HiOutlineSave } from 'react-icons/hi';

const EditOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    status: '',
    order_status: '',
  });

  useEffect(() => {
    const getOrder = async (orderId: string) => {
      try {
        const data = await fetchOrderById(orderId);
        setOrder({
          status: data.status,
          order_status: data.order_status,
        });
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    if (id) {
      getOrder(id);
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleUpdateOrder = async () => {
    try {
      await updateOrder(id!, order);
      navigate('/orders');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <HiOutlineArrowLeft />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Edit Order
        </Typography>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Delivery Status"
          name="status"
          value={order.status}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Order Status"
          name="order_status"
          value={order.order_status}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateOrder}
          startIcon={<HiOutlineSave />}
          style={{ marginTop: '20px' }}
        >
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default EditOrder;