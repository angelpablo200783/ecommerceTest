import { useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Carousel, Modal, Form } from 'react-bootstrap'; // Import Modal
import { Link } from 'react-router-dom';
import '../styles/ProductDetails.css'; // Add styles to match the design
import { useEffect, useState } from 'react'; // Import useState

import ps5Image from '../images/ps5-photo.png';
import switchImage from '../images/switch.png';
import xboxImage from '../images/xbox.png';

function ProductDetails() {
  const { pathname } = useLocation();
  const { id } = useParams(); // Get product ID from the URL

  const [showModal, setShowModal] = useState(false); // State for first Modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for second Modal
  const [showShippingModal, setShowShippingModal] = useState(false); // State for third Modal
  const [showConfirmarEnvio, setConfirmarEnvio] = useState(false); // State for third Modal

  interface Product {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidadDisponible: number;
  }

  interface MetodoDePago {
    idMetodoPago: number;
    nombre: string;
  }

  interface Direccion {
    idDireccion: number;
    idCliente: number;
    alias: string;
    calle: string;
    numero: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    pais: string;
    telefonoContacto: string;
  } 

  interface Persona {
    idPersona: number;
    nombre: string;
    apellido: string;
    email: string;
  }

  const [myProduct, setProducts] = useState<Product[]>([]);
  const [myMetodosDePago, setMetodosDePago] = useState<MetodoDePago[]>([]);
  const [myDireccion, setDireccion] = useState<Direccion[]>([]); 
  const [myPersona, setPersona] = useState<Persona[]>([]);

  //loading states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMetodosDePago, setLoadingMetodosDePago] = useState(true);
  const [loadingDireccion, setLoadingDireccion] = useState(true);
  const [loadingPersona, setLoadingPersona] = useState(true);

  // Scroll to top when pathname changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
  
    const fetchMetodosDePago = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/metodosDePago');
        const data = await response.json();
        setMetodosDePago(data);
      } catch (error) {
        console.error('Error fetching métodos de pago:', error);
      } finally {
        setLoadingMetodosDePago(false);
      }
    };

    const fetchDireccion = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/direccionDeEntrega');
        const data = await response.json();
        setDireccion(data);
      } catch (error) {
        console.error('Error fetching direccion:', error);
      } finally {
        setLoadingDireccion(false);
      }
    };

    const fetchPersona = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/persona');
        const data = await response.json();
        setPersona(data);
      } catch (error) {
        console.error('Error fetching persona:', error);
      } finally {
        setLoadingPersona(false);
      }  
    };
  
    fetchProducts();
    fetchMetodosDePago();
    fetchDireccion();
    fetchPersona();
  }, []);
  
  if (loadingProducts || loadingMetodosDePago || loadingDireccion || loadingPersona) {
    return <p>Loading...</p>;
  }

  // Find the product based on the ID from URL parameters
  const product = myProduct.find((p) => p.idProducto.toString() === id); 
  const metodosDePago: any = myMetodosDePago; 
  const direccion: any = myDireccion.find((d) => d.idCliente.toString() === "1");
  const persona: any = myPersona.find((p) => p.idPersona.toString() === "1");

  if (!product) {
    return <p>Product not found</p>;
  }  
  if(!metodosDePago){
    return <p>Metodo de pago not found</p>;
  } 
  if(!direccion){
    return <p>Direccion not found</p>;
  } 
  if(!persona){
    return <p>Persona not found</p>;
  }

  console.log("persona", persona);
  console.log("direccion", direccion);

  // Function to open the modal
  const handleShowModal = () => setShowModal(true);
  // Function to close the modal
  const handleCloseModal = () => setShowModal(false);

  // Function to handle 'Pago contra entrega' button
  const handleShowConfirmationModal = () => {
    setShowModal(false); // Close first modal
    setShowConfirmationModal(true); // Open second modal
  };

  // Function to handle 'Finalizar compra' button
  const handleShowShippingModal = () => {
    setShowConfirmationModal(false); // Close second modal
    setShowShippingModal(true); // Open third modal
  };

  const handleConfirmarEnvio = async () => {
    setShowShippingModal(false); // Close second modal
    setConfirmarEnvio(true); // Open third modal
  
    // Prepare the order (pedido) data
    const pedidoData = {
      idPedido: Math.floor(Math.random() * 1000), // Generate a random order ID
      fechaPedido: new Date().toISOString().split('T')[0], // Get current date in 'YYYY-MM-DD' format
      idCliente: persona.idPersona, // ID of the client
      estadoPedido: 'Pendiente', // Initial status of the order
      total: product.precio, // Total amount for the product
      idMetodoPago: myMetodosDePago[0].idMetodoPago, // Assume first payment method selected
      idDireccionEntrega: direccion.idDireccion, // Delivery address ID
    }; 
    
     // Make the POST request to your backend API
     try {
      const response = await fetch('http://localhost:3000/api/pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData), // Send the order data as JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to place the order');
      }
  
      const result = await response.json();
      console.log('Pedido created:', result);
   
    } catch (error) {
      console.error('Error creating pedido:', error); 
    }
  };

  // Keep using your own images (ps5Image, switchImage, xboxImage)
  const images = [ps5Image, switchImage, xboxImage];

  return (
    <Container className="product-details-container">
      <Row>
        <Link to="/category/:id" className="back-link">
          ← Back to Catalog
        </Link>
        <hr />
        <Col md={6} className="product-details-image">
          <Carousel>
            {images.map((image: string, index: number) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Slide ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={6} className="product-details-info">
          <h1 className="product-details__title">{product.nombre}</h1>
          <p className="product-description">{product.descripcion}</p>
          <Row className="product-price__row">
            <Col className="product-price__col-normal">
              <p className="product-price__title-one">Precio Regular</p>
              <p className="product-price__normal crossed-out">Q120.00</p>
            </Col>
            <Col className="product-price__col-efectivo">
              <p className="product-price__title-two">Precio Especial</p>
              <p className="product-price__efectivo">Q{product.precio}.00</p>
            </Col>
          </Row>
          <p className="oferta-limitada">¡Ahorra un 20%!</p>
          <p className="oferta-limitada">* Oferta válida por tiempo limitado</p>
          <Button className="add-to-cart" onClick={handleShowModal}>
            ¡Consíguelo con descuento hoy!
          </Button>
        </Col>
      </Row>

      {/* Modal 1: Selección del método de pago */}
      <Modal className="text-center" show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Selecciona el método de pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="m-2 add-to-cart w-100" onClick={handleShowConfirmationModal}>
            Pago contra entrega - {metodosDePago[0].nombre}
          </Button>
          <Button className="m-2 add-to-cart w-100">
            Tarjeta de crédito o débito - {metodosDePago[1].nombre}
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal 2: Confirmación del pedido (Estilo Carrito de Compras) */}
      <Modal
        className="text-center"
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <img
                src={images[0]}
                alt={product.nombre}
                className="img-fluid"
                style={{ maxHeight: '150px' }}
              />
            </Col>
            <Col md={8} className="text-left">
              <h5 className="mt-4">{product.nombre}</h5>
              <p className="text-muted">{product.descripcion}</p>
              <p>
                Precio Especial: <strong>Q{product.precio}.00</strong>
              </p>
            </Col>

            <hr />

            <Row className="p-5">
              <Col className="text-start">
                <p>Precio Regular: </p>
                <p>Descuento: </p>
                <p>
                  <strong>Total a pagar: </strong>
                </p>
              </Col>

              <Col className="text-end">
                <p>Q120.00</p>
                <p>- Q{120 - product.precio}.00</p>
                <hr className="m-0" />
                <p>
                  <strong>Q{product.precio}.00</strong>
                </p>
              </Col>
              <Button className="m-2 add-to-cart" onClick={handleShowShippingModal}>
                Finalizar compra
              </Button>
            </Row>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Modal 3: Detalles de envío */}
      <Modal
        className="text-center"
        show={showShippingModal}
        onHide={() => setShowShippingModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles de envío</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre de quien recibirá el pedido</Form.Label>
              <Form.Control type="text" placeholder={persona.nombre + " - " + persona.email} disabled/>
            </Form.Group>
            <Form.Group className="mt-4" controlId="formDireccion">
              <Form.Label>Dirección de entrega</Form.Label>
              <Form.Control type="text" placeholder={direccion.alias + " - " + direccion.calle + " - " + direccion.ciudad} disabled/>
            </Form.Group>
            <Form.Group className="mt-4" controlId="formTelefono">
              <Form.Label>Numero de contacto</Form.Label>
              <Form.Control type="text" placeholder={direccion.telefonoContacto} disabled/>
            </Form.Group> 
            <Button className="m-2 add-to-cart" onClick={handleConfirmarEnvio}>Confirmar envío</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal 3: Confirmacion de pedido */}
      <Modal
        className="text-center"
        show={showConfirmarEnvio}
        onHide={() => setConfirmarEnvio(false)}
        centered
      > 
        <Modal.Header closeButton>
          <Modal.Title>Detalles de envío</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Pedido realizado con exito!</Form.Label> 
            </Form.Group>   
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProductDetails;
