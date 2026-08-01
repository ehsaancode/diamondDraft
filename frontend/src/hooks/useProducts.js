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
              name: p.name,
              brand: p.category || 'Jewelry',
              category: p.category || 'Jewelry',
              subcategory: sub,
              price: p.price,
              rating: 5.0,
              reviews: 0,
              image:
                p.images && p.images.length > 0
                  ? getImageUrl(p.images[0])
                  : p.image || '/images/jewellery_cad_ring.png',
              images: p.images ? p.images.map((img) => getImageUrl(img)) : (p.image ? [p.image] : []),
              tag: sub,
              status: p.status,
              glbUrl: modelFileUrl ? getImageUrl(modelFileUrl) : null,
              modelUrl: modelFileUrl ? getImageUrl(modelFileUrl) : null,
              is3D: has3D,
              formats: p.formats || (has3D ? ['.fbx', '.obj', '.stl', '.blend', '.glb'] : []),
              polyCount: p.polyCount || (has3D ? 24500 : 0),
              vertexCount: p.vertexCount || (has3D ? 28000 : 0),
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
