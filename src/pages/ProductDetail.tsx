import { useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ProductDetails.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadDisponible: number;
  enStock: boolean;
  imagen: string;
}

interface MetodoDePago {
  idMetodoPago: number;
  nombre: string;
  descripcion: string;
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

function ProductDetails() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);
  
  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showConfirmarEnvio, setShowConfirmarEnvio] = useState(false);
  
  // Estados para datos del formulario
  const [metodosPago, setMetodosPago] = useState<MetodoDePago[]>([]);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<number | null>(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
  const [nuevaDireccion, setNuevaDireccion] = useState({
    alias: '',
    calle: '',
    numero: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    pais: '',
    telefonoContacto: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (id) {
      loadProducto();
      loadMetodosPago();
      if (isAuthenticated) {
        loadDirecciones();
      }
    }
  }, [id, isAuthenticated]);

  const loadProducto = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/productos/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducto(data);
      } else {
        setError('Producto no encontrado');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loadMetodosPago = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/metodos-pago');
      const data = await response.json();
      if (response.ok) {
        setMetodosPago(data);
      }
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
    }
  };

  const loadDirecciones = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/direcciones/${user?.id}`);
      const data = await response.json();
      if (response.ok) {
        setDirecciones(data);
      }
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    }
  };

  const handleComprarAhora = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para comprar');
      return;
    }
    setShowModal(true);
  };

  const handleAgregarCarrito = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar al carrito');
      return;
    }
    // Aquí implementarías la lógica para agregar al carrito
    alert('Producto agregado al carrito');
  };

  const handleContinuarCompra = () => {
    if (!metodoPagoSeleccionado) {
      alert('Selecciona un método de pago');
      return;
    }
    setShowModal(false);
    setShowShippingModal(true);
  };

  const handleContinuarEnvio = () => {
    if (!direccionSeleccionada) {
      alert('Selecciona una dirección de envío');
      return;
    }
    setShowShippingModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmarPedido = async () => {
    try {
      const pedidoData = {
        idCliente: user?.id,
        idMetodoPago: metodoPagoSeleccionado,
        idDireccionEntrega: direccionSeleccionada,
        total: producto ? producto.precio * cantidad : 0,
        productos: [{
          idProducto: producto?.idProducto,
          cantidad: cantidad,
          precioUnitario: producto?.precio
        }]
      };

      const response = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
      });

      if (response.ok) {
        setShowConfirmationModal(false);
        setShowConfirmarEnvio(true);
      } else {
        alert('Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pedido');
    }
  };

  const handleAgregarDireccion = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/direcciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idCliente: user?.id,
          ...nuevaDireccion
        }),
      });

      if (response.ok) {
        loadDirecciones();
        setNuevaDireccion({
          alias: '',
          calle: '',
          numero: '',
          ciudad: '',
          estado: '',
          codigoPostal: '',
          pais: '',
          telefonoContacto: ''
        });
        alert('Dirección agregada exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar dirección');
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <h2 className="mt-3">Cargando producto...</h2>
        </div>
      </Container>
    );
  }

  if (error || !producto) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'Producto no encontrado'}</p>
          <Link to="/category/productos">
            <Button variant="outline-danger">Volver al catálogo</Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          {producto.imagen ? (
            <img 
              src={producto.imagen} 
              alt={producto.nombre}
              className="img-fluid rounded"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="d-flex align-items-center justify-content-center bg-light rounded"
              style={{ height: '500px' }}
            >
              <span className="text-muted fs-4">Sin imagen</span>
            </div>
          )}
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Body>
              <h1 className="mb-3">{producto.nombre}</h1>
              
              <div className="mb-3">
                <Badge bg={producto.enStock ? 'success' : 'danger'} className="fs-6">
                  {producto.enStock ? 'En Stock' : 'Agotado'}
                </Badge>
                {producto.enStock && (
                  <span className="ms-2 text-muted">
                    {producto.cantidadDisponible} disponibles
                  </span>
                )}
              </div>

              <h2 className="text-success mb-3">${producto.precio}</h2>
              
              <p className="text-muted mb-4">{producto.descripcion}</p>

              <div className="mb-4">
                <label className="form-label">Cantidad:</label>
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                  >
                    -
                  </Button>
                  <span className="mx-3 fs-5">{cantidad}</span>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setCantidad(Math.min(producto.cantidadDisponible, cantidad + 1))}
                    disabled={cantidad >= producto.cantidadDisponible}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleComprarAhora}
                  disabled={!producto.enStock}
                >
                  Comprar Ahora
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={handleAgregarCarrito}
                  disabled={!producto.enStock}
                >
                  Agregar al Carrito
                </Button>
              </div>

              <div className="mt-4">
                <h5>Total: ${(producto.precio * cantidad).toFixed(2)}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Método de Pago */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Método de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {metodosPago.map((metodo) => (
              <Col md={6} key={metodo.idMetodoPago} className="mb-3">
                <Card 
                  className={`cursor-pointer ${metodoPagoSeleccionado === metodo.idMetodoPago ? 'border-primary' : ''}`}
                  onClick={() => setMetodoPagoSeleccionado(metodo.idMetodoPago)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <h5>{metodo.nombre}</h5>
                    <p className="text-muted">{metodo.descripcion}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleContinuarCompra}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Dirección de Envío */}
      <Modal show={showShippingModal} onHide={() => setShowShippingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Dirección de Envío</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h5>Direcciones Guardadas</h5>
              {direcciones.map((direccion) => (
                <Card 
                  key={direccion.idDireccion}
                  className={`mb-2 cursor-pointer ${direccionSeleccionada === direccion.idDireccion ? 'border-primary' : ''}`}
                  onClick={() => setDireccionSeleccionada(direccion.idDireccion)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <h6>{direccion.alias}</h6>
                    <p className="mb-0">
                      {direccion.calle} {direccion.numero}<br/>
                      {direccion.ciudad}, {direccion.estado} {direccion.codigoPostal}<br/>
                      {direccion.pais}
                    </p>
                  </Card.Body>
                </Card>
              ))}
            </Col>
            <Col md={6}>
              <h5>Agregar Nueva Dirección</h5>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Alias</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevaDireccion.alias}
                    onChange={(e) => setNuevaDireccion({...nuevaDireccion, alias: e.target.value})}
                    placeholder="Casa, Trabajo, etc."
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Calle</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevaDireccion.calle}
                    onChange={(e) => setNuevaDireccion({...nuevaDireccion, calle: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevaDireccion.numero}
                    onChange={(e) => setNuevaDireccion({...nuevaDireccion, numero: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevaDireccion.ciudad}
                    onChange={(e) => setNuevaDireccion({...nuevaDireccion, ciudad: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevaDireccion.estado}
                    onChange={(e) => setNuevaDireccion({...nuevaDireccion, estado: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevaDireccion.codigoPostal}
                    onChange={(e) => setNuevaDireccion({...nuevaDireccion, codigoPostal: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>País</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevaDireccion.pais}
                    onChange={(e) => setNuevaDireccion({...nuevaDireccion, pais: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Teléfono de Contacto</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevaDireccion.telefonoContacto}
                    onChange={(e) => setNuevaDireccion({...nuevaDireccion, telefonoContacto: e.target.value})}
                  />
                </Form.Group>
                <Button variant="outline-primary" onClick={handleAgregarDireccion}>
                  Agregar Dirección
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShippingModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleContinuarEnvio}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Resumen del Pedido</h5>
          <p><strong>Producto:</strong> {producto.nombre}</p>
          <p><strong>Cantidad:</strong> {cantidad}</p>
          <p><strong>Precio unitario:</strong> ${producto.precio}</p>
          <p><strong>Total:</strong> ${(producto.precio * cantidad).toFixed(2)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleConfirmarPedido}>
            Confirmar Pedido
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación Final */}
      <Modal show={showConfirmarEnvio} onHide={() => setShowConfirmarEnvio(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Pedido Confirmado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <Alert.Heading>¡Gracias por tu compra!</Alert.Heading>
            <p>Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación pronto.</p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowConfirmarEnvio(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductDetails;