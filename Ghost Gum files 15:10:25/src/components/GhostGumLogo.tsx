import React from 'react';

const GhostGumLogo = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M16 2C10 2 8 6 8 10C8 14 10 16 12 18C14 20 14 22 14 24C14 26 15 28 16 30C17 28 18 26 18 24C18 22 18 20 20 18C22 16 24 14 24 10C24 6 22 2 16 2Z" 
        fill="none" 
        stroke="#6A766B" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="16" cy="10" r="2" fill="#C6864F" opacity="0.6"/>
      <path 
        d="M12 12C12 12 14 14 16 14C18 14 20 12 20 12" 
        stroke="#6A766B" 
        strokeWidth="1" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default GhostGumLogo;