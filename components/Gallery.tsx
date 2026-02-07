
import React from 'react';

const images = [
  'https://images.unsplash.com/photo-1536520002442-9979694b0124?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517832606299-7ae914206e58?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1622288390846-6ac83b55c562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1621605815971-fbc54d5f359c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595476108112-678701c9053c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562923954-2de67512255e?q=80&w=800&auto=format&fit=crop',
];

const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-16">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-amber-400 uppercase">Nosso Trabalho</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer aspect-square">
            <img 
              src={src} 
              alt={`Trabalho de barbeiro ${index + 1}`} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;