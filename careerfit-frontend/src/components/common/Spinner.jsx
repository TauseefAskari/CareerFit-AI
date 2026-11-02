import React from 'react';

/**
 * Accessible loading spinner component
 */
export function Spinner({ size = 'md', className = '', label = 'Loading...' }) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div role="status" className="inline-flex items-center gap-2">
      <div
        aria-hidden="true"
        className={`inline-block animate-spin motion-reduce:animate-none rounded-full border-solid border-current border-r-transparent align-[-0.125em] ${sizeMap[size] || sizeMap.md} ${className}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
