import React from 'react';
import logoImg from '../assets/logo-new.png';

export default function Logo({ size = 48, className = '' }) {
  return (
    <img 
      src={logoImg} 
      alt="JanVaani Logo" 
      style={{
        width: size, 
        height: size, 
        objectFit: 'contain', 
      }}
      className={className}
    />
  );
}
