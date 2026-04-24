import { useState, useEffect } from 'react';
import { products as staticProducts } from '../data/products';

export const useProducts = () => {
  const [products, setProducts] = useState(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        const dbProducts = data.map(p => ({
          id: p._id,
          name: p.name,
          brand: p.category || 'Jewelry',
          price: p.price,
          rating: 5.0,
          reviews: 0,
          image: p.images && p.images.length > 0 ? `http://localhost:5000${p.images[0]}` : '/images/jewellery_cad_ring.png',
          images: p.images ? p.images.map(img => `http://localhost:5000${img}`) : [],
          tag: p.category,
          status: p.status
        }));
        
        setProducts([...dbProducts, ...staticProducts]);
      } catch (err) {
        console.error('Error fetching products from backend:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return { products, loading };
};
