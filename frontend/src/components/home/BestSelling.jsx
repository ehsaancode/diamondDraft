import React from 'react';
import ProductCard from '../ui/ProductCard';

const products = [
  {
    id: 1,
    name: 'Eternal Embrace Ring',
    brand: 'Lustro & Co.',
    price: 330.00,
    rating: 4.9,
    reviews: 2365,
    image: '/images/ring_1_1772534075731.png', // Fallback, could mock with actual if separated
    isLiked: false
  },
  {
    id: 2,
    name: 'Harmonic Serenity Ring',
    brand: 'Aurora Jewels',
    price: 325.00,
    rating: 4.9,
    reviews: 2365,
    image: '/images/ring_1_1772534075731.png',
    isLiked: true
  },
  {
    id: 3,
    name: 'Starlit Voyage Ring',
    brand: 'Gilded Grace',
    price: 300.00,
    rating: 4.9,
    reviews: 2365,
    image: '/images/ring_1_1772534075731.png',
    isLiked: false
  },
  {
    id: 4,
    name: 'Ember Glow Ring',
    brand: 'Soleil Gems',
    price: 350.00,
    rating: 4.9,
    reviews: 2365,
    image: '/images/ring_1_1772534075731.png',
    isLiked: false
  },
  {
    id: 5,
    name: 'Moonlit Serenade Ring',
    brand: 'Velvet Atelier',
    price: 380.00,
    rating: 4.9,
    reviews: 2365,
    image: '/images/ring_1_1772534075731.png',
    isLiked: false
  },
  {
    id: 6,
    name: 'Radiant Reverie Ring',
    brand: 'Opal & Ivy',
    price: 450.00,
    rating: 4.9,
    reviews: 2365,
    image: '/images/ring_1_1772534075731.png',
    isLiked: false
  },
];

const BestSelling = () => {
  return (
    <section className="px-8 py-16 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-4xl font-serif text-black">Best Selling</h2>
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-wider mb-1">
          Shop all
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
};

export default BestSelling;
