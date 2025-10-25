import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Alert,
  Modal,
  Card,
  Row,
  Col,
  Form,
  Spinner,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51SL6D6Fzj5f4Br4CfQ9vftRiPerCpIA0oLfvv5CRVsLEm84FcAMX5aHjwseGoviUwcrb8XxP5UIJzVifbHlvusNE00JUC9dAiD'
);

function CarritoWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Carrito />
    </Elements>
  );
}

function Carrito() {
  const { cartItems, removeFromCart, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [showModal, setShowModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<
    number | null
  >(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<
    number | null
  >(null);

  const [clientSecret, setClientSecret] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (showModal) loadMetodosPago();
  }, [showModal]);

  useEffect(() => {
    if (showShippingModal && isAuthenticated) loadDirecciones();
  }, [showShippingModal]);

  const loadMetodosPago = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/metodos-pago');
      const data = await res.json();
      setMetodosPago(data);
    } catch (err) {
      console.error('Error al cargar métodos de pago:', err);
    }
  };

  const loadDirecciones = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/direcciones/${user?.id}`
      );
      const data = await res.json();
      setDirecciones(data);
    } catch (err) {
      console.error('Error al cargar direcciones:', err);
    }
  };

  const handleProcederPago = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para continuar');
      return;
    }
    setShowModal(true);
  };

  const handleContinuarCompra = () => {
    if (!metodoPagoSeleccionado) {
      alert('Selecciona un método de pago');
      return;
    }

    if (
      metodosPago
        .find((m) => m.idMetodoPago === metodoPagoSeleccionado)
        ?.nombre.toLowerCase() === 'tarjeta de crédito'
    ) {
      setShowModal(false);
      setShowShippingModal(true);
    } else {
      alert('Actualmente solo se acepta pago con tarjeta de crédito');
    }
  };

  const handleContinuarEnvio = async () => {
    if (!direccionSeleccionada) {
      alert('Selecciona una dirección de envío');
      return;
    }

    setShowShippingModal(false);
    try {
      const amount = Math.round(total * 100); // en centavos
      const res = await fetch(
        'http://localhost:3000/api/payment/create-payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ amount }),
        }
      );
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentModal(true);
      } else {
        setPaymentError('Error al generar el pago');
      }
    } catch (err) {
      console.error(err);
      setPaymentError('Error al conectar con el servidor de pagos');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaymentLoading(true);
    setPaymentError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      setPaymentLoading(false);

      if (error) {
        setPaymentError(
          error.message || 'Error al procesar el pago con Stripe'
        );
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setShowPaymentModal(false);
        setShowConfirmationModal(true);
      }
    } catch (err) {
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
        total,
        productos: cartItems.map((item) => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        })),
      };
      const res = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData),
      });

      if (res.ok) {
        clearCart();
        setShowConfirmationModal(false);
        setShowSuccessModal(true);
      } else {
        alert('Error al procesar el pedido');
      }
    } catch (err) {
      console.error(err);
      alert('Error al confirmar el pedido');
    }
  };

  if (cartItems.length === 0)
    return (
      <Container className='mt-5'>
        <Alert variant='info'>
          <Alert.Heading>Tu carrito está vacío</Alert.Heading>
          <p>Agrega productos desde el catálogo.</p>
          <Button
            href='/category/productos'
            variant='primary'>
            Ir al catálogo
          </Button>
        </Alert>
      </Container>
    );

  return (
    <Container className='mt-5'>
      <h2>Carrito de Compras</h2>
      <Table
        striped
        bordered
        hover
        responsive
        className='mt-3'>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.idProducto}>
              <td>{item.nombre}</td>
              <td>Q{item.precio}</td>
              <td>{item.cantidad}</td>
              <td>Q{(item.precio * item.cantidad).toFixed(2)}</td>
              <td>
                <Button
                  variant='danger'
                  size='sm'
                  onClick={() => removeFromCart(item.idProducto)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className='text-end'>Total: Q{total.toFixed(2)}</h4>

      <div className='d-flex justify-content-between mt-3'>
        <Button
          variant='outline-danger'
          onClick={clearCart}>
          Vaciar Carrito
        </Button>
        <Button
          variant='success'
          onClick={handleProcederPago}>
          Proceder al Pago
        </Button>
      </div>

      {/* Modal de método de pago */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona Método de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {metodosPago.map((m) => (
              <Col
                md={6}
                key={m.idMetodoPago}
                className='mb-3'>
                <Card
                  className={`cursor-pointer ${
                    metodoPagoSeleccionado === m.idMetodoPago
                      ? 'border-primary'
                      : ''
                  }`}
                  onClick={() => setMetodoPagoSeleccionado(m.idMetodoPago)}>
                  <Card.Body>
                    <h5>{m.nombre}</h5>
                    <p>{m.descripcion}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant='primary'
            onClick={handleContinuarCompra}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de dirección */}
      <Modal
        show={showShippingModal}
        onHide={() => setShowShippingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona Dirección de Envío</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {direcciones.map((d) => (
              <Col
                md={6}
                key={d.idDireccion}>
                <Card
                  className={`mb-2 cursor-pointer ${
                    direccionSeleccionada === d.idDireccion
                      ? 'border-primary'
                      : ''
                  }`}
                  onClick={() => setDireccionSeleccionada(d.idDireccion)}>
                  <Card.Body>
                    <h6>{d.alias}</h6>
                    <p>
                      {d.calle} {d.numero}, {d.ciudad}, {d.estado}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowShippingModal(false)}>
            Cancelar
          </Button>
          <Button
            variant='primary'
            onClick={handleContinuarEnvio}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de pago con tarjeta */}
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pago con Tarjeta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentError && <Alert variant='danger'>{paymentError}</Alert>}
          <Form onSubmit={handlePaymentSubmit}>
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            <Button
              type='submit'
              className='mt-3'
              disabled={paymentLoading || !stripe}>
              {paymentLoading ? 'Procesando...' : `Pagar Q${total.toFixed(2)}`}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmar pedido */}
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {cartItems.map((item) => (
              <li key={item.idProducto}>
                {item.nombre} × {item.cantidad} — Q
                {(item.precio * item.cantidad).toFixed(2)}
              </li>
            ))}
          </ul>
          <h5>Total: Q{total.toFixed(2)}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowConfirmationModal(false)}>
            Cancelar
          </Button>
          <Button
            variant='success'
            onClick={handleConfirmarPedido}>
            Confirmar Pedido
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pedido exitoso */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Pedido Confirmado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant='success'>
            <p>Tu pedido ha sido procesado exitosamente.</p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={() => setShowSuccessModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CarritoWrapper;
