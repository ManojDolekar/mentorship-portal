import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TiltCard({ src, alt, title }) {
  const [rotate, setRotate] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateX = ((y - midY) / midY) * 8; // Reduced for smoother tilt
    const rotateY = ((x - midX) / midX) * 8;

    setRotate({ rotateX: -rotateX, rotateY: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div 
      className="inline-block m-4" 
      style={{
        perspective: '1000px', // <-- Key for real 3D feel
      }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer"
        style={{
          width: 250,
          transformStyle: 'preserve-3d', // <-- Important
        }}
        animate={rotate}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type:'spring', stiffness: 50, damping: 8 }} // Softer spring
      >
        <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
        <img
          width="100%"
          src={src}
          alt={alt}
          className="rounded-xl object-cover"
        />
      </motion.div>
    </div>
  );
}
