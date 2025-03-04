import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createProduct, fetchGroupedSubCategoriesByCategory } from '../utils/apiService';
import { Container, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, IconButton, Modal } from '@mui/material';
import { HiOutlineTrash, HiOutlineSave, HiOutlineArrowLeft } from 'react-icons/hi';

const CreateProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, subCategoryId } = location.state || {};
  const [product, setProduct] = useState({
    name: '',
    description: '',
    categoryId: categoryId || '',
    subCategoryId: subCategoryId || '',
    measureType: '',
    price: 0,
    unitCountperquantity: 0,
    minQty: 0,
    isNewArrival: false,
    isOnDeal: false,
    images: [],
    dealDetails: {
      discount: 0,
      dealExpiry: '',
    },
    additionalDetails: [{
      title: '',
      size: '',
    }],
  });
  const [groupedSubCategories, setGroupedSubCategories] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getGroupedSubCategoriesByCategory = async () => {
      try {
        const response = await fetchGroupedSubCategoriesByCategory();
        if (response.success) {
          setGroupedSubCategories(response.groupedSubCategories);
          console.log("groupedSUb Cat", groupedSubCategories);
        }
      } catch (error) {
        console.error('Error fetching grouped subcategories:', error);
      }
    };

    getGroupedSubCategoriesByCategory();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value } = e.target;
    setProduct({ ...product, categoryId: value as string, subCategoryId: '' });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value } = e.target;
    setProduct({ ...product, subCategoryId: value as string });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProduct({ ...product, images: files });
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
  };

  const handleDealDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, dealDetails: { ...product.dealDetails, [name]: value } });
  };

  const handleAdditionalDetailsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newAdditionalDetails = [...product.additionalDetails];
    newAdditionalDetails[index] = { ...newAdditionalDetails[index], [name]: value };
    setProduct({ ...product, additionalDetails: newAdditionalDetails });
  };

  const handleAddAdditionalDetail = () => {
    setProduct({ ...product, additionalDetails: [...product.additionalDetails, { title: '', size: '' }] });
  };

  const handleRemoveAdditionalDetail = (index: number) => {
    const newAdditionalDetails = product.additionalDetails.filter((_, i) => i !== index);
    setProduct({ ...product, additionalDetails: newAdditionalDetails });
  };

  const handleCreateProduct = async () => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('categoryId', product.categoryId);
    formData.append('subCategoryId', product.subCategoryId);
    formData.append('measureType', product.measureType);
    formData.append('price', product.price.toString());
    formData.append('unitCountperquantity', product.unitCountperquantity.toString());
    formData.append('minQty', product.minQty.toString());
    formData.append('isNewArrival', product.isNewArrival.toString());
    formData.append('isOnDeal', product.isOnDeal.toString());
    product.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    formData.append('dealDetails[discount]', product.dealDetails.discount.toString());
    formData.append('dealDetails[dealExpiry]', product.dealDetails.dealExpiry);
    product.additionalDetails.forEach((detail, index) => {
      formData.append(`additionalDetails[${index}][title]`, detail.title);
      formData.append(`additionalDetails[${index}][size]`, detail.size);
    });

    try {
      await createProduct(formData);
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
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
          Add New Product
        </Typography>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Name"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={product.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={product.categoryId}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {Object.values(groupedSubCategories).map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>SubCategory</InputLabel>
          <Select
            name="subCategoryId"
            value={product.subCategoryId}
            onChange={handleSubCategoryChange}
            disabled={!product.categoryId}
          >
            <MenuItem value="">
              <em>Select SubCategory</em>
            </MenuItem>
            {product.categoryId && groupedSubCategories[product.categoryId]?.subCategories.map(subCategory => (
              <MenuItem key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Measure Type</InputLabel>
          <Select
            name="measureType"
            value={product.measureType}
            onChange={handleInputChange}
          >
            <MenuItem value="">
              <em>Select Measure Type</em>
            </MenuItem>
            <MenuItem value="unit-wise">Unit-wise</MenuItem>
            <MenuItem value="weight-wise">Weight-wise</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unit Count per Quantity"
          name="unitCountperquantity"
          type="number"
          value={product.unitCountperquantity}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Minimum Quantity"
          name="minQty"
          type="number"
          value={product.minQty}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isNewArrival"
              checked={product.isNewArrival}
              onChange={(e) => setProduct({ ...product, isNewArrival: e.target.checked })}
            />
          }
          label="Is New Arrival"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isOnDeal"
              checked={product.isOnDeal}
              onChange={(e) => setProduct({ ...product, isOnDeal: e.target.checked })}
            />
          }
          label="Is On Deal"
        />
        {product.isOnDeal && (
          <>
            <TextField
              label="Discount"
              name="discount"
              type="number"
              value={product.dealDetails.discount}
              onChange={handleDealDetailsChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Deal Expiry"
              name="dealExpiry"
              type="date"
              value={product.dealDetails.dealExpiry}
              onChange={handleDealDetailsChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </>
        )}
        <Box mt={2}>
          <Button variant="contained" component="label">
            Upload Images
            <input
              type="file"
              hidden
              multiple
              onChange={handleImageChange}
            />
          </Button>
          {product.images.length > 0 && (
            <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
              {product.images.map((image, index) => (
                <Box key={index} position="relative" display="inline-block">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`product-${index}`}
                    style={{ width: '100px', marginRight: '10px' }}
                    onClick={() => handleImageClick(URL.createObjectURL(image))}
                  />
                  <IconButton
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => handleDeleteImage(index)}
                  >
                    <HiOutlineTrash />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Typography variant="h6" gutterBottom>
          Additional Details
        </Typography>
        {product.additionalDetails.map((detail, index) => (
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <TextField
              label="Title"
              name="title"
              value={detail.title}
              onChange={(e) => handleAdditionalDetailsChange(index, e)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Size"
              name="size"
              value={detail.size}
              onChange={(e) => handleAdditionalDetailsChange(index, e)}
              fullWidth
              margin="normal"
            />
            <IconButton onClick={() => handleRemoveAdditionalDetail(index)}>
              <HiOutlineTrash />
            </IconButton>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddAdditionalDetail}>
          Add Additional Detail
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreateProduct} startIcon={<HiOutlineSave />} style={{ marginTop: '20px' }}>
          Create Product
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

export default CreateProduct;