import ProductCard from './ProductCard';
const ProductList = ({ products }: any) => (
  <div className="product-list">
    {products.map((product: any) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
export default ProductList;
