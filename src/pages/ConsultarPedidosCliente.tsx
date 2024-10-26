import { useLocation } from 'react-router-dom';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import '../styles/Category.css'; 
import { useEffect, useState } from 'react';

function ConsultarPedidosCliente() {
    const { pathname } = useLocation();

    interface Pedido {
        idPedido: number;
        fechaPedido: string;
        estadoPedido: string;
        total: number;
        metodoPago: string;
        direccionEntrega: string;
        idCliente: number;
    } 

    const [pedidos, setPedidos] = useState<Pedido[]>([]); // Estado para almacenar pedidos
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {  
        const fetchPedidos = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/pedidosCliente?idCliente=1');
                if (!response.ok) throw new Error('Error fetching pedidos');
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error('Error fetching pedidos:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchPedidos();
        };

        fetchData();
    }, []);

    // Función para manejar la solicitud de devolución
    const solicitarDevolucion = async (pedido: Pedido) => {
        console.log('Solicitando devolución para el pedido:', pedido);
        try {
            const response = await fetch('http://localhost:3000/api/devolucion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({  
                    idPedido: pedido.idPedido,
                    idCliente: 1,
                    fechaSolicitud: '2021-10-01',
                    estadoDevolucion: 'EnProceso', 
                }),
            });

            if (!response.ok) throw new Error('Error solicitando devolución');
            
            // Eliminar pedido de la lista de pedidos

            
            alert('Devolución solicitada con éxito');
        } catch (error) {
            console.error('Error solicitando devolución:', error);
            alert('Ocurrió un error al solicitar la devolución');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Container>
                <h1 className="product-title">Mis pedidos</h1>
                <Col>
                    <Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Fecha</th>
                                    <th>Estado de Orden</th>
                                    <th>Total</th>
                                    <th>Método de Pago</th>
                                    <th>Dirección de Entrega</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.idPedido}>
                                        <td>{pedido.idPedido}</td>
                                        <td>{pedido.fechaPedido}</td>
                                        <td>{pedido.estadoPedido}</td>
                                        <td>Q{pedido.total}</td>
                                        <td>{pedido.metodoPago}</td>
                                        <td>{pedido.direccionEntrega}</td> 
                                        <td>
                                            {pedido.estadoPedido === 'Enviado' && (
                                                <Button 
                                                    variant="danger" 
                                                    onClick={() => solicitarDevolucion(pedido)}
                                                >
                                                    Solicitar Devolución
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

export default ConsultarPedidosCliente;
