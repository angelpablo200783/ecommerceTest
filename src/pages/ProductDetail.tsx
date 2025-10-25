import { useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ProductDetails.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Reemplaza con tu clave pública de Stripe (modo test) desde el Stripe Dashboard. Usa una clave válida real.
const stripePromise = loadStripe('pk_test_51SL6D6Fzj5f4Br4CfQ9vftRiPerCpIA0oLfvv5CRVsLEm84FcAMX5aHjwseGoviUwcrb8XxP5UIJzVifbHlvusNE00JUC9dAiD');

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
  // Log para depurar (temporal: remueve en producción)
  console.log('stripePromise inicializado:', stripePromise);

  if (!stripePromise) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error al inicializar Stripe. Verifica la clave pública en el código y asegúrate de que sea válida.</Alert>
      </Container>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <InnerProductDetails />
    </Elements>
  );
}

function InnerProductDetails() {
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);
  const [paymentError, setPaymentError] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showConfirmarEnvio, setShowConfirmarEnvio] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
      const response = await fetch(`http://localhost:3000/api/direcciones/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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
    alert('Producto agregado al carrito');
  };

  const handleContinuarCompra = () => {
    if (!metodoPagoSeleccionado) {
      alert('Selecciona un método de pago');
      return;
    }
    const selectedMethod = metodosPago.find(m => m.idMetodoPago === metodoPagoSeleccionado);
    if (selectedMethod?.nombre.toLowerCase() === 'tarjeta de crédito') {
      setShowModal(false);
      setShowShippingModal(true);
    } else {
      alert('Solo pagos con tarjeta de crédito son soportados actualmente');
    }
  };

  const handleContinuarEnvio = async () => {
    if (!direccionSeleccionada) {
      alert('Selecciona una dirección de envío');
      return;
    }
    setShowShippingModal(false);
    try {
      const total = producto ? Math.round(producto.precio * cantidad * 100) : 0; // En centavos
      const response = await fetch('http://localhost:3000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: total }),
      });
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentModal(true);
      } else {
        setError('Error al preparar el pago');
      }
    } catch (error) {
      setError('Error al conectar con el servidor de pagos');
    }
  };

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setPaymentError('Stripe no está inicializado. Verifica la clave pública.');
      return;
    }
    setPaymentLoading(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Error al cargar el formulario de pago');
      setPaymentLoading(false);
      return;
    }

    try {
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      setPaymentLoading(false);
      if (error) {
        setPaymentError(error.message || 'Error al procesar el pago');
      } else {
        setShowPaymentModal(false);
        setShowConfirmationModal(true);
      }
    } catch (error) {
      setPaymentLoading(false);
      setPaymentError('Error inesperado al procesar el pago');
    }
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ idCliente: user?.id, ...nuevaDireccion }),
      });
      if (response.ok) {
        loadDirecciones();
        setNuevaDireccion({ alias: '', calle: '', numero: '', ciudad: '', estado: '', codigoPostal: '', pais: '', telefonoContacto: '' });
        alert('Dirección agregada exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar dirección');
    }
  };

  const handleNuevaDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaDireccion((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <Spinner animation="border" /> Cargando...
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!producto) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Producto no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid" />
        </Col>
        <Col md={6}>
          <h1>{producto.nombre}</h1>
          {producto.enStock ? (
            <Badge bg="success">En Stock</Badge>
          ) : (
            <Badge bg="danger">Agotado</Badge>
          )}
          {producto.enStock && (
            <p>{producto.cantidadDisponible} disponibles</p>
          )}
          <h2>${producto.precio}</h2>
          <p>{producto.descripcion}</p>
          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={producto.cantidadDisponible}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleComprarAhora}>
            Comprar ahora
          </Button>
          {' '}
          <Button variant="secondary" onClick={handleAgregarCarrito}>
            Agregar al carrito
          </Button>
        </Col>
      </Row>

      {/* Modal de Selección de Método de Pago */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona Método de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {metodosPago.map((metodo) => (
            <Card
              key={metodo.idMetodoPago}
              onClick={() => setMetodoPagoSeleccionado(metodo.idMetodoPago)}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
              className={metodoPagoSeleccionado === metodo.idMetodoPago ? 'border-primary' : ''}
            >
              <Card.Body>
                <Card.Title>{metodo.nombre}</Card.Title>
                <Card.Text>{metodo.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          ))}
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

      {/* Modal de Selección de Dirección de Envío */}
      <Modal show={showShippingModal} onHide={() => setShowShippingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona Dirección de Envío</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Direcciones Guardadas</h5>
          {direcciones.map((direccion) => (
            <Card
              key={direccion.idDireccion}
              onClick={() => setDireccionSeleccionada(direccion.idDireccion)}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
              className={direccionSeleccionada === direccion.idDireccion ? 'border-primary' : ''}
            >
              <Card.Body>
                <Card.Title>{direccion.alias}</Card.Title>
                <Card.Text>
                  {direccion.calle} {direccion.numero}, {direccion.ciudad}, {direccion.estado}, {direccion.pais}
                  <br />
                  CP: {direccion.codigoPostal}
                  <br />
                  Teléfono: {direccion.telefonoContacto}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}

          <h5 className="mt-4">Agregar Nueva Dirección</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Alias</Form.Label>
              <Form.Control
                type="text"
                name="alias"
                value={nuevaDireccion.alias}
                onChange={handleNuevaDireccionChange}
                placeholder="Ej. Casa, Oficina"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                name="calle"
                value={nuevaDireccion.calle}
                onChange={handleNuevaDireccionChange}
                placeholder="Ej. Avenida Principal"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                name="numero"
                value={nuevaDireccion.numero}
                onChange={handleNuevaDireccionChange}
                placeholder="Ej. 123"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                name="ciudad"
                value={nuevaDireccion.ciudad}
                onChange={handleNuevaDireccionChange}
                placeholder="Ej. Ciudad de México"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                name="estado"
                value={nuevaDireccion.estado}
                onChange={handleNuevaDireccionChange}
                placeholder="Ej. CDMX"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control
                type="text"
                name="codigoPostal"
                value={nuevaDireccion.codigoPostal}
                onChange={handleNuevaDireccionChange}
                placeholder="Ej. 12345"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>País</Form.Label>
              <Form.Control
                type="text"
                name="pais"
                value={nuevaDireccion.pais}
                onChange={handleNuevaDireccionChange}
                placeholder="Ej. México"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono de Contacto</Form.Label>
              <Form.Control
                type="text"
                name="telefonoContacto"
                value={nuevaDireccion.telefonoContacto}
                onChange={handleNuevaDireccionChange}
                placeholder="Ej. +52 123 456 7890"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAgregarDireccion}>
              Agregar Dirección
            </Button>
          </Form>
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

      {/* Modal para Pago con Tarjeta (Stripe) */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ingresa Detalles de Tarjeta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentError && <Alert variant="danger">{paymentError}</Alert>}
          <Form onSubmit={handlePaymentSubmit}>
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              disabled={paymentLoading || !stripe}
            >
              {paymentLoading ? 'Procesando...' : `Pagar $${producto ? (producto.precio * cantidad).toFixed(2) : '0.00'}`}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación de Pedido */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Resumen del Pedido</h5>
          <p><strong>Producto:</strong> {producto?.nombre}</p>
          <p><strong>Cantidad:</strong> {cantidad}</p>
          <p><strong>Precio Unitario:</strong> ${producto?.precio}</p>
          <p><strong>Total:</strong> {(producto?.precio * cantidad).toFixed(2)}</p>
          <p><strong>Método de Pago:</strong> {metodosPago.find(m => m.idMetodoPago === metodoPagoSeleccionado)?.nombre}</p>
          <p><strong>Dirección de Envío:</strong>
            {direcciones.find(d => d.idDireccion === direccionSeleccionada)?.alias} -
            {direcciones.find(d => d.idDireccion === direccionSeleccionada)?.calle}
            {direcciones.find(d => d.idDireccion === direccionSeleccionada)?.numero},
            {direcciones.find(d => d.idDireccion === direccionSeleccionada)?.ciudad},
            {direcciones.find(d => d.idDireccion === direccionSeleccionada)?.pais}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmarPedido}>
            Confirmar Pedido
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación de Envío */}
      <Modal show={showConfirmarEnvio} onHide={() => setShowConfirmarEnvio(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Pedido Confirmado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tu pedido ha sido procesado exitosamente.</p>
          <p>Recibirás una confirmación pronto. Gracias por tu compra.</p>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/">
            <Button variant="primary">Volver al Inicio</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductDetails;