import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CategoryPage from './pages/Category';
import NavbarComp from './components/NavbarComp';
import ProductDetails from './pages/ProductDetail';
import ConsultarPedidosCliente from './pages/ConsultarPedidosCliente';
import Admin from './pages/Admin';
import SolicitarDevolucion from './pages/SolicitarDevolucion';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminSettings from './pages/AdminSettings';
import Carrito from './pages/Carrito';

const App = () => (
  <AuthProvider>
    <CartProvider> 
      <Router>
        <NavbarComp />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route
            path="/misPedidos"
            element={
              <ProtectedRoute>
                <ConsultarPedidosCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/misDevoluciones"
            element={
              <ProtectedRoute>
                <SolicitarDevolucion />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
