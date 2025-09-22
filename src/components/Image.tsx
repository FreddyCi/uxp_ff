'use client';
import React from 'react';
import './Image.css';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function Image({ className = '', alt, ...props }: ImageProps) {
  return (
    <img
      alt={alt}
      className={`image ${className}`.trim()}
      {...props}
      style={{
        // UXP-compatible image styling
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
        display: 'block',
        ...props.style
      }}
    />
  );
}