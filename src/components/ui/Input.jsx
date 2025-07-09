// src/components/ui/Input.jsx
import React from 'react';

export function Input({ 
  id, 
  name,
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  className = '',
  required = false,
  ...props 
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200 ${className}`}
      {...props}
    />
  );
}