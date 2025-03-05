import React, { useEffect, useState } from 'react';
import { fetchProductByGroup, deleteCategory, deleteSubCategory, deleteProduct } from '../utils/apiService';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Modal,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Product {
  image: string | undefined;
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  id: string;
  name: string;
  image: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
  subCategories: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchProductByGroup();
        const categoriesArray = Object.values(data.groupedProducts).map((category: any) => ({
          ...category,
          subCategories: Object.values(category.subCategories),
        }));
        setCategories(categoriesArray);
        setFilteredCategories(categoriesArray);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subCategories.some(subCategory =>
        subCategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subCategory.products.some(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditCategory = (id: string) => {
    navigate(`/categories/${id}/edit`);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
      setFilteredCategories(filteredCategories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditSubCategory = (id: string) => {
    navigate(`/subcategories/${id}/edit`);
  };

  const handleDeleteSubCategory = async (id: string) => {
    try {
      await deleteSubCategory(id);
      const updatedCategories = categories.map(category => ({
        ...category,
        subCategories: category.subCategories.filter(subCategory => subCategory.id !== id),
      }));
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleEditProduct = (id: string) => {
    navigate(`/products/${id}/edit`);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      const updatedCategories = categories.map(category => ({
        ...category,
        subCategories: category.subCategories.map(subCategory => ({
          ...subCategory,
          products: subCategory.products.filter(product => product.id !== id),
        })),
      }));
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleCreateSubCategory = () => {
    navigate('/subcategories/new');
  };

  const handleCreateProduct = () => {
    navigate('/products/new');
  };

  const categoryColumns: TableColumn<Category>[] = [
    { name: 'Name', selector: row => row.name, sortable: true },
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.image}
          alt={`category-${row.id}`}
          style={{ width: '100px', cursor: 'pointer' }}
          onClick={() => row.image && handleImageClick(row.image)}
        />
      ),
    },
    { name: 'Date Added', selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true },
    {
      name: (
        <div className="flex" style={{ display: 'flex', alignItems: 'center' } as React.CSSProperties}>
          Actions
          <Button style={{marginLeft:'20px'}} variant="outlined" size="small" color="primary" startIcon={<HiOutlinePlus />} onClick={() => navigate('/categories/new')}>
            Add Category
          </Button>
        </div>
      ),
      cell: row => (
        <div className="flex">
          <IconButton color="primary" onClick={() => handleEditCategory(row.id)}>
            <HiOutlinePencil />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteCategory(row.id)}>
            <HiOutlineTrash />
          </IconButton>
        </div>
      ),
    },
  ];

  const subCategoryColumns: TableColumn<SubCategory>[] = [
    { name: 'Name', selector: row => row.name, sortable: true },
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.image}
          alt={`subcategory-${row.id}`}
          style={{ width: '100px', cursor: 'pointer' }}
          onClick={() => row.image && handleImageClick(row.image)}
        />
      ),
    },
    { name: 'Date Added', selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true },
    {
      name: (
        <div className="flex" style={{ display: 'flex', alignItems: 'center' } as React.CSSProperties}>
          Actions
          <Button style={{marginLeft:'20px'}} variant="outlined" size="small" color="primary" startIcon={<HiOutlinePlus />} onClick={() => handleCreateSubCategory()}>
            Add Sub category
          </Button>
        </div>
      ),
      cell: row => (
        <div className="flex">
          <IconButton color="primary" onClick={() => handleEditSubCategory(row.id)}>
            <HiOutlinePencil />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteSubCategory(row.id)}>
            <HiOutlineTrash />
          </IconButton>
        </div>
      ),
    },
  ];

  const productColumns: TableColumn<Product>[] = [
    { name: 'Name', selector: row => row.name, sortable: true },
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.image}
          alt={`product-${row.id}`}
          style={{ width: '100px', cursor: 'pointer' }}
          onClick={() => row.image && handleImageClick(row.image)}
        />
      ),
    },
    { name: 'Date Added', selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true },
    {
      name: (
        <div className="flex" style={{ display: 'flex', alignItems: 'center' } as React.CSSProperties}>
          Actions
          <Button style={{marginLeft:'20px'}} variant="outlined" size="small" color="primary" startIcon={<HiOutlinePlus />} onClick={() => handleCreateProduct()}>
            Add Product
          </Button>
        </div>
      ),
      cell: row => (
        <div className="flex">
          <IconButton color="primary" onClick={() => handleEditProduct(row.id)}>
            <HiOutlinePencil />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteProduct(row.id)}>
            <HiOutlineTrash />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Container>
      <Box display="flex" mb={2}>
        <Typography variant="h4" gutterBottom>
          All Categories
        </Typography>
      </Box>
      <Box mb={4} display="flex" justifyContent="space-between">
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
          placeholder="Search categories, subcategories, or products..."
        />
      </Box>
      <DataTable
        columns={categoryColumns}
        data={filteredCategories}
        style={{ marginLeft: '20px' }}
        expandableRows
        expandableRowsComponent={({ data }) => (
          <DataTable
            columns={subCategoryColumns}
            data={data.subCategories}
            expandableRows
            expandableRowsComponent={({ data }) => (
              <DataTable
                columns={productColumns}
                data={data.products}
                style={{ marginLeft: '20px' }}
              />
            )}
          />
        )}
      />
      <Modal open={!!selectedImage} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
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