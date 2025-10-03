import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'; 
import '../styles/NavbarComp.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NavbarComp() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="my-navbar">
      <Container>
        <Navbar.Brand className="nav-logo home-title">GamesX</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav"> 
          <Nav className="ms-auto text-uppercase text-center">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link> 
            <Nav.Link as={Link} to="/category/productos">
              Catálogo
            </Nav.Link>
            
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Registro</Nav.Link>
              </>
            ) : isAdmin ? (
              <>
                <Nav.Link as={Link} to="/admin-settings">
                  Admin Settings
                </Nav.Link>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/misDevoluciones">
                  Mis Devoluciones
                </Nav.Link>
                <Nav.Link as={Link} to="/misPedidos">
                  Mis Pedidos
                </Nav.Link>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
              </>
            )} 
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;