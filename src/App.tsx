import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; 
import CategoryPage from './pages/Category'; 
import NavbarComp from './components/NavbarComp';
import ProductDetails from './pages/ProductDetail';
import ConsultarPedidosCliente from './pages/ConsultarPedidosCliente';
import Admin from './pages/Admin';
import SolicitarDevolucion from './pages/SolicitarDevolucion';

const App = () => (
  <Router> 
  <NavbarComp />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/product-details/:id" element={<ProductDetails />} />
      <Route path="/misPedidos" element={<ConsultarPedidosCliente />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/misDevoluciones" element={<SolicitarDevolucion />} />
    </Routes>
  </Router>
);

export default App;
