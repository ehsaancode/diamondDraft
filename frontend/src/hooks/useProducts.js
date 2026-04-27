import { useState, useEffect } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/products`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        const getImageUrl = (url) => url?.startsWith('http') ? url : `${apiUrl}${url}`;
        
        const dbProducts = data.map(p => ({
          id: p._id,
          name: p.name,
          brand: p.category || 'Jewelry',
          price: p.price,
          rating: 5.0,
          reviews: 0,
          image: p.images && p.images.length > 0 ? getImageUrl(p.images[0]) : '/images/jewellery_cad_ring.png',
          images: p.images ? p.images.map(img => getImageUrl(img)) : [],
          tag: p.category,
          status: p.status
        }));
        
        setProducts(dbProducts);
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
