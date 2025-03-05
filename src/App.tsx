import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './features/theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/PrivateRoute';
import HomeLayout from './pages/HomeLayout';
import Categories from './pages/Categories';
import CreateCategory from './pages/CreateCategory';
import CreateSubCategory from './pages/CreateSubCategory';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Deliveries from './pages/Deliveries';
import PickAndPack from './pages/PickAndPack';
import DeliveryPartners from './pages/DeliveryPartners';
import CreateOrder from './pages/CreateOrder';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import Login from './pages/Login';
import LandingV2 from './pages/LandingV2';
import { EditCategory, EditProduct, EditSubCategory } from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/landing-page" replace />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'categories', element: <Categories /> },
      { path: 'landing-page', element: <LandingV2 /> },
      { path: 'categories/new', element: <CreateCategory /> },
      { path: 'categories/:id/edit', element: <EditCategory /> },
      { path: 'subcategories/new', element: <CreateSubCategory /> },
      { path: 'subcategories/:id/edit', element: <EditSubCategory /> },
      { path: 'orders', element: <Orders /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'delivery', element: <Deliveries /> },
      { path: 'pick-and-pack', element: <PickAndPack /> },
      { path: 'delivery-partners', element: <DeliveryPartners /> },
      { path: 'orders/new', element: <CreateOrder /> },
      { path: 'products', element: <Products /> },
      { path: 'products/new', element: <CreateProduct /> },
      { path: 'products/:id/edit', element: <EditProduct /> },
    ],
  },
  { path: '/login', element: <Login /> },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;