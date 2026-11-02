import React from 'react';

export function BrandMark({ className = '' }) {
  return (
    <img
      src="/careerfit-logo.png?v=3"
      alt=""
      aria-hidden="true"
      className={`block shrink-0 rounded-lg object-cover ${className}`}
    />
  );
}
