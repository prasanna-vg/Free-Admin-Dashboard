import React, { useEffect, useState } from 'react';
import { fetchDeliveries, addDelivery, updateDelivery, deleteDelivery } from '../utils/apiService';
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
  IconButton,
} from '@mui/material';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

interface Delivery {
  _id: string;
  orderId: {
    _id: string;
    totalPrice: number;
    order_code: string;
  };
  pickPackId: {
    _id: string;
    orderType: string;
    deliveryStatus: string;
  };
  deliveryPartnerId: {
    _id: string;
    name: string;
    contact: string;
    vehicleNumber: string;
  };
  eligibleAreas: string[];
  deliveryFee: number;
  deliverySlot: string;
  deliveryStatus: string;
}

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    pickPackId: '',
    deliveryPartnerId: '',
    eligibleAreas: '',
    deliveryFee: '',
    deliverySlot: '',
    deliveryStatus: '',
  });

  useEffect(() => {
    const getDeliveries = async () => {
      try {
        const data = await fetchDeliveries();
        setDeliveries(data);
        setFilteredDeliveries(data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    getDeliveries();
  }, []);

  useEffect(() => {
    const filtered = deliveries.filter(delivery =>
      delivery.orderId.order_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDeliveries(filtered);
  }, [searchQuery, deliveries]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = (delivery: Delivery | null) => {
    setSelectedDelivery(delivery);
    setFormData({
      orderId: delivery ? delivery.orderId._id : '',
      pickPackId: delivery ? delivery.pickPackId._id : '',
      deliveryPartnerId: delivery ? delivery.deliveryPartnerId._id : '',
      eligibleAreas: delivery ? delivery.eligibleAreas.join(', ') : '',
      deliveryFee: delivery ? delivery.deliveryFee.toString() : '',
      deliverySlot: delivery ? delivery.deliverySlot : '',
      deliveryStatus: delivery ? delivery.deliveryStatus : '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDelivery(null);
    setFormData({
      orderId: '',
      pickPackId: '',
      deliveryPartnerId: '',
      eligibleAreas: '',
      deliveryFee: '',
      deliverySlot: '',
      deliveryStatus: '',
    });
    setIsModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveDelivery = async () => {
    const areasCoveredArray = formData.eligibleAreas.split(',').map(area => area.trim());
    const deliveryData = { ...formData, eligibleAreas: areasCoveredArray, deliveryFee: parseFloat(formData.deliveryFee) };

    try {
      if (selectedDelivery) {
        await updateDelivery(selectedDelivery._id, deliveryData);
      } else {
        await addDelivery(deliveryData);
      }
      const updatedData = await fetchDeliveries();
      setDeliveries(updatedData);
      setFilteredDeliveries(updatedData);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving delivery:', error);
    }
  };

  const handleDeleteDelivery = async (id: string) => {
    try {
      await deleteDelivery(id);
      const updatedData = await fetchDeliveries();
      setDeliveries(updatedData);
      setFilteredDeliveries(updatedData);
    } catch (error) {
      console.error('Error deleting delivery:', error);
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Deliveries
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HiOutlinePlus />}
          onClick={() => handleOpenModal(null)}
          style={{ marginLeft: 'auto' }}
        >
          Add Delivery
        </Button>
      </Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
          placeholder="Search deliveries..."
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Code</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>Delivery Partner</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Delivery Slot</TableCell>
              <TableCell>Delivery Fee</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDeliveries.map(delivery => (
              <TableRow key={delivery._id}>
                <TableCell>{delivery.orderId.order_code}</TableCell>
                <TableCell>{delivery.pickPackId.orderType}</TableCell>
                <TableCell>{delivery.deliveryPartnerId.name}</TableCell>
                <TableCell>{delivery.deliveryStatus}</TableCell>
                <TableCell>{delivery.deliverySlot}</TableCell>
                <TableCell>₹{delivery.deliveryFee}</TableCell>
                {/* <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(delivery)}>
                    <HiOutlinePencil />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteDelivery(delivery._id)}>
                    <HiOutlineTrash />
                  </IconButton>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="25%"
          left="25%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          width="60%"
          maxWidth="400px"
          maxHeight="60vh"
          overflow="auto"
        >
          {/* <Typography variant="h6" gutterBottom>
            {selectedDelivery ? 'Edit Delivery' : 'Add Delivery'}
          </Typography> */}
          <TextField
            label="Order ID"
            name="orderId"
            value={formData.orderId}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pick Pack ID"
            name="pickPackId"
            value={formData.pickPackId}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Delivery Partner ID"
            name="deliveryPartnerId"
            value={formData.deliveryPartnerId}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Eligible Areas (comma separated)"
            name="eligibleAreas"
            value={formData.eligibleAreas}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Delivery Fee"
            name="deliveryFee"
            value={formData.deliveryFee}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Delivery Slot"
            name="deliverySlot"
            value={formData.deliverySlot}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Delivery Status"
            name="deliveryStatus"
            value={formData.deliveryStatus}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveDelivery}
            style={{ marginTop: '20px' }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Deliveries;