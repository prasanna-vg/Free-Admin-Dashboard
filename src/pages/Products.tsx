import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../utils/apiService';
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
  Collapse,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';

interface ProductDetail {
  title: string;
  content: string;
  id: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  richDescription: string;
  brand: string;
  price: number;
  category: { name: string } | null;
  subCategory: { name: string } | null;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  quantities: Record<string, number>;
  details: ProductDetail[];
  dateCreated: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = () => {
    const sorted = [...filteredProducts].sort((a, b) => {
      const dateA = new Date(a.dateCreated).getTime();
      const dateB = new Date(b.dateCreated).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredProducts(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleEdit = (id: string) => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      setFilteredProducts(filteredProducts.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleRowClick = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Box component="div" mb={4} display="flex" justifyContent="space-between">
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
          placeholder="Search products..."
        />
        <Button variant="contained" color="primary" onClick={handleSortChange}>
          Sort by Date {sortOrder === 'asc' ? '▲' : '▼'}
        </Button>
        <Button variant="contained" color="primary" startIcon={<HiOutlinePlus />} onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map(product => (
              <React.Fragment key={product.id}>
                <TableRow>
                  <TableCell>
                    <IconButton onClick={() => handleRowClick(product.id)}>
                      {expandedRows.has(product.id) ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>₹{Math.min(...Object.values(product.quantities))}</TableCell>
                  <TableCell>{new Date(product.dateCreated).toLocaleDateString()}</TableCell>
                  <TableCell className='flex' style={{display:'flex'}}>
                    <IconButton color="primary" onClick={() => handleEdit(product.id)}>
                      <HiOutlinePencil />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(product.id)}>
                      <HiOutlineTrash />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedRows.has(product.id)} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Details
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Rich Description:</strong> {product.richDescription}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Brand:</strong> {product.brand}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Category:</strong> {product.category ? product.category.name : 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>SubCategory:</strong> {product.subCategory ? product.subCategory.name : 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Count In Stock:</strong> {product.countInStock}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Rating:</strong> {product.rating}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Number of Reviews:</strong> {product.numReviews}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Is Featured:</strong> {product.isFeatured ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Quantities:</strong> {JSON.stringify(product.quantities)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Details:</strong>
                          <ul>
                            {product.details.map((detail: ProductDetail) => (
                              <li key={detail.id}>
                                <strong>{detail.title}:</strong> {detail.content}
                              </li>
                            ))}
                          </ul>
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Products;