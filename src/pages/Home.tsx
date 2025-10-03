import { Button, Col, Container, Nav, Row } from 'react-bootstrap';
import '../styles/Home.css';  
import Product from './Product';
import { Link } from 'react-router-dom';

const Home = () => { 

  return (
    <>
      <Container className="home-container home-row"> 
        <Row> 
          
        </Row>
        <Row>
          <Col className="p-0 home-left">   
            <h1 className="home-title">GamesX</h1>
            <h4 className="home-subtitle">Tus videojuegos favoritos en un solo lugar</h4>
            <Button variant='dark'> 
              <Nav.Link as={Link} to="/category/productos">
                Catálogo
              </Nav.Link>
            </Button> 
          </Col>
          <Col className="p-0 home-right"> 
          </Col>
        </Row> 
        <Product />
      </Container>
     </>
    
  );
};
export default Home;