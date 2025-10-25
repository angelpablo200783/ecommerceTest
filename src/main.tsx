import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Container } from 'react-bootstrap';
import { CartProvider } from './contexts/CartContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <Container>
        <App />
      </Container>
    </CartProvider>
  </StrictMode>
);