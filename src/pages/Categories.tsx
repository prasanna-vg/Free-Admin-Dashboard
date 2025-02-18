import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from '../utils/apiService';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineArrowLeft } from 'react-icons/hi';

interface Category {
  _id: string;
  name: string;
  color: string;
  images: string[];
  added_on: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = () => {
    const sorted = [...filteredCategories].sort((a, b) => {
      const dateA = new Date(a.added_on).getTime();
      const dateB = new Date(b.added_on).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredCategories(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleEdit = (id: string) => {
    navigate(`/categories/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category._id !== id));
      setFilteredCategories(filteredCategories.filter(category => category._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAddCategory = () => {
    navigate('/categories/new');
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        {/* <IconButton onClick={() => navigate(-1)}>
          <HiOutlineArrowLeft />
        </IconButton> */}
        <Typography variant="h4" gutterBottom>
          All Categories
        </Typography>
      </Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
          placeholder="Search categories..."
        />
        <Button variant="contained" color="primary" onClick={handleSortChange}>
          Sort by Date {sortOrder === 'asc' ? '▲' : '▼'}
        </Button>
        <Button variant="contained" color="primary" startIcon={<HiOutlinePlus />} onClick={handleAddCategory}>
          Add Category
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {/* <TableCell>Color</TableCell> */}
              <TableCell>Image</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map(category => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                {/* <TableCell>
                  <Box bgcolor={category.color} width={20} height={20} borderRadius="50%" />
                </TableCell> */}
                <TableCell>
                  {category.images.length > 0 && (
                    <img
                      src={category.images[0]}
                      alt={`category-${category._id}`}
                      style={{ width: '100px', cursor: 'pointer' }}
                      onClick={() => handleImageClick(category.images[0])}
                    />
                  )}
                </TableCell>
                <TableCell>{new Date(category.added_on).toLocaleDateString()}</TableCell>
                <TableCell className='flex'>
                  <IconButton color="primary" onClick={() => handleEdit(category._id)}>
                    <HiOutlinePencil />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(category._id)}>
                    <HiOutlineTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={!!selectedImage} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          width="80%"
          maxWidth="600px"
          maxHeight="80vh"
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="60vh"
            overflow="hidden"
          >
            <img src={selectedImage!} alt="Selected" style={{ maxHeight: '100%', maxWidth: '100%' }} />
          </Box>
          <Button onClick={handleCloseModal} style={{ marginTop: '10px' }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Categories;