import React, { useEffect, useState } from 'react';
import { addDelivery, fetchPickAndPack, updateDeliveryStatus, fetchDeliveryPartners } from '../utils/apiService';
import {
  Container,
  Typography,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Select,
  MenuItem,
} from '@mui/material';

interface PickAndPackItem {
  _id: string;
  orderId: {
    _id: string;
    totalPrice: number;
    order_code: string;
  };
  orderType: string;
  deliveryStatus: string;
  packedDate: string;
}

const PickAndPack = () => {
  const [pickAndPack, setPickAndPack] = useState<PickAndPackItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPickAndPack, setFilteredPickAndPack] = useState<PickAndPackItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PickAndPackItem | null>(null);
  const [newDeliveryStatus, setNewDeliveryStatus] = useState('');
  const [showNoDeliveryPartnerModal, setShowNoDeliveryPartnerModal] = useState<boolean>(false);

  useEffect(() => {
    const getPickAndPack = async () => {
      try {
        const data = await fetchPickAndPack();
        setPickAndPack(data);
        setFilteredPickAndPack(data);
      } catch (error) {
        console.error('Error fetching pick and pack data:', error);
      }
    };

    getPickAndPack();
  }, []);

  useEffect(() => {
    const filtered = pickAndPack.filter(item =>
      item.orderId.order_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPickAndPack(filtered);
  }, [searchQuery, pickAndPack]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = (item: PickAndPackItem) => {
    setSelectedItem(item);
    setNewDeliveryStatus(item.deliveryStatus);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setNewDeliveryStatus('');
  };
  const handleCloseNoDeliveryPartnerModal = () => {
    setShowNoDeliveryPartnerModal(false);
  };

  const handleUpdateDeliveryStatus = async () => {
    if (selectedItem) {
      try {
        if (newDeliveryStatus === 'Packed') {
          const deliveryPartner = await fetchDeliveryPartners(selectedItem.orderId);
          console.log("deliveryPartner:", deliveryPartner);
          if (!deliveryPartner || !deliveryPartner[0]._id) {
            setShowNoDeliveryPartnerModal(true);
            return;
          }
          console.log( "orderId:", selectedItem.orderId,
            "pickPackId:", selectedItem._id,
            "deliveryPartnerId:", deliveryPartner[0]._id);

          await addDelivery({
            orderId: selectedItem.orderId._id,
            pickPackId: selectedItem._id,
            deliveryPartnerId: deliveryPartner[0]._id,
            eligibleAreas: deliveryPartner[0].eligibleAreas,
            deliverySlot: selectedItem.orderId.slot || '10:00 AM - 12:00 PM',
          });
        }
        await updateDeliveryStatus(selectedItem._id, newDeliveryStatus);
        const updatedData = await fetchPickAndPack();
        setPickAndPack(updatedData);
        setFilteredPickAndPack(updatedData);
        handleCloseModal();
      } catch (error) {
        console.error('Error updating delivery status:', error);
      }
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Pick and Pack
        </Typography>
      </Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
          placeholder="Search pick and pack..."
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Code</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Packed Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPickAndPack.map(item => (
              <TableRow key={item._id}>
                <TableCell>{item.orderId.order_code}</TableCell>
                <TableCell>₹{item.orderId.totalPrice}</TableCell>
                <TableCell>{item.orderType}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(item)}>
                    {item.deliveryStatus}
                  </Button>
                </TableCell>
                <TableCell>{new Date(item.packedDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={!!selectedItem} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          width="80%"
          maxWidth="400px"
          maxHeight="80vh"
          overflow="auto"
        >
          <Typography variant="h6" gutterBottom>
            Update Delivery Status
          </Typography>
          <Select
            value={newDeliveryStatus}
            onChange={(e) => setNewDeliveryStatus(e.target.value as string)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Assigned">Assigned</MenuItem>
            <MenuItem value="Packed">Packed</MenuItem>
            <MenuItem value="Picked by Delivery Partner">Picked by Delivery Partner</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Returned">Returned</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateDeliveryStatus}
            style={{ marginTop: '20px' }}
          >
            Update
          </Button>
        </Box>
      </Modal>
      <Modal open={showNoDeliveryPartnerModal} onClose={handleCloseNoDeliveryPartnerModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          width="400px"
        >
          <Typography variant="h6" gutterBottom>
            No Delivery Partner Available
          </Typography>
          <Typography>Please try again later.</Typography>
          <Button variant="contained" color="primary" onClick={handleCloseNoDeliveryPartnerModal}>
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default PickAndPack;