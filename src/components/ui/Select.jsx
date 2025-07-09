// src/components/ui/Select.jsx
import React from 'react';

export function Select({ 
  id, 
  name,
  value, 
  onChange, 
  children,
  className = '',
  required = false,
  ...props 
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}