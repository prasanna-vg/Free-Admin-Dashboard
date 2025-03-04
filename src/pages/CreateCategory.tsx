import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../utils/apiService';
import { Container, Typography, TextField, Button, Box, IconButton, Modal } from '@mui/material';
import { HiOutlineTrash, HiOutlineUpload, HiOutlinePlus, HiOutlineSave, HiOutlineArrowLeft } from 'react-icons/hi';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    image: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCategory({ ...category, image: file });
    }
  };

  const handleDeleteImage = () => {
    setCategory({ ...category, image: '' });
  };

  const handleCreateCategory = async () => {
    const formData = new FormData();
    formData.append('name', category.name);
    if (category.image) {
      formData.append('image', category.image);
    }

    try {
      const response = await createCategory(formData);
      if (response.success) {
        setCategory({
          name: response.category.name,
          image: response.category.image,
        });
        navigate('/categories');
      }
    } catch (error) {
      console.error('Error creating category:', error);
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
          Add New Category
        </Typography>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Name"
          name="name"
          value={category.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2}>
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {category.image && (
            <Box mt={2} position="relative" display="inline-block">
              <img src={URL.createObjectURL(category.image)} alt="category" style={{ width: '100px', marginRight: '10px' }} onClick={() => handleImageClick(URL.createObjectURL(category.image))} />
              <IconButton
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={handleDeleteImage}
              >
                <HiOutlineTrash />
              </IconButton>
            </Box>
          )}
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreateCategory} startIcon={<HiOutlineSave />}>
          Create Category
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

export default CreateCategory;