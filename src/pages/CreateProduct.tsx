import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, fetchCategoriesWithSubcategories } from '../utils/apiService';
import {
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  IconButton,
  Modal,
  SelectChangeEvent,
} from '@mui/material';
import { HiOutlineSave, HiOutlineArrowLeft, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { InputWithLabel, SimpleInput } from '../components';
const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>({
    name: '',
    description: '',
    richDescription: '',
    brand: '',
    price: 0,
    category: '',
    subCategory: '',
    countInStock: 0,
    rating: '',
    numReviews: 0,
    isFeatured: false,
    image: '',
    images: [],
    quantities: [],
    details: [],
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getCategoriesWithSubcategories = async () => {
      try {
        const data = await fetchCategoriesWithSubcategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
      }
    };

    getCategoriesWithSubcategories();
  }, []);
  const calculateLowestPrice = () => {
    const prices = Object.values(product.quantities).map((price) => (isNaN(Number(price)) ? 0 : Number(price)));
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  useEffect(() => {
    const lowestPrice = calculateLowestPrice();
    setProduct((prevProduct) => ({
      ...prevProduct,
      price: lowestPrice,
    }));
  }, [product.quantities]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (e: SelectChangeEvent<any>) => {
    const { value } = e.target;
    setProduct({ ...product, category: value as string, subCategory: '' });
    const selectedCategory = categories.find(category => category.categoryId === value);
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
  };

  const handleSubCategoryChange = (e: SelectChangeEvent<any>) => {
    const { value } = e.target;
    setProduct({ ...product, subCategory: value as string });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProduct({ ...product, image: file });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProduct({ ...product, images: [...product.images, ...files] });
    }
  };

  const handleDeleteImage = () => {
    setProduct({ ...product, image: '' });
  };

  const handleDeleteImages = (index: number) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
  };

  const handleDetailChange = (index: number, field: string, value: string) => {
    const newDetails = product.details.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : detail
    );
    setProduct({ ...product, details: newDetails });
  };

  const handleAddDetail = () => {
    setProduct({
      ...product,
      details: [...product.details, { title: '', content: '', id: Date.now().toString() }],
    });
  };

  const handleDeleteDetail = (index: number) => {
    const newDetails = product.details.filter((_, i) => i !== index);
    setProduct({ ...product, details: newDetails });
  };

  const handleQuantityChange = (index: number, field: string, value: string) => {
    const newQuantities = product.quantities.map((quantity, i) =>
      i === index ? { ...quantity, [field]: value } : quantity
    );
    setProduct({ ...product, quantities: newQuantities });
  };

  const handleAddQuantity = () => {
    setProduct({
      ...product,
      quantities: [...product.quantities, { unit: '', price: 0 }],
    });
  };

  const handleDeleteQuantity = (index: number) => {
    const newQuantities = product.quantities.filter((_, i) => i !== index);
    setProduct({ ...product, quantities: newQuantities });
  };

  const handleCreateProduct = async () => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('richDescription', product.richDescription);
    formData.append('brand', product.brand);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('subCategory', product.subCategory);
    formData.append('countInStock', product.countInStock.toString());
    formData.append('rating', product.rating);
    formData.append('numReviews', product.numReviews.toString());
    formData.append('isFeatured', product.isFeatured.toString());
  
    const quantitiesObject = product.quantities.reduce((acc, { unit, price }) => {
      acc[unit] = price;
      return acc;
    }, {});
    formData.append('quantities', JSON.stringify(quantitiesObject));
    formData.append('details', JSON.stringify(product.details));
  
    if (product.image && typeof product.image !== 'string') {
      formData.append('image', product.image);
    }
  
    for (let i = 0; i < product.images.length; i++) {
      if (typeof product.images[i] !== 'string') {
        formData.append('images', product.images[i]);
      }
    }
  
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
          Create Product
        </Typography>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <FormControl fullWidth margin="normal">
          <TextField
            label="Name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Rich Description"
            name="richDescription"
            value={product.richDescription}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Brand"
            name="brand"
            value={product.brand}
            onChange={handleInputChange}
          />
        </FormControl>
        {/* <FormControl fullWidth margin="normal">
          <TextField
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleInputChange}
          />
        </FormControl> */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={product.category}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {categories.map(category => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>SubCategory</InputLabel>
          <Select
            name="subCategory"
            value={product.subCategory}
            onChange={handleSubCategoryChange}
          >
            <MenuItem value="">
              <em>Select SubCategory</em>
            </MenuItem>
            {subcategories.map(subcategory => (
              <MenuItem key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Count In Stock"
            name="countInStock"
            type="number"
            value={product.countInStock}
            onChange={handleInputChange}
          />
        </FormControl>
        {/* <FormControl fullWidth margin="normal">
          <TextField
            label="Rating"
            name="rating"
            value={product.rating}
            onChange={handleInputChange}
          />
        </FormControl> */}
        {/* <FormControl fullWidth margin="normal">
          <TextField
            label="Number of Reviews"
            name="numReviews"
            type="number"
            value={product.numReviews}
            onChange={handleInputChange}
          />
        </FormControl> */}
        <FormControlLabel
          control={
            <Checkbox
              name="isFeatured"
              checked={product.isFeatured}
              onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
            />
          }
          label="Is Featured"
        />
        <InputWithLabel label="Image">
          {product.image ? (
            <Box position="relative" display="inline-block">
              <img src={typeof product.image === 'string' ? product.image : URL.createObjectURL(product.image)} alt="product" style={{ width: '100px', marginRight: '10px' }} onClick={() => handleImageClick(typeof product.image === 'string' ? product.image : URL.createObjectURL(product.image))} />
              <IconButton
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={handleDeleteImage}
              >
                <HiOutlineTrash />
              </IconButton>
            </Box>
          ) : (
            <Button variant="contained" component="label">
              Upload Profile Image
              <input
                type="file"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          )}
        </InputWithLabel>
        <InputWithLabel label="Images">
          <Button variant="contained" component="label">
            Upload Images
            <input
              type="file"
              hidden
              multiple
              onChange={handleImagesChange}
            />
          </Button>
          <Box mt={2}>
            {product.images.map((image, index) => (
              <Box key={index} position="relative" display="inline-block">
                <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt={`product-${index}`} style={{ width: '100px', marginRight: '10px' }} onClick={() => handleImageClick(typeof image === 'string' ? image : URL.createObjectURL(image))} />
                <IconButton
                  style={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={() => handleDeleteImages(index)}
                >
                  <HiOutlineTrash />
                </IconButton>
              </Box>
            ))}
          </Box>
        </InputWithLabel>
        <InputWithLabel label="Quantities">
          {product.quantities.map((quantity, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                label="Unit"
                value={quantity.unit}
                onChange={(e) => handleQuantityChange(index, 'unit', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <TextField
                label="Price"
                type="number"
                value={quantity.price}
                onChange={(e) => handleQuantityChange(index, 'price', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <IconButton onClick={() => handleDeleteQuantity(index)}>
                <HiOutlineTrash />
              </IconButton>
            </Box>
          ))}
          <Button variant="contained" color="primary" onClick={handleAddQuantity} startIcon={<HiOutlinePlus />}>
            Add Quantity
          </Button>
        </InputWithLabel>
        <InputWithLabel label="Details">
          {product.details.map((detail, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                label="Title"
                value={detail.title}
                onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <TextField
                label="Content"
                value={detail.content}
                onChange={(e) => handleDetailChange(index, 'content', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <IconButton onClick={() => handleDeleteDetail(index)}>
                <HiOutlineTrash />
              </IconButton>
            </Box>
          ))}
          <Button variant="contained" color="primary" onClick={handleAddDetail} startIcon={<HiOutlinePlus />}>
            Add Detail
          </Button>
        </InputWithLabel>
        <Button variant="contained" color="primary" startIcon={<HiOutlineSave />} onClick={handleCreateProduct}>
          Create Product
        </Button>
      </Box>
      <Modal open={!!selectedImage} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: 'translate(-50%, -50%)' }}
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