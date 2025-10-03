import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import '../styles/Product.css';  

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadDisponible: number;
  enStock: boolean;
  imagen: string;
}

function Product() { 
    const navigate = useNavigate();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/productos');
            const data = await response.json();
            
            if (response.ok) {
                // Mostrar solo los primeros 6 productos en la página principal
                setProductos(data.slice(0, 6));
            } else {
                setError('Error al cargar productos');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productoId: number) => {
        navigate(`/product-details/${productoId}`);
    };

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/category/${categoryName}`);
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
        <Container className="mt-5">
            
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
                            <Card 
                                className="h-100 cursor-pointer" 
                                style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                                onClick={() => handleProductClick(producto.idProducto)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
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
                                    <Card.Title>{producto.nombre}</Card.Title>
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
            
            {productos.length > 0 && (
                <Row className="m-5"> 
                        <button 
                            className="btn btn-outline-primary m-5"
                            onClick={() => handleCategoryClick('productos')}
                        >
                            Ver todos los productos
                        </button> 
                </Row>
            )}
        </Container>
    );
}

export default Product;