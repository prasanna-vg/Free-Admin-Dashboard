import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchDeliveryPartners } from '../utils/apiService';

const DeliveryPartners = () => {
  const [deliveryPartners, setDeliveryPartners] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newDeliveryPartner, setNewDeliveryPartner] = useState({
    name: '',
    contact: '',
    vehicleNumber: '',
    areasCovered: '',
  });

  useEffect(() => {
    const getDeliveryPartners = async () => {
      try {
        const data = await fetchDeliveryPartners();
        setDeliveryPartners(data);
      } catch (error) {
        console.error('Error fetching delivery partners:', error);
      }
    };

    getDeliveryPartners();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDeliveryPartner({ ...newDeliveryPartner, [name]: value });
  };

  const handleAddDeliveryPartner = async () => {
    try {
      // await createDeliveryPartner({ ...newDeliveryPartner, areasCovered: areasCoveredArray });
      setOpenModal(false);
      setNewDeliveryPartner({
        name: '',
        contact: '',
        vehicleNumber: '',
        areasCovered: '',
      });
      const data = await fetchDeliveryPartners();
      setDeliveryPartners(data);
    } catch (error) {
      console.error('Error creating delivery partner:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Delivery Partners
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} style={{ marginBottom: '20px' }}>
        Add Delivery Partner
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Areas Covered</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryPartners.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.contact}</TableCell>
                <TableCell>{item.vehicleNumber}</TableCell>
                <TableCell>{item.areasCovered.join(', ')}</TableCell>
                {/* <TableCell>
                  <IconButton color="primary">
                    <HiOutlineEye />
                  </IconButton>
                  <IconButton color="primary">
                    <HiOutlinePencil />
                  </IconButton>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          position="absolute"
          top="25%"
          left="25%"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          width="400px"
        >
          <Typography variant="h6" gutterBottom>
            Add Delivery Partner
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={newDeliveryPartner.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact"
            name="contact"
            value={newDeliveryPartner.contact}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Vehicle Number"
            name="vehicleNumber"
            value={newDeliveryPartner.vehicleNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Areas Covered (comma separated)"
            name="areasCovered"
            value={newDeliveryPartner.areasCovered}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddDeliveryPartner} style={{ marginTop: '20px' }}>
            Add
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default DeliveryPartners;