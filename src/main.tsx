import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Container } from 'react-bootstrap';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Container> 
      <App />
    </Container>
  </StrictMode>,
)
