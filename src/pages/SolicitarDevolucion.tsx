import { useLocation } from 'react-router-dom';
import { Col, Container, Row, Table } from 'react-bootstrap';
import '../styles/Category.css'; 
import { useEffect, useState } from 'react';

function SolicitarDevolucion() {
    const { pathname } = useLocation();

    interface Devolucion {
        idDevolucion: number;
        idPedido: number;
        idCliente: number;
        fechaSolicitud: string;
        estadoDevolucion: string;
    } 

    const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]); // State to store orders
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {  
        const fetchDevoluciones = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/devolucionesCliente?idCliente=1');
                if (!response.ok) throw new Error('Error fetching devoluciones');
                const data = await response.json();
                setDevoluciones(data);
            } catch (error) {
                console.error('Error fetching devolucion:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            setLoading(true);
             await fetchDevoluciones();
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Container>
                <h1 className="product-title">Mis devoluciones</h1>
                <Col>
                    <Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>ID Cliente</th>
                                    <th>Fecha Devolucion</th>
                                    <th>Estado de Devolucion</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {devoluciones.map((devolucion) => (
                                    <tr key={devolucion.idPedido}>
                                        <td>{devolucion.idPedido}</td>
                                        <td>{devolucion.idCliente}</td>
                                        <td>{devolucion.fechaSolicitud}</td>
                                        <td>{devolucion.estadoDevolucion}</td> 
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

export default SolicitarDevolucion;