import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrder, createPickAndPack, acceptOrder, rejectOrder } from '../utils/apiService';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
} from '@mui/material';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import DataTable, { TableColumn } from 'react-data-table-component';
import { AiOutlineExport } from 'react-icons/ai';

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unit: string;
  price: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  GST: number;
  deliveryTime: string;
  deliveryType: string;
  deliveryDate: string;
  deliveryCharge: number;
  paymentStatus: string;
  orderStatus: string;
  orderCancelledReason: string | null;
  orderRejectedReason: string | null;
  deliveryAddresses: string;
  order_additional_comments: string | null;
  createdAt: string;
  updatedAt: string;
  OrderItems: OrderItem[];
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
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    getOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.id.toString().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = () => {
    const sorted = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.deliveryDate).getTime();
      const dateB = new Date(b.deliveryDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredOrders(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditOrder(order);
    setReturnStatus(order.orderStatus || '');
    setReturnReason(order.orderRejectedReason || '');
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
        await updateOrder(editOrder.id, { status: editOrder.orderStatus, returnReason });
        if (editOrder.orderStatus === 'Received') {
          await createPickAndPack({
            orderId: editOrder.id,
            orderType: editOrder.deliveryType === 'free' ? 'Small' : 'Large',
          });
        }
        const updatedData = await fetchOrders();
        setOrders(updatedData.orders);
        setFilteredOrders(updatedData.orders);
        handleCloseModal();
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (editOrder) {
      setEditOrder({ ...editOrder, orderStatus: e.target.value as string });
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await acceptOrder(orderId);
      const updatedData = await fetchOrders();
      setOrders(updatedData.orders);
      setFilteredOrders(updatedData.orders);
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await rejectOrder(orderId);
      const updatedData = await fetchOrders();
      setOrders(updatedData.orders);
      setFilteredOrders(updatedData.orders);
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  const columns: TableColumn<Order>[] = [
    { name: 'Order ID', selector: row => row.id.toString(), sortable: true },
    { name: 'Order Status', selector: row => row.orderStatus, sortable: true },
    { name: 'Total Amount', selector: row => `₹${row.totalAmount}`, sortable: true },
    { name: 'Delivery Date', selector: row => new Date(row.deliveryDate).toLocaleDateString(), sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex">
          <Button variant="contained" size="small" style={{margin:'8px'}} color="primary" onClick={() => handleAcceptOrder(row.id)} disabled={row.orderStatus === 'accepted'}>
            Accept
          </Button>
          <Button variant="contained" size="small" style={{margin:'8px'}} color="secondary" onClick={() => handleRejectOrder(row.id)} disabled={row.orderStatus === 'rejected'}>
            Reject
          </Button>
          <Button variant="contained" size="small" style={{margin:'8px'}} color="default" onClick={() => handleViewOrder(row)}>
            View
          </Button>
        </div>
      ),
    },
  ];

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
      <DataTable
        columns={columns}
        data={filteredOrders}
        pagination
        highlightOnHover
        pointerOnHover
        striped
      />
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
                label="Order ID"
                name="order_id"
                value={editOrder.id}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Total Amount"
                name="totalAmount"
                value={editOrder.totalAmount}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Delivery Date"
                name="deliveryDate"
                value={new Date(editOrder.deliveryDate).toLocaleDateString()}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Delivery Time"
                name="deliveryTime"
                value={editOrder.deliveryTime}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Delivery Type"
                name="deliveryType"
                value={editOrder.deliveryType}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Payment Status"
                name="paymentStatus"
                value={editOrder.paymentStatus}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Additional Comments"
                name="order_additional_comments"
                value={editOrder.order_additional_comments || ''}
                fullWidth
                margin="normal"
                disabled
              />
              <Typography variant="body1">
                <strong>Status:</strong>
              </Typography>
              <Select
                value={editOrder.orderStatus}
                onChange={handleStatusChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
                <MenuItem value="returned">Returned</MenuItem>
              </Select>
              {editOrder.orderStatus === 'rejected' && (
                <>
                  <Typography variant="body1">
                    <strong>Rejection Reason:</strong>
                  </Typography>
                  <TextField
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
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