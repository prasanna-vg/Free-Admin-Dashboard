import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSubCategoryById, updateSubCategory, fetchCategories } from '../utils/apiService';
import { Container, Typography, TextField, Button, Box, IconButton, Modal, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { HiOutlineTrash, HiOutlineArrowLeft } from 'react-icons/hi';

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  image: string | File;
}

const EditSubCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState<SubCategory>({
    id: '',
    name: '',
    categoryId: '',
    image: '',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getSubCategory = async (subCategoryId: string) => {
      try {
        const response = await fetchSubCategoryById(subCategoryId);
        if (response.success) {
          setSubCategory({
            id: response.data.id,
            name: response.data.name,
            categoryId: response.data.categoryId.toString(),
            image: response.data.image,
          });
        }
      } catch (error) {
        console.error('Error fetching subcategory:', error);
      }
    };

    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getSubCategory(id!);
    getCategories();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubCategory({ ...subCategory, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value } = e.target;
    setSubCategory({ ...subCategory, categoryId: value as string });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSubCategory({ ...subCategory, image: file });
    }
  };

  const handleDeleteImage = () => {
    setSubCategory({ ...subCategory, image: '' });
  };

  const handleUpdateSubCategory = async () => {
    const formData = new FormData();
    formData.append('name', subCategory.name);
    formData.append('categoryId', subCategory.categoryId);

    if (typeof subCategory.image !== 'string') {
      formData.append('image', subCategory.image);
    }

    try {
      await updateSubCategory(id!, formData);
      navigate('/subcategories');
    } catch (error) {
      console.error('Error updating subcategory:', error);
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
          Edit SubCategory
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
            name="categoryId"
            value={subCategory.categoryId}
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
                src={typeof subCategory.image === 'string' ? subCategory.image : URL.createObjectURL(subCategory.image)}
                alt="subcategory"
                style={{ width: '100px', marginRight: '10px' }}
                onClick={() => handleImageClick(typeof subCategory.image === 'string' ? subCategory.image : URL.createObjectURL(subCategory.image))}
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
        <Button variant="contained" color="primary" onClick={handleUpdateSubCategory}>
          Update SubCategory
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

export default EditSubCategory;