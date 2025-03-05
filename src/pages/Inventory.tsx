import { useEffect, useState } from 'react';
import { fetchProducts, createInventory } from '../utils/apiService';
import {
  Container,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  IconButton,
} from '@mui/material';
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';
import DataTable from 'react-data-table-component';

const Inventory = () => {
  interface Product {
    id: number;
    name: string;
    quantity: number;
    totalQuantity: number;
  }
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await fetchProducts();
        if (response.success) {
          setProducts(response.products);
          setFilteredProducts(response.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getAllProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProducts(
      products.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.id.toString().includes(query)
      )
    );
  };

  const handleOpen = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(product.quantity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setQuantity(0);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setQuantity(Number(e.target.value));
    };

  const handleUpdateQuantity = async () => {
    try {
      if (selectedProduct) {
        await createInventory(selectedProduct.id, quantity);
      }
      if (selectedProduct) {
        setProducts((prevItems) =>
          prevItems.map((item) =>
            item.id === selectedProduct.id ? { ...item, quantity } : item
          )
        );
      }
      handleClose();
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  const columns = [
    {
      name: 'Product ID',
      selector: (row: { id: any; }) => row.id,
      sortable: true,
    },
    {
      name: 'Product Name',
      selector: (row: { name: any; })  => row.name,
      sortable: true,
    },
    {
      name: 'Total Quantity',
      selector: (row: { totalQuantity: any; })  => row.totalQuantity,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: Product)  => (
        <Button variant="outlined" onClick={() => handleOpen(row)}>
          Update Quantity
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <Box display="flex" mb={2}>
        <Typography variant="h4" gutterBottom>
          Inventory
        </Typography>
      </Box>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <DataTable columns={columns} data={filteredProducts} pagination />
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          width="400px"
        >
          <Typography variant="h6" gutterBottom>
            Update Quantity for {selectedProduct?.name}
          </Typography>
          <Box display="flex" mb={2}>
            <IconButton onClick={() => setQuantity(quantity - 1)}>
              <HiOutlineMinus />
            </IconButton>
            <TextField
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 0 }}
              fullWidth
            />
            <IconButton onClick={() => setQuantity(quantity + 1)}>
              <HiOutlinePlus />
            </IconButton>
          </Box>
          <Button variant="contained" color="primary" onClick={handleUpdateQuantity}>
            Done
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Inventory;