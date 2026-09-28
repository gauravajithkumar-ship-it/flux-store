import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const MouseEnterContext = createContext();

export const CardContainer = ({ children, className = '', maxTilt = 10, lift = 1.02, perspective = 1000 }) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const hasHover = useRef(false);

  useEffect(() => {
    hasHover.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  const reset = () => {
    setIsMouseEntered(false);
    if (containerRef.current) {
      containerRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  };

  const handlePointerMove = (e) => {
    if (!hasHover.current || !containerRef.current) return;
    const card = containerRef.current;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -maxTilt;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;

    card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${lift}, ${lift}, ${lift})`;
  };

  const handlePointerDown = () => {
    if (hasHover.current || !containerRef.current) return;
    containerRef.current.style.transform = `perspective(${perspective}px) rotateX(4deg) rotateY(0deg) scale3d(0.97, 0.97, 0.97)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={`[transform-style:preserve-3d] transition-transform duration-150 ease-out will-change-transform ${className}`}
        ref={containerRef}
        onPointerEnter={() => { setIsMouseEntered(true); }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={reset}
        onPointerCancel={reset}
      >
        {children}
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`[transform-style:preserve-3d] ${className}`}>
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = 'div',
  children,
  className = '',
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const ref = useRef(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag
      ref={ref}
      className={`transition-transform duration-200 ease-linear ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error('useMouseEnter must be used within a CardContainer');
  }
  return context;
};
