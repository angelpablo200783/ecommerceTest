import { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Modal, Card, Row, Col, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';


function Carrito() {
  const { cartItems, removeFromCart, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<number | null>(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);

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
      const res = await fetch(`http://localhost:3000/api/direcciones/${user?.id}`);
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
        total: total,
        productos: cartItems.map((item: any) => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precio
        }))
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
      console.error('Error:', err);
      alert('Error al confirmar el pedido');
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <Alert.Heading>Tu carrito está vacío</Alert.Heading>
          <p>Agrega productos desde el catálogo.</p>
          <Button href="/category/productos" variant="primary">
            Ir al catálogo
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Carrito de Compras</h2>
      <Table striped bordered hover responsive className="mt-3">
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
          {cartItems.map((item: any) => (
            <tr key={item.idProducto}>
              <td>
                <img src={item.imagen} alt={item.nombre} width="50" className="me-2" />
                {item.nombre}
              </td>
              <td>Q{item.precio}</td>
              <td>{item.cantidad}</td>
              <td>Q{(item.precio * item.cantidad).toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item.idProducto)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="text-end">Total: Q{total.toFixed(2)}</h4>

      <div className="d-flex justify-content-between mt-3">
        <Button variant="outline-danger" onClick={clearCart}>Vaciar Carrito</Button>
        <Button variant="success" onClick={handleProcederPago}>
          Proceder al Pago
        </Button>
      </div>

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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleContinuarCompra}>Continuar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Dirección */}
      <Modal show={showShippingModal} onHide={() => setShowShippingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Dirección de Envío</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {direcciones.map((direccion) => (
              <Col md={6} key={direccion.idDireccion}>
                <Card
                  className={`mb-2 cursor-pointer ${direccionSeleccionada === direccion.idDireccion ? 'border-primary' : ''}`}
                  onClick={() => setDireccionSeleccionada(direccion.idDireccion)}
                >
                  <Card.Body>
                    <h6>{direccion.alias}</h6>
                    <p>
                      {direccion.calle} {direccion.numero}, {direccion.ciudad}, {direccion.estado}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShippingModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleContinuarEnvio}>Continuar</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmar Pedido */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Resumen</h5>
          <ul>
            {cartItems.map((item: any) => (
              <li key={item.idProducto}>
                {item.nombre} × {item.cantidad} — Q{(item.precio * item.cantidad).toFixed(2)}
              </li>
            ))}
          </ul>
          <h5 className="mt-3">Total: Q{total.toFixed(2)}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleConfirmarPedido}>Confirmar Pedido</Button>
        </Modal.Footer>
      </Modal>

      {/* Pedido Exitoso */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Pedido Confirmado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <Alert.Heading>Gracias por tu compra</Alert.Heading>
            <p>Tu pedido ha sido procesado exitosamente.</p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Carrito;
