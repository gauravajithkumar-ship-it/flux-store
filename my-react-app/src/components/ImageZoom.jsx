import React, { useState, useRef } from 'react';

const ImageZoom = ({ src, alt }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div className="relative w-full h-full group">
      {/* Container for main image */}
      <div 
        ref={imgRef}
        className="w-full aspect-square rounded-2xl overflow-hidden cursor-crosshair bg-white/5 relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Zoomed image overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: backgroundPosition,
            backgroundSize: '250%', // Zoom level
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
      
      {/* Hint for users */}
      <div className="absolute bottom-4 right-4 bg-midnight/80 backdrop-blur-sm text-white/70 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
        Hover to zoom
      </div>
    </div>
  );
};

export default ImageZoom;
