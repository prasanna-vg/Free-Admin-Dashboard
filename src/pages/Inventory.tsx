import React, { useEffect, useState } from 'react';
import { fetchInventory } from '../utils/apiService';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);

  useEffect(() => {
    const getInventoryItems = async () => {
      try {
        const data = await fetchInventory();
        setInventoryItems(data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    getInventoryItems();
  }, []);

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Inventory
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryItems.map((item, index) => (
              item && (
                <TableRow key={index}>
                  <TableCell>{item.name || 'N/A'}</TableCell>
                  <TableCell>{item.action || 'N/A'}</TableCell>
                  <TableCell>{item.reason || 'N/A'}</TableCell>
                  <TableCell>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Inventory;