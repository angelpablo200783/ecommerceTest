import ps5Image from '../images/ps5-photo.png';
import switchImage from '../images/switch.png';
import xboxImage from '../images/xbox.png';

import { Link, useLocation, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import '../styles/Category.css'; 
import { useEffect, useState } from 'react';

function Category() { 
    const { pathname } = useLocation(); 
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const { name } = useParams();
    const items: any = [
        { id: 1, name: 'PS5', price: '$120', image: ps5Image },
        { id: 2, name: 'Switch', price: '$250', image: switchImage },
        { id: 3, name: 'Xbox', price: '$120', image: xboxImage }, 
    ];

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <> 
        <Container>
            <Col>
                <Row> 
                </Row>
                <Row>
                </Row>
            </Col>
        </Container> 
        <h1 className="product-title">Catalogo</h1> 
        <div className="category-filtro"> 
            <p className="m-4">Filtrando por: </p>

            <div className="category-filtro__desktop">
                <p className="category-filtro__dropdown">Consolas</p>
                <p className="category-filtro__dropdown">Videojuegos</p>
                <p className="category-filtro__dropdown">Accessorios</p>
            </div>
            
            {/* Mobile Dropdown */}
            {/*
            <div className="category-filtro__mobile">
                <p onClick={toggleDropdown} className="category-filtro__dropdown-toggle">
                    {isDropdownOpen ? 'Selecciona una categoría ▲' : 'Selecciona una categoría ▼'}
                </p>
                {isDropdownOpen && (
                    <div className="category-filtro__dropdown-list">
                        {items.map((item: any) => (
                            <p key={item.id} className="category-filtro__dropdown" onClick={toggleDropdown}>
                                {item.name}
                            </p>
                        ))}
                    </div>
                )}
            </div> 
            */}
        </div>

        <div className="product-category__list">
            {items.map((product: any) => (
                <Link to={`/product-details/${product.id}`} key={product.id}>
                    <div className="product-category__card">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                    </div>
                </Link>
            ))}
        </div>
        </>
    );
}

export default Category;
