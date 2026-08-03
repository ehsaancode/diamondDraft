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

        if (Array.isArray(data) && data.length > 0) {
          const getImageUrl = (url) => (url?.startsWith('http') ? url : `${apiUrl}${url}`);

          const DEFAULT_SUBCATEGORIES = {
            Rings: 'Engagement',
            Necklaces: 'Pendants',
            Earrings: 'Studs',
            Bracelets: 'Tennis',
          };

          const dbProducts = data.map((p, index) => {
            const sub = p.subcategory || DEFAULT_SUBCATEGORIES[p.category] || '';
            const modelFileUrl = p.glbUrl || p.modelUrl || null;
            const has3D = !!modelFileUrl || p.category === '3D Models';

            return {
              id: p._id || p.id || `PRD-${index + 1}`,
              sku: p.sku || p._id || p.id,
              name: p.name,
              brand: p.category || 'Jewelry',
              category: p.category || 'Jewelry',
              subcategory: sub,
              price: Number(p.price) || 0,
              rating: p.rating !== undefined && p.rating !== null ? Number(p.rating) : 5.0,
              reviews: p.reviews !== undefined && p.reviews !== null ? Number(p.reviews) : 0,
              description: p.description || '',
              image:
                p.images && p.images.length > 0
                  ? getImageUrl(p.images[0])
                  : p.image || '/images/jewellery_cad_ring.png',
              images: p.images ? p.images.map((img) => getImageUrl(img)) : (p.image ? [p.image] : []),
              tag: sub,
              status: p.status || 'Active',
              glbUrl: modelFileUrl ? getImageUrl(modelFileUrl) : null,
              modelUrl: modelFileUrl ? getImageUrl(modelFileUrl) : null,
              usdzUrl: p.usdzUrl ? getImageUrl(p.usdzUrl) : null,
              is3D: has3D,
              formats: p.formats || (has3D ? ['.FBX', '.OBJ', '.STL', '.GLB'] : ['STL', '3DM', 'OBJ']),
              polyCount: Number(p.polyCount) || (has3D ? 45000 : 0),
              vertexCount: Number(p.vertexCount) || (has3D ? 52000 : 0),
              license: p.license || 'Royalty-Free',
              modelType: p.modelType || 'diamond'
            };
          });
          setProducts(dbProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.warn('Backend query error:', err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
