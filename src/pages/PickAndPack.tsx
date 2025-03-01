import React, { useEffect, useState } from 'react';
import { fetchPickAndPack, markAsPacked, fetchDeliveryPartners, addDelivery } from '../utils/apiService';
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
import DataTable, { TableColumn } from 'react-data-table-component';

interface PickAndPackItem {
  id: string;
  orderId: number;
  orderSize: string;
  packed: boolean;
  dataPageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  Order: {
    id: number;
    userId: number;
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
    deliveryAddresses: number;
    order_additional_comments: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

const PickAndPack = () => {
  const [pickAndPack, setPickAndPack] = useState<PickAndPackItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPickAndPack, setFilteredPickAndPack] = useState<PickAndPackItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PickAndPackItem | null>(null);
  const [newDeliveryStatus, setNewDeliveryStatus] = useState('');
  const [showNoDeliveryPartnerModal, setShowNoDeliveryPartnerModal] = useState<boolean>(false);
  const [packedFilter, setPackedFilter] = useState<string>('all');

  useEffect(() => {
    const getPickAndPack = async () => {
      try {
        const data = await fetchPickAndPack();
        setPickAndPack(data.pickAndPack);
        setFilteredPickAndPack(data.pickAndPack);
      } catch (error) {
        console.error('Error fetching pick and pack data:', error);
      }
    };

    getPickAndPack();
  }, []);

  useEffect(() => {
    const filtered = pickAndPack.filter(item =>
      item.Order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (packedFilter === 'all' || item.packed.toString() === packedFilter)
    );
    setFilteredPickAndPack(filtered);
  }, [searchQuery, packedFilter, pickAndPack]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePackedFilterChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPackedFilter(e.target.value as string);
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
          const deliveryPartner = await fetchDeliveryPartners(selectedItem.Order.id);
          if (!deliveryPartner || !deliveryPartner[0]._id) {
            setShowNoDeliveryPartnerModal(true);
            return;
          }

          await addDelivery({
            orderId: selectedItem.Order.id,
            pickPackId: selectedItem.id,
            deliveryPartnerId: deliveryPartner[0]._id,
            eligibleAreas: deliveryPartner[0].eligibleAreas,
            deliverySlot: selectedItem.Order.deliveryTime || '10:00 AM - 12:00 PM',
          });
        }
        await updateDeliveryStatus(selectedItem.id, newDeliveryStatus);
        const updatedData = await fetchPickAndPack();
        setPickAndPack(updatedData.pickAndPack);
        setFilteredPickAndPack(updatedData.pickAndPack);
        handleCloseModal();
      } catch (error) {
        console.error('Error updating delivery status:', error);
      }
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      const updatedRecord = await markAsPacked(id);
      if (updatedRecord.pickAndPack.dataPageUrl) {
        window.open(updatedRecord.pickAndPack.dataPageUrl, '_blank');
      }
    } catch (error) {
      console.error('Error marking as packed and downloading PDF:', error);
    }
  };

  const columns: TableColumn<PickAndPackItem>[] = [
    { name: 'Order Code', selector: row => row.Order.id.toString(), sortable: true },
    { name: 'Total Price', selector: row => `₹${row.Order.totalAmount}`, sortable: true },
    { name: 'Order Type', selector: row => row.orderSize, sortable: true },
    { name: 'Delivery Status', selector: row => (row.packed ? 'Packed' : 'Not Packed'), sortable: true },
    { name: 'Order Accepted On', selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <Button variant="contained" color="primary" size="small" onClick={() => handleDownloadPDF(row.Order.id)} disabled={row.packed}>
          Mark as packed
        </Button>
      ),
    },
  ];

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
        <Select
          value={packedFilter}
          onChange={handlePackedFilterChange}
          displayEmpty
          className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="true">Packed</MenuItem>
          <MenuItem value="false">Not Packed</MenuItem>
        </Select>
      </Box>
      <DataTable
        columns={columns}
        data={filteredPickAndPack}
        pagination
        highlightOnHover
        pointerOnHover
        striped
      />
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