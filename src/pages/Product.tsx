import { useNavigate } from 'react-router-dom';
import '../styles/Product.css';  
  
import consolasImage from '../images/consolas.png';
import videojuegosImage from '../images/videojuegos.png';
import accessoriosImage from '../images/accessorios.png';

function Product() { 
    const navigate = useNavigate();

    const products: any = [
        { id: 1, name: 'Consolas', price: '$120', image: consolasImage },
        { id: 2, name: 'Videojuegos', price: '$250', image: videojuegosImage },
        { id: 3, name: 'Accesorios', price: '$120', image: accessoriosImage }, 
      ];

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/category/${categoryName}`);
    }

  return (
    <div>
      <h1 className="product-title">Catalogo</h1>
        <div className="product-list">
            {products.map((product: any) => (
            <div className="product-card" key={product.id} onClick={() => handleCategoryClick(product.name)}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
            </div>
            ))}
        </div>
    </div>
  );
}

export default Product;
