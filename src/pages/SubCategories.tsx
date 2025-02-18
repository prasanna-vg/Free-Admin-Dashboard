import React, { useEffect, useState } from 'react';
import { fetchSubCategories, deleteSubCategory, fetchCategories } from '../utils/apiService';
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

interface SubCategory {
  _id: string;
  name: string;
  color: string;
  category: {
    _id: string;
    name: string;
    color: string;
    images: string[];
    added_on: string;
  };
  images: string[];
  added_on: string;
}

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSubCategories = async () => {
      try {
        const data = await fetchSubCategories();
        setSubCategories(data);
        setFilteredSubCategories(data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    const getCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getSubCategories();
    getCategories();
  }, []);

  useEffect(() => {
    const filtered = subCategories.filter(subCategory =>
      subCategory.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubCategories(filtered);
  }, [searchQuery, subCategories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = () => {
    const sorted = [...filteredSubCategories].sort((a, b) => {
      const dateA = new Date(a.added_on).getTime();
      const dateB = new Date(b.added_on).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredSubCategories(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleEdit = (id: string) => {
    navigate(`/subcategories/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubCategory(id);
      setSubCategories(subCategories.filter(subCategory => subCategory._id !== id));
      setFilteredSubCategories(filteredSubCategories.filter(subCategory => subCategory._id !== id));
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleAddSubCategory = () => {
    navigate('/subcategories/new');
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  const getCategoryName = (categoryId: string) => {
    if (!categories) return 'Unknown Category';
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <HiOutlineArrowLeft />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          All Subcategories
        </Typography>
      </Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
          placeholder="Search subcategories..."
        />
        <Button variant="contained" color="primary" onClick={handleSortChange}>
          Sort by Date {sortOrder === 'asc' ? '▲' : '▼'}
        </Button>
        <Button variant="contained" color="primary" startIcon={<HiOutlinePlus />} onClick={handleAddSubCategory}>
          Add Subcategory
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubCategories.map(subCategory => (
              <TableRow key={subCategory._id}>
                <TableCell>{subCategory.name}</TableCell>
                <TableCell>{subCategory.category.name}</TableCell>
                <TableCell>
                  {subCategory.images.length > 0 && (
                    <img
                      src={subCategory.images[0]}
                      alt={`subcategory-${subCategory._id}`}
                      style={{ width: '100px', cursor: 'pointer' }}
                      onClick={() => handleImageClick(subCategory.images[0])}
                    />
                  )}
                </TableCell>
                <TableCell>{new Date(subCategory.added_on).toLocaleDateString()}</TableCell>
                <TableCell className='flex'>
                  <IconButton color="primary" onClick={() => handleEdit(subCategory._id)}>
                    <HiOutlinePencil />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(subCategory._id)}>
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

export default SubCategories;