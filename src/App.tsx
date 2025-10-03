import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

const App = () => (
  <AuthProvider>
    <Router> 
      <NavbarComp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
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
          path="/misDevoluciones" 
          element={
            <ProtectedRoute>
              <SolicitarDevolucion />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;