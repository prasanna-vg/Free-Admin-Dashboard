import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategoryById, updateCategory } from '../utils/apiService';
import { Container, Typography, TextField, Button, Box, IconButton, Modal } from '@mui/material';
import { HiOutlineTrash, HiOutlineUpload, HiOutlineSave, HiOutlineArrowLeft } from 'react-icons/hi';

interface Category {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>({
    id: '',
    name: '',
    image: '',
    createdAt: '',
    updatedAt: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getCategory = async (categoryId: string) => {
      try {
        const data = await fetchCategoryById(categoryId);
        console.log("data", data.data);
        setCategory(data.data);
        console.log("category---", category);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    getCategory(id!);
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCategory({ ...category, image: URL.createObjectURL(file) });
    }
  };

  const handleDeleteImage = () => {
    setCategory({ ...category, image: '' });
  };

  const handleUpdateCategory = async () => {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('image', category.image);

    try {
      await updateCategory(id!, formData);
      navigate('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
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
          Edit Category
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
              <img src={category.image} alt="category" style={{ width: '100px', marginRight: '10px' }} onClick={() => handleImageClick(category.image)} />
              <IconButton
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={handleDeleteImage}
              >
                <HiOutlineTrash />
              </IconButton>
            </Box>
          )}
        </Box>
        <Button variant="contained" color="primary" onClick={handleUpdateCategory} startIcon={<HiOutlineSave />}>
          Update Category
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

export default EditCategory;