import React from 'react';

/**
 * Clean card container with subtle border and soft shadow
 */
export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 ${
        hoverable ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
