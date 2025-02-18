import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, updateProduct, fetchCategoriesWithSubcategories } from '../utils/apiService';
import { Container, Typography, TextField, Button, Box, IconButton, Modal, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineArrowLeft } from 'react-icons/hi';

interface Product {
  id: string;
  name: string;
  description: string;
  richDescription: string;
  image: string | File;
  images: (string | File)[];
  brand: string;
  price: number;
  category: { _id: string; name: string } | null;
  subCategory: { _id: string; name: string } | null;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  quantities: { unit: string; price: number }[];
  details: { title: string; content: string; id: string }[];
  dateCreated: string;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    richDescription: '',
    image: '',
    images: [],
    brand: '',
    price: 0,
    category: null,
    subCategory: null,
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    quantities: [],
    details: [],
    dateCreated: '',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id!);
        const quantitiesArray = Object.entries(data.quantities).map(([unit, price]) => ({
          unit,
          price: Number(price),
        }));
        setProduct({
          ...data,
          quantities: quantitiesArray,
          details: Array.isArray(data.details) ? data.details : [],
        });
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const getCategoriesWithSubcategories = async () => {
      try {
        const data = await fetchCategoriesWithSubcategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
      }
    };

    getProduct();
    getCategoriesWithSubcategories();
  }, [id]);

  useEffect(() => {
    if (product.category) {
      const selectedCategory = categories.find((cat) => cat._id === product.category!._id);
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories);
      }
    }
  }, [product.category, categories]);

  useEffect(() => {
    const calculateLowestPrice = () => {
      const prices = product.quantities.map((q) => (isNaN(Number(q.price)) ? 0 : Number(q.price)));
      return prices.length > 0 ? Math.min(...prices) : 0;
    };

    const lowestPrice = calculateLowestPrice();
    setProduct((prevProduct) => ({
      ...prevProduct,
      price: lowestPrice,
    }));
  }, [product.quantities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name!]: value });
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

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('richDescription', product.richDescription);
    formData.append('brand', product.brand);
    formData.append('price', product.price.toString());
    formData.append('category', product.category ? product.category._id : '');
    formData.append('subCategory', product.subCategory ? product.subCategory._id : '');
    formData.append('countInStock', product.countInStock.toString());
    formData.append('rating', product.rating.toString());
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
    } else if (!product.image) {
      formData.append('image', '');
    }

    for (let i = 0; i < product.images.length; i++) {
      if (typeof product.images[i] !== 'string') {
        formData.append('images', product.images[i]);
      }
    }

    // Handle the case where all images are deleted
    if (product.images.length === 0) {
      formData.append('images', '');
    }

    try {
      await updateProduct(id!, formData);
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
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
          Edit Product
        </Typography>
      </Box>
      <form onSubmit={handleUpdateProduct}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Product Name"
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
        <FormControl fullWidth margin="normal">
          <TextField
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleInputChange}
            disabled
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={product.category ? product.category._id : ''}
            onChange={(e) => setProduct({ ...product, category: { _id: e.target.value as string, name: '' } })}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>SubCategory</InputLabel>
          <Select
            name="subCategory"
            value={product.subCategory ? product.subCategory._id : ''}
            onChange={(e) => setProduct({ ...product, subCategory: { _id: e.target.value as string, name: '' } })}
          >
            {subCategories.map((subCategory) => (
              <MenuItem key={subCategory._id} value={subCategory._id}>
                {subCategory.name}
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
        <Box mt={2}>
          <Typography variant="h6">Quantities</Typography>
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
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Details</Typography>
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
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Profile Image</Typography>
          {product.image ? (
            <Box position="relative" display="inline-block">
              <img
                src={typeof product.image === 'string' ? product.image : URL.createObjectURL(product.image)}
                alt="product"
                style={{ width: '100px', marginRight: '10px' }}
                onClick={() => handleImageClick(typeof product.image === 'string' ? product.image : URL.createObjectURL(product.image))}
              />
              <IconButton
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={handleDeleteImage}
              >
                <HiOutlineTrash />
              </IconButton>
            </Box>
          ) : (
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          )}
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Images</Typography>
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
                <img
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  alt={`product-${index}`}
                  style={{ width: '100px', marginRight: '10px' }}
                  onClick={() => handleImageClick(typeof image === 'string' ? image : URL.createObjectURL(image))}
                />
                <IconButton
                  style={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={() => handleDeleteImages(index)}
                >
                  <HiOutlineTrash />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
          Update Product
        </Button>
      </form>
      <Modal open={!!selectedImage} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="25%"
          left="25%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          width="50%"
          maxWidth="600px"
          maxHeight="50vh"
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

export default EditProduct;