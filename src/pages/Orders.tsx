import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrder, createPickAndPack } from '../utils/apiService';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Select,
  MenuItem,
} from '@mui/material';
import { HiOutlineChevronRight, HiOutlineSearch, HiOutlineEye, HiOutlinePencil } from 'react-icons/hi';
import { AiOutlineExport } from 'react-icons/ai';

interface Order {
  _id: string;
  orderItems: { quantity: number; unitPrice: number; productId: string }[];
  shippingAddress1: string;
  shippingAddress2: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  user: string;
  slot: string;
  bulkOrder: boolean;
  order_code: string;
  google_location_link: string;
  order_additional_comments: string;
  dateOrdered: string;
  returnStatus?: string;
  returnReason?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnStatus, setReturnStatus] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    getOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.order_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = () => {
    const sorted = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.dateOrdered).getTime();
      const dateB = new Date(b.dateOrdered).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredOrders(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditOrder(order);
    setReturnStatus(order.returnStatus || '');
    setReturnReason(order.returnReason || '');
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setEditOrder(null);
    setReturnStatus('');
    setReturnReason('');
  };

  const handleUpdateOrder = async () => {
    if (editOrder) {
      try {
        await updateOrder(editOrder._id, { status: editOrder.status, returnReason });
        if (editOrder.status === 'Received') {
          await createPickAndPack({
            orderId: editOrder._id,
            orderType: editOrder.bulkOrder ? 'Large' : 'Small',
          });
        }
        const updatedData = await fetchOrders();
        setOrders(updatedData);
        setFilteredOrders(updatedData);
        handleCloseModal();
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (editOrder) {
      setEditOrder({ ...editOrder, status: e.target.value as string });
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          All Orders
        </Typography>
      </Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
          placeholder="Search orders..."
        />
        <Button variant="contained" color="primary" onClick={handleSortChange}>
          Sort by Date {sortOrder === 'asc' ? '▲' : '▼'}
        </Button>
        <Button variant="contained" color="primary" startIcon={<AiOutlineExport />}>
          Export Orders
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Code</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Date Ordered</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order._id} style={{ backgroundColor: order.bulkOrder ? '#ffcccc' : 'inherit' }}>
                <TableCell>{order.order_code}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>₹{order.totalPrice}</TableCell>
                <TableCell>{new Date(order.dateOrdered).toLocaleDateString()}</TableCell>
                <TableCell>
                  {/* <IconButton color="primary" onClick={() => handleViewOrder(order)}>
                    <HiOutlineEye />
                  </IconButton> */}
                  <IconButton color="primary" onClick={() => handleViewOrder(order)}>
                    <HiOutlinePencil />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={!!selectedOrder} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="25%"
          left="25%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          width="80%"
          maxWidth="600px"
          maxHeight="60vh"
          overflow="auto"
        >
          {editOrder && (
            <>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <TextField
                label="Order Code"
                name="order_code"
                value={editOrder.order_code}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Total Price"
                name="totalPrice"
                value={editOrder.totalPrice}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Shipping Address 1"
                name="shippingAddress1"
                value={editOrder.shippingAddress1}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Shipping Address 2"
                name="shippingAddress2"
                value={editOrder.shippingAddress2}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="City"
                name="city"
                value={editOrder.city}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Zip"
                name="zip"
                value={editOrder.zip}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Country"
                name="country"
                value={editOrder.country}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Phone"
                name="phone"
                value={editOrder.phone}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Slot"
                name="slot"
                value={editOrder.slot}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Google Location Link"
                name="google_location_link"
                value={editOrder.google_location_link}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Additional Comments"
                name="order_additional_comments"
                value={editOrder.order_additional_comments}
                fullWidth
                margin="normal"
                disabled
              />
              <Typography variant="body1">
                <strong>Status:</strong>
              </Typography>
              <Select
                value={editOrder.status}
                onChange={handleStatusChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Awaiting">Awaiting</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="Processed">Processed</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Canceled">Canceled</MenuItem>
                <MenuItem value="Returned">Returned</MenuItem>
              </Select>
              {editOrder.status === 'Returned' && (
                <>
                  <Typography variant="body1">
                    <strong>Return Reason:</strong>
                  </Typography>
                  <Select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value as string)}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="Vendor Reason">Vendor Reason</MenuItem>
                    <MenuItem value="Customer Reason">Customer Reason</MenuItem>
                    <MenuItem value="Pick & Pack Reason">Pick & Pack Reason</MenuItem>
                    <MenuItem value="Delivery Reason">Delivery Reason</MenuItem>
                  </Select>
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateOrder}
                style={{ marginTop: '20px' }}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseModal}
                style={{ marginTop: '20px', marginLeft: '10px' }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default Orders;