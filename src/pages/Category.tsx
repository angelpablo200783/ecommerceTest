import { Link, useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import '../styles/Category.css'; 
import { useEffect, useState } from 'react';

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadDisponible: number;
  enStock: boolean;
  imagen: string;
}

function Category() { 
    const { pathname } = useLocation(); 
    const { name } = useParams();
    
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Cargar productos desde la API
    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/productos');
            const data = await response.json();
            
            if (response.ok) {
                setProductos(data);
            } else {
                setError('Error al cargar productos');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <h2 className="mt-3">Cargando productos...</h2>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h1 className="product-title">Catálogo</h1>
                </Col>
            </Row>
            
            <Row className="mb-4">
                <Col>
                    <div className="category-filtro"> 
                        <p className="m-4">Filtrando por: </p>
                        <div className="category-filtro__desktop">
                            <p className="category-filtro__dropdown">Consolas</p>
                            <p className="category-filtro__dropdown">Videojuegos</p>
                            <p className="category-filtro__dropdown">Accesorios</p>
                        </div>
                    </div>
                </Col>
            </Row>

            {productos.length === 0 ? (
                <Row>
                    <Col>
                        <Alert variant="info" className="text-center">
                            <Alert.Heading>No hay productos disponibles</Alert.Heading>
                            <p>Los productos aparecerán aquí cuando un administrador los agregue.</p>
                        </Alert>
                    </Col>
                </Row>
            ) : (
                <Row>
                    {productos.map((producto: Producto) => (
                        <Col key={producto.idProducto} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card as={Link} to={`/product-details/${producto.idProducto}`} 
                                  className="h-100 text-decoration-none" 
                                  style={{ transition: 'transform 0.2s' }}
                                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                {producto.imagen ? (
                                    <Card.Img 
                                        variant="top" 
                                        src={producto.imagen} 
                                        alt={producto.nombre}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div 
                                        className="d-flex align-items-center justify-content-center bg-light" 
                                        style={{ height: '200px' }}
                                    >
                                        <span className="text-muted">Sin imagen</span>
                                    </div>
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-dark">{producto.nombre}</Card.Title>
                                    <Card.Text className="text-success fw-bold fs-5">
                                        ${producto.precio}
                                    </Card.Text>
                                    <Card.Text className="text-muted small mt-auto">
                                        {producto.enStock ? 
                                            `${producto.cantidadDisponible} disponibles` : 
                                            'Agotado'
                                        }
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default Category;