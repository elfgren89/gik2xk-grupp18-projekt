import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductList } from '../services/productService';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductList().then(setProducts);
  }, []);

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default ProductList;