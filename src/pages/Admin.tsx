import { useLocation } from 'react-router-dom';
import { Col, Container, Row, Table, Button, Form } from 'react-bootstrap';
import '../styles/Category.css'; 
import { useEffect, useState } from 'react';

function Admin() { 
    const { pathname } = useLocation(); 

    interface Pedido {
        idPedido: number;
        fechaPedido: string;
        estadoPedido: string;
        total: number;
        metodoPago: string;
        direccionEntrega: string;
        idCliente: string;
    }

    const [pedidos, setPedidos] = useState<Pedido[]>([]); // State to store orders
    const [loading, setLoading] = useState(true); // Loading state
    const [editingPedidoId, setEditingPedidoId] = useState<number | null>(null); // State to track which pedido is being edited
    const [updatedEstado, setUpdatedEstado] = useState<string>(''); // State to store the updated estado

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); 

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/todosLosPedidos');
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error('Error fetching pedidos:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDevoluciones = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/todasLasDevoluciones');
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching devoluciones:', error);
            }
        };

        fetchDevoluciones();
        fetchPedidos();
    }, []);

    const handleEditClick = (pedido: Pedido) => {
        setEditingPedidoId(pedido.idPedido);
        setUpdatedEstado(pedido.estadoPedido); // Set the current estadoPedido to the state for editing
    };

    const handleSaveClick = async (pedidoId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/actualizarEstadoPedido`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idPedido: pedidoId,
                    estadoPedido: updatedEstado,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update pedido');
            }

            // Update the local state after a successful update
            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.idPedido === pedidoId ? { ...pedido, estadoPedido: updatedEstado } : pedido
                )
            );

            // Exit edit mode
            setEditingPedidoId(null);
        } catch (error) {
            console.error('Error updating pedido:', error);
            alert('Failed to update pedido. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <> 
        <Container>
            <h1 className="product-title">Pedidos</h1>   
            <Col>
                <Row> 
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID Cliente</th>
                                <th>ID Pedido</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th>Método de Pago</th>
                                <th>Dirección de Entrega</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((pedido) => (
                                <tr key={pedido.idPedido}>
                                    <td>{pedido.idCliente}</td>
                                    <td>{pedido.idPedido}</td>
                                    <td>{pedido.fechaPedido}</td>
                                    <td>
                                        {editingPedidoId === pedido.idPedido ? (
                                            <Form.Select
                                                value={updatedEstado}
                                                onChange={(e) => setUpdatedEstado(e.target.value)}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Enviado">Enviado</option>
                                                <option value="Entregado">Entregado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </Form.Select>
                                        ) : (
                                            pedido.estadoPedido
                                        )}
                                    </td>
                                    <td>Q{pedido.total}</td>
                                    <td>{pedido.metodoPago}</td>
                                    <td>{pedido.direccionEntrega}</td>
                                    <td>
                                        {editingPedidoId === pedido.idPedido ? (
                                            <Button variant="success" onClick={() => handleSaveClick(pedido.idPedido)}>
                                                Guardar
                                            </Button>
                                        ) : (
                                            <Button variant="warning" onClick={() => handleEditClick(pedido)}>
                                                Editar
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Row>
            </Col>
        </Container> 
        </>
    );
}

export default Admin;
