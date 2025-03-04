import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createSubCategory, fetchCategories } from '../utils/apiService';
import { Container, Typography, TextField, Button, Box, IconButton, Modal,  FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { HiOutlineTrash, HiOutlineSave, HiOutlineArrowLeft } from 'react-icons/hi';

const CreateSubCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = location.state || {};
  const [subCategory, setSubCategory] = useState({
    name: '',
    category: categoryId || '',
    image: null,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response.success) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubCategory({ ...subCategory, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value } = e.target;
    setSubCategory({ ...subCategory, category: value as string });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSubCategory({ ...subCategory, image: file });
    }
  };

  const handleDeleteImage = () => {
    setSubCategory({ ...subCategory, image: null });
  };

  const handleCreateSubCategory = async () => {
    const formData = new FormData();
    formData.append('name', subCategory.name);
    formData.append('categoryId', subCategory.category);
    if (subCategory.image) {
      formData.append('image', subCategory.image);
    }

    try {
      await createSubCategory(formData);
      navigate('/categories');
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
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
        <IconButton onClick={() => navigate(-1)}>
          <HiOutlineArrowLeft />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Add New SubCategory
        </Typography>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Name"
          name="name"
          value={subCategory.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={subCategory.category}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {subCategory.image && (
            <Box mt={2} position="relative" display="inline-block">
              <img
                src={URL.createObjectURL(subCategory.image)}
                alt="subcategory"
                style={{ width: '100px', marginRight: '10px' }}
                onClick={() => handleImageClick(URL.createObjectURL(subCategory.image))}
              />
              <IconButton
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={handleDeleteImage}
              >
                <HiOutlineTrash />
              </IconButton>
            </Box>
          )}
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreateSubCategory} startIcon={<HiOutlineSave />}>
          Create SubCategory
        </Button>
      </Box>
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

export default CreateSubCategory;