import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';
import { products } from '../../data/products';

const BestSelling = () => {
  const sellingProducts = products.slice(0, 8);
  return (
    <section className="px-8 py-16 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-4xl font-serif text-black">Top Requested CADs</h2>
        <Link to="/shop" className="text-sm font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-wider mb-1">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12">
        {sellingProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
};

export default BestSelling;
